import { Location } from "@angular/common";
import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { Store } from "@ngrx/store";
import moment from "moment";
import { Subscription } from "rxjs";
import { MessageType } from "../../core/models";
import { VentesService } from "../../core/services";
import { onNotificationMessage } from "../../core/store/core.actions";
import { CoreState } from "../../core/store/core.reducer";
import { QueryPeriodDialogComponent } from "./query-period-dialog/query-period-dialog.component";
@Component({
  selector: "app-old-sales",
  templateUrl: "./old-sales.component.html",
  styleUrls: ["./old-sales.component.scss"],
})
export class OldSalesComponent implements OnInit, OnDestroy {
  isLoading = false;
  displayedColumns: string[] = ["id", "date", "name", "action"];
  salesByProductsColumns: string[] = ["form", "name", "qty", "stock", "price"];

  detailsDataSource = new MatTableDataSource<any>();
  salesByProductsDataSource = new MatTableDataSource<any>();

  subscriptions$: Subscription[] = [];

  startDate = moment(new Date()).format(" D MM YYYY");
  endDate = moment(new Date()).format(" D MM YYYY");

  @ViewChild("detailsPaginator") set detailsPaginator(pager: MatPaginator) {
    if (pager) this.detailsDataSource.paginator = pager;
  }

  @ViewChild("productPaginator") set productPaginator(pager: MatPaginator) {
    if (pager) this.salesByProductsDataSource.paginator = pager;
  }

  constructor(
    public dialog: MatDialog,
    private orderService: VentesService,
    private store: Store<CoreState>,
    private location: Location
  ) {}

  async ngOnInit(): Promise<void> {
    this.isLoading = true;
    await this.loadSaleDetails({ startDate: new Date(), endDate: new Date() });
    await this.salesByProducts({ startDate: new Date(), endDate: new Date() });
    this.isLoading = false;
  }

  applyFilter(event: Event, dataSource: MatTableDataSource<any>): void {
    const filterValue = (event.target as HTMLInputElement).value;
    dataSource.filter = filterValue.trim().toLowerCase();

    if (dataSource.paginator) {
      dataSource.paginator.firstPage();
    }
  }

  applyFilterOnSaleByProduct(event: Event): void {
    this.applyFilter(event, this.salesByProductsDataSource);
  }

  applyFilterOnDetailSource(event: Event): void {
    this.applyFilter(event, this.detailsDataSource);
  }

  async openQueryPeriodDialog(): Promise<void> {
    const dialogRef = this.dialog.open(QueryPeriodDialogComponent);
    const result = await dialogRef.afterClosed().toPromise();
    this.startDate = moment(result?.startDate).format(" D MM YYYY");
    this.endDate = moment(result?.endDate).format(" D MM YYYY");
    this.isLoading = true;
    await this.loadSaleDetails(result);
    await this.salesByProducts(result);
    this.isLoading = false;
  }

  private async loadSaleDetails(result: any) {
    const details = await this.orderService.loadSaleByRange(result).toPromise();
    if (details?.errorCode === 2) {
      this.dispatchError(details);
    } else {
      this.detailsDataSource.data = details?.details;
    }
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

  back(): void {
    this.location.back();
  }

  ngOnDestroy(): void {
    this.subscriptions$.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
