import { SelectionModel } from "@angular/cdk/collections";
import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { Store } from "@ngrx/store";
import { forkJoin, Subscription } from "rxjs";
import {
  CategoryResponse,
  CategoryWem,
  MessageType,
  Product,
} from "../../core/models";
import { Rayon, RayonWem } from "../../core/models/rayons";
import { ProductService } from "../../core/services/products/product.service";
import { SettingsService } from "../../core/services";
import { onNotificationMessage } from "../../core/store/core.actions";
import { CoreState } from "../../core/store/core.reducer";
import * as _ from "lodash-es";
import { MatDialog } from "@angular/material/dialog";
import { CategoriesConfirmDialogComponent } from "./categories-confirm-dialog/categories-confirm-dialog.component";

@Component({
  selector: "app-categories",
  templateUrl: "./categories.component.html",
  styleUrls: ["./categories.component.scss"],
})
export class CategoriesComponent implements OnInit, OnDestroy {
  isLoading = true;
  products: Product[];
  subcriptions$: Subscription[] = [];

  categoryColumns: string[] = ["id", "description"];

  categoryDataSource: MatTableDataSource<CategoryWem>;

  @ViewChild("categoryPaginator") set categoryPaginator(pager: MatPaginator) {
    if (pager) this.categoryDataSource.paginator = pager;
  }

  //@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  resultsLength = 0;

  categories: CategoryWem[] = [];
  rayons: RayonWem[] = [];

  selectedCategoryId = new FormControl("-1");
  displayedColumns: string[] = ["select", "form", "name", "rayon", "famille"];
  dataSource: MatTableDataSource<Product>;

  @ViewChild("productPaginator") set productPaginator(pager: MatPaginator) {
    if (pager) this.dataSource.paginator = pager;
  }
  selection = new SelectionModel<Product>(true, []);

  changeCategoryId = new FormControl();
  selectedRayonId = new FormControl();

  constructor(
    private settingService: SettingsService,
    private store: Store<CoreState>,
    public dialog: MatDialog,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.updateProductsOnCategoryChange();
    const subCategories = this.settingService.loadCategoryWithRelatedProducts();

    const subRayons = this.settingService.loadRayons();

    const sub = forkJoin([subCategories, subRayons]).subscribe((results) => {
      this.loadCategoriesAndRayons(results);
    });

    this.subcriptions$.push(sub);
  }

  private loadCategoriesAndRayons(results: [CategoryResponse, Rayon]) {
    const categoryResponse = results[0];
    const rayonResponse = results[1];
    if (categoryResponse.errorCode === 2) {
      this.dispatchError(categoryResponse);
    } else if (rayonResponse.errorCode === 2) {
      this.dispatchError(rayonResponse);
    } else {
      this.categories = categoryResponse.container.categories;
      this.categoryDataSource = new MatTableDataSource<CategoryWem>(
        this.categories
      );

      this.flatten(categoryResponse);

      this.dataSource = new MatTableDataSource<Product>(this.products);

      this.dataSource.paginator = this.productPaginator;
     
      this.rayons = rayonResponse.container.rayons;
      this.isLoading = false;
    }
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.categoryDataSource.filter = filterValue.trim().toLowerCase();
  }

  private flatten(categoryResponse: CategoryResponse) {
    this.products = categoryResponse.container.categories
      .map((category) => category.products)
      .reduce((flat, toFlatten) => flat.concat(toFlatten), []);
  }

  private updateProductsOnCategoryChange() {
    const sub = this.selectedCategoryId.valueChanges.subscribe((newValue) => {
      if (+newValue === -1) {
        this.dataSource.data = this.products;
      } else {
        const products = this.categories
          .filter((c) => c.id === +newValue)
          .map((selected) => selected.products)
          .flat(1);
        if (products) {
          this.dataSource.data = products;
        }
      }
    });
    this.subcriptions$.push(sub);
  }

  private dispatchError(res: any) {
    this.store.dispatch(
      onNotificationMessage({
        msgType: MessageType.ERROR,
        msg: "Une erreur c est produite: ".concat(res.errorMessage),
      })
    );
  }

  ngOnDestroy(): void {
    this.subcriptions$.forEach((s) => {
      if (s) s.unsubscribe();
    });
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected(): boolean {
    if (this.dataSource) {
      const numSelected = this.selection.selected.length;
      const numRows = this.dataSource.data.length;
      return numSelected === numRows;
    }
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle(): void {
    this.dataSource && this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
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

  changeRayonForSelectedProducts(): void {
    const name = "rayon";
    const rayon = this.rayons.find((r) => r.id === +this.selectedRayonId.value);
    if (rayon) {
      const dialogRef = this.dialog.open(CategoriesConfirmDialogComponent, {
        width: "550px",
        data: { name: name, description: rayon.description },
      });

      const sub = dialogRef.afterClosed().subscribe((result) => {
        if (result === "confirm") {
          console.log(this.selection.selected);
          const productIds = this.selection.selected.map((p) => p.id);
          this.productService
            .updateProducts({
              rayonRequest: { id: rayon.id },
              productIds: productIds,
            })
            .subscribe((res) => {
              if (res.errorCode == 2) this.dispatchError(res);
              else {
                this.isLoading = true;
                const subCategories = this.settingService.loadCategoryWithRelatedProducts();
                const subRayons = this.settingService.loadRayons();

                const sub = forkJoin([subCategories, subRayons]).subscribe(
                  (results) => {
                    this.loadCategoriesAndRayons(results);
                  }
                );
                this.selection = new SelectionModel<Product>(true, []);
                this.subcriptions$.push(sub);
              }
            });
        }
      });
      this.subcriptions$.push(sub);
    }
  }

  changeCategoryForSelectedProducts(): void {
    const name = "type";
    const category = this.categories.find(
      (r) => r.id === +this.changeCategoryId.value
    );
    if (category) {
      const dialogRef = this.dialog.open(CategoriesConfirmDialogComponent, {
        width: "550px",
        data: { name: name, description: category.decription },
      });

      const sub = dialogRef.afterClosed().subscribe((result) => {
        if (result === "confirm") {
          const productIds = this.selection.selected.map((p) => p.id);
          this.productService
            .updateProducts({
              categoryRequest: { id: category.id },
              productIds: productIds,
            })
            .subscribe((res) => {
              if (res.errorCode == 2) this.dispatchError(res);
              else {
                this.isLoading = true;
                const subCategories = this.settingService.loadCategoryWithRelatedProducts();
                const subRayons = this.settingService.loadRayons();

                const sub = forkJoin([subCategories, subRayons]).subscribe(
                  (results) => {
                    this.loadCategoriesAndRayons(results);
                  }
                );
                this.selection = new SelectionModel<Product>(true, []);
                this.subcriptions$.push(sub);
              }
            });
        }
      });
      this.subcriptions$.push(sub);
    }
  }
}
