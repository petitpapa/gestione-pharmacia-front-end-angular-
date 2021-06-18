import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {Proposal} from "../../core/models/product.proposal.response";
import {ProductService} from "../../core/services/products/product.service";
import {Store} from "@ngrx/store";
import {CoreState} from "../../core/store/core.reducer";
import {Subscription} from "rxjs";
import {onNotificationMessage} from "../../core/store/core.actions";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {CommandSystemType} from "../../core/models/command.system.type";
import {FormControl, FormGroupDirective, NgForm, Validators} from "@angular/forms";
import {SelectionModel} from "@angular/cdk/collections";
import {ErrorStateMatcher} from "@angular/material/core";
import {BaseModel} from "../../core/models";

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-product-proposal-config',
  templateUrl: './product-proposal-config.component.html',
  styleUrls: ['./product-proposal-config.component.scss']
})
export class ProductProposalConfigComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['select', 'form', 'category', 'name', 'salePrice', 'commandSystem', 'min', 'max'];
  dataSource: MatTableDataSource<Proposal>;
  selection = new SelectionModel<Proposal>(true, []);

  minFormControl = new FormControl('', [
    Validators.required
  ]);

  maxFormControl = new FormControl('', [
    Validators.required
  ]);

  statisticFormControl = new FormControl('', [
    Validators.required
  ]);


  matcher = new MyErrorStateMatcher();


  @ViewChild("proposalPaginator") set proposalPaginator(
    pager: MatPaginator
  ) {
    if (pager) this.dataSource.paginator = pager;
  }

  @ViewChild(MatSort) sort: MatSort;

  subscriptions: Subscription[] = [];

  listOfCommandSystem: CommandSystemType[] = [];
  commandSystemCtrl = new FormControl();
  selectedCommandSystem: CommandSystemType;
  isLoading = false;

  constructor(private productService: ProductService, private store: Store<CoreState>) {
  }

  ngOnInit(): void {
    const sc = this.commandSystemCtrl.valueChanges.subscribe(s => {
      this.selectedCommandSystem = s;
    });
    this.subscriptions.push(sc);
    this.listOfCommandSystem = Object.values(CommandSystemType);
    this.isLoading = true;
    const subs = this.productService.loadProductsForProposal().subscribe(res => {
      if (res?.errorCode == 2) {
        this.store.dispatch(onNotificationMessage({msgType: 'ERROR', msg: res?.errorMessage}));
        this.isLoading = false;
        return;
      }
      this.dataSource = new MatTableDataSource<Proposal>(res.proposals);
      this.dataSource.sort = this.sort;
      this.isLoading = false;
    });
    this.subscriptions.push(subs);
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Proposal): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.productId + 1}`;
  }

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  updateProductsForProposal() {
    if (this.selection.selected.length === 0) return;
    const request = {
      products: this.selection.selected.map((p: Proposal) => p.productId)
    };

    if (this.selectedCommandSystem === 'MIN_MAX') {
      if (!this.minFormControl.valid || !this.maxFormControl.valid) return;
      request['min'] = this.minFormControl.value;
      request['max'] = this.maxFormControl.value;
    }

    if (this.selectedCommandSystem === 'STOCK_COVERAGE_DAY') {
      if (!this.minFormControl.valid || !this.maxFormControl.valid || !this.statisticFormControl.valid) return;
      request['min'] = this.minFormControl.value;
      request['max'] = this.maxFormControl.value;
      request['statisticalPeriod'] = this.statisticFormControl.value;
    }
    request['commandSystem'] = this.selectedCommandSystem
    this.productService.updateProductsForProposal(request).subscribe((res: BaseModel) => {
      if (res?.errorCode == 2) {
        this.store.dispatch(onNotificationMessage({msgType: 'ERROR', msg: res?.errorMessage}));
      }
      if (res?.errorCode === 0) {
        this.store.dispatch(onNotificationMessage({msgType: 'SUCCESS', msg: res?.errorMessage}));
      }
    });

  }
}
