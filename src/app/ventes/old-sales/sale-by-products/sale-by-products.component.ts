import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import moment from "moment";
import {MatPaginator} from "@angular/material/paginator";
import {QueryPeriodDialogComponent} from "../query-period-dialog/query-period-dialog.component";
import {onNotificationMessage} from "../../../core/store/core.actions";
import {MessageType} from "../../../core/models";
import {MatDialog} from "@angular/material/dialog";
import {VentesService} from "../../../core/services";
import {Store} from "@ngrx/store";
import {CoreState} from "../../../core/store/core.reducer";

@Component({
  selector: 'app-sale-by-products',
  templateUrl: './sale-by-products.component.html',
  styleUrls: ['./sale-by-products.component.scss']
})
export class SaleByProductsComponent implements OnInit {
  salesByProductsColumns: string[] = ["form", "name", "qty", "stock", "price"];

  salesByProductsDataSource = new MatTableDataSource<any>();

  startDate = moment(new Date()).format(" D MM YYYY");
  endDate = moment(new Date()).format(" D MM YYYY");
  private isLoading: boolean;

  @ViewChild("productPaginator") set productPaginator(pager: MatPaginator) {
    if (pager) this.salesByProductsDataSource.paginator = pager;
  }

  constructor( public dialog: MatDialog,
               private orderService: VentesService,
               private store: Store<CoreState>,) { }

  async ngOnInit(): Promise<void> {
    this.isLoading = true;

    await this.salesByProducts({ startDate: new Date(), endDate: new Date() });
    this.isLoading = false;
  }

  applyFilterOnSaleByProduct(event: Event): void {
    this.applyFilter(event, this.salesByProductsDataSource);
  }

  applyFilter(event: Event, dataSource: MatTableDataSource<any>): void {
    const filterValue = (event.target as HTMLInputElement).value;
    dataSource.filter = filterValue.trim().toLowerCase();

    if (dataSource.paginator) {
      dataSource.paginator.firstPage();
    }
  }


  async openQueryPeriodDialog(): Promise<void> {
    const dialogRef = this.dialog.open(QueryPeriodDialogComponent);
    const result = await dialogRef.afterClosed().toPromise();
    this.startDate = moment(result?.startDate).format(" D MM YYYY");
    this.endDate = moment(result?.endDate).format(" D MM YYYY");
    this.isLoading = true;
    await this.salesByProducts(result);
    this.isLoading = false;
  }
  private async salesByProducts(dateRange: any) {
    const response = await this.orderService
      .loadSalesByProducts(dateRange)
      .toPromise();

    if (response?.errorCode === 2) {
      this.dispatchError(response);
    } else {
      this.salesByProductsDataSource.data = response?.salesProducts;
    }
  }

  private dispatchError(res: any) {
    this.store.dispatch(
      onNotificationMessage({
        msgType: MessageType.ERROR,
        msg: res?.errorMessage,
      })
    );
  }


}
