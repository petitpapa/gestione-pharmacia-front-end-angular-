import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";
import { FormProductWem, FormWem } from "../../core/models/form.response";
import { SettingsService } from "../../core/services/settings/settings.service";
import { CoreState } from "../../core/store/core.reducer";
import { selectCurrentIndex } from "../../core/store/core.selector";
import {
  onNextPage,
  onNotificationMessage,
} from "../../core/store/core.actions";
import { Product, ProductResponse } from "../../core/models/product.response";
import { MessageType } from "../../core/models";
import { SelectionModel } from "@angular/cdk/collections";
@Component({
  selector: "app-formes",
  templateUrl: "./formes.component.html",
  styleUrls: ["./formes.component.scss"],
})
export class FormesComponent implements OnInit, OnDestroy, AfterViewInit {
  displayedProductFormDescriptionColumns: string[] = [
    "select",
    "description",
    "forme",
    "rayon",
  ];
  formProductDisplayedColumns: string[] = ["id", "name"];
  displayedColumns: string[] = ["id", "description", "load"];

  selection = new SelectionModel<Product>(true, []);

  data: FormWem[];

  productFormDescriptionData: Product[];

  formDataSource: MatTableDataSource<FormWem>;
  formProductsDataSource: MatTableDataSource<FormProductWem>;
  productFormDescriptionDs: MatTableDataSource<Product>;

  pageIndex = -1;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatPaginator, { static: true }) formProductPaginator: MatPaginator;
  @ViewChild(MatPaginator, { static: true })
  productFormDescriptionpaginator: MatPaginator;

  selectedForm = -1;

  subscriptions$: Subscription[] = [];

  isLoading = false;

  editMode = false;

  toUpdate: FormWem = {
    id: -1,
    description: "",
    oldDescription: "",
  };

  nameFormControl = new FormControl("", [Validators.required]);

  constructor(
    private service: SettingsService,
    private _store: Store<CoreState>
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    const pageSubscription = this._store
      .select(selectCurrentIndex)
      .subscribe((index) => {
        this.pageIndex = index;
      });

    if (this.pageIndex !== -1) {
      const formSubscription = this.service
        .loadAllForms(this.pageIndex)
        .subscribe((d) => {
          this.data = d.container.forms;
          this.formDataSource = new MatTableDataSource<FormWem>(this.data);
          this.formDataSource.paginator = this.paginator;
          this._store.dispatch(
            onNextPage({ currentIndex: 0, isLast: false, isFirst: false })
          );
          this.isLoading = false;
        });

      this.subscriptions$.push(formSubscription);
      this.subscriptions$.push(pageSubscription);
    }

    const productDesc = this.service
      .loadProductWithRayonAndFormDescription()
      .subscribe((res: ProductResponse) => {
        if (res.errorCode === 2) {
          this._store.dispatch(
            onNotificationMessage({
              msgType: MessageType.ERROR,
              msg: "Une erreur c est produite: ".concat(res.errorMessage),
            })
          );
        } else {
          this.productFormDescriptionData = res.container.products;
          this.productFormDescriptionDs = new MatTableDataSource<Product>(
            this.productFormDescriptionData
          );
          console.log(this.productFormDescriptionDs);
          //  this.productFormDescriptionDs.paginator = this.productFormDescriptionpaginator;
        }
      });
    this.subscriptions$.push(productDesc);
  }
  loadSelectedFormProducts(id: number): void {
    this.service.loadFormProducts(id).subscribe((d) => {
      const formProductData = d.container.products;
      this.selectedForm = id;
      this.formProductsDataSource = new MatTableDataSource<FormProductWem>(
        formProductData
      );
      this.formProductsDataSource.paginator = this.formProductPaginator;

    });
  }

  applyFilterOnForms(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.formDataSource.filter = filterValue.trim().toLowerCase();
  }

  applyFilterOnFormProducts(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.formProductsDataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnDestroy(): void {
    this.subscriptions$.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  modifyCurrentRow(element: FormWem): void {
    this.editMode = true;
    this.toUpdate = { ...element, oldDescription: element.description };
    console.log(this.toUpdate);
  }

  update(): void {
    const form = this.formDataSource.data.find(
      (f) => (f.id = this.toUpdate.id)
    );
    if (form) {
      form.description = this.nameFormControl.value;
    }
    this.toUpdate = {
      id: -1,
      description: "",
      oldDescription: "",
    };
    this.nameFormControl.reset();

    this.editMode = false;
  }

  cancel(): void {
    this.toUpdate = {
      ...this.toUpdate,
      description: this.toUpdate.oldDescription,
    };
    this.editMode = false;
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.productFormDescriptionDs.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle(): void {
    this.isAllSelected()
      ? this.selection.clear()
      : this.productFormDescriptionDs.data.forEach((row) =>
          this.selection.select(row)
        );
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Product): string {
    if (!row) {
      return `${this.isAllSelected() ? "select" : "deselect"} all`;
    }
    return `${this.selection.isSelected(row) ? "deselect" : "select"} row ${
      row.id + 1
    }`;
  }

  ngAfterViewInit(): void {
    

    this.productFormDescriptionDs.paginator = this.productFormDescriptionpaginator;
  }
}
