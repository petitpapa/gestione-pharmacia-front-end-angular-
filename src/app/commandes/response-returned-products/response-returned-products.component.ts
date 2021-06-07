import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {CommandsService} from "../../core/services";
import {MessageType, SupplierWem} from "../../core/models";
import {Subscription} from "rxjs";
import {Store} from "@ngrx/store";
import {CoreState} from "../../core/store/core.reducer";
import {onNotificationMessage} from "../../core/store/core.actions";
import {ReturnedProduct, ReturnedProductResponse} from "../../core/models/product.return.response";
import {MatDialog} from "@angular/material/dialog";
import {DetailsOfSupplierReturnedProductDialogComponent} from "./details-of-supplier-returned-product-dialog/details-of-supplier-returned-product-dialog.component";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import * as _ from 'lodash-es';

@Component({
  selector: 'app-response-returned-products',
  templateUrl: './response-returned-products.component.html',
  styleUrls: ['./response-returned-products.component.scss']
})
export class ResponseReturnedProductsComponent implements OnInit, OnDestroy {
  suppliers: SupplierWem[] = [];
  subscriptions: Subscription[] = [];

  isLoading = false;

  displayedColumns: string[] = ['position','productName', 'form', 'dateOfIssue', 'description','reason', 'action'];
  rejectedDisplayedColumns: string[] = ['position','productName', 'form', 'dateOfIssue', 'Qty','description', 'reason'];
  dataSource = new MatTableDataSource<ReturnedProduct>();
  rejectedProductReturnedDataSource = new MatTableDataSource<ReturnedProduct>();

  @ViewChild("responseAvoirsPaginator") set responseAvoirsPaginator(
    pager: MatPaginator
  ) {
    if (pager) this.dataSource.paginator = pager;
  }

  @ViewChild("rejectedAvoirsPaginator") set rejectedAvoirsPaginator(
    pager: MatPaginator
  ) {
    if (pager) this.rejectedProductReturnedDataSource.paginator = pager;
  }

  constructor(private commandService: CommandsService, private store: Store<CoreState>, public dialog: MatDialog) {
  }

  ngOnInit(): void {

    this.isLoading = true;
    const suppliersSubs = this.commandService.loadSuppliersWithReturnedProductsNotCompleted().subscribe(response => {
      if (response.errorCode === 2) {
        this.store.dispatch(onNotificationMessage({msgType: MessageType.ERROR, msg: response.errorMessage}));
      } else {
        this.suppliers = response?.container?.suppliers;
        this.isLoading = false;
      }
    });
    this.subscriptions.push(suppliersSubs);
  }

  ngOnDestroy(): void {
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }

  loadAllReturnedProduct(supplier: SupplierWem) {
    this.isLoading = true;
    const subs = this.commandService.loadReturnedProductOfSupplierNotCompleted(supplier.id).subscribe(response => {
      if (response?.errorCode === 2) {
        this.store.dispatch(onNotificationMessage({msgType: MessageType.ERROR, msg: response?.errorMessage}));
      } else {
        this.dataSource.data = response.returnedProducts;
      }
      this.isLoading = false;
    });
    this.subscriptions.push(subs);
  }

  openDetails(returnedProductId: number): void {
    const returned = _.find(this.dataSource.data, (p) => p.productId === returnedProductId);
    if (returned) {
      const dialogRef = this.dialog.open(DetailsOfSupplierReturnedProductDialogComponent, {
        width: '1200px',
        data: returned
      });

      const sub$ = dialogRef.afterClosed().subscribe(product => {
        if (product)
          this.sendProductReturn(product);
      });
      this.subscriptions.push(sub$);
    }
  }

  sendProductReturn(product: ReturnedProduct): void {
    const productToUpdate = [];
    productToUpdate.push(product);
    const subs$ = this.commandService.updateReturnedProductOfSupplier(productToUpdate).subscribe((response) => {

      if (response?.errorCode === 2) {
        this.store.dispatch(
          onNotificationMessage({
            msgType: MessageType.ERROR,
            msg: "Une erreur c est produite: ".concat(response.errorMessage),
          })
        );
      }
      if (response?.errorCode === 0) {
        this.store.dispatch(onNotificationMessage({
          msgType: MessageType.SUCCESS,
          msg: "Mofifier avec succes",
        }));
      }
    });
    this.subscriptions.push(subs$);
  }

  listOfRejectedProducts(supplier: SupplierWem): void{
   // this.isLoading = true;
    const subs = this.commandService.loadRejectedProductsReturned(supplier.id).subscribe(response => {
      if (response?.errorCode === 2) {
        this.store.dispatch(onNotificationMessage({msgType: MessageType.ERROR, msg: response?.errorMessage}));
      } else {
        this.rejectedProductReturnedDataSource.data = response.returnedProducts;
        console.log(response.returnedProducts)
      }
    //  this.isLoading = false
    });
    this.subscriptions.push(subs);
  }
}
