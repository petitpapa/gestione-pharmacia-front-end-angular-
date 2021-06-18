import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {QueryPeriodDialogComponent} from "../query-period-dialog/query-period-dialog.component";
import moment from "moment";
import {MatDialog} from "@angular/material/dialog";
import {VentesService} from "../../../core/services";
import {Store} from "@ngrx/store";
import {CoreState} from "../../../core/store/core.reducer";
import {onNotificationMessage} from "../../../core/store/core.actions";
import {MessageType} from "../../../core/models";

@Component({
  selector: 'app-details-by-products',
  templateUrl: './details-by-products.component.html',
  styleUrls: ['./details-by-products.component.scss']
})
export class DetailsByProductsComponent implements OnInit {
  isLoading = false;
  displayedColumns: string[] = ["id", "date", "name", "action"];
  detailsDataSource = new MatTableDataSource<any>();

  @ViewChild("detailsPaginator") set detailsPaginator(pager: MatPaginator) {
    if (pager) this.detailsDataSource.paginator = pager;
  }

  startDate = moment(new Date()).format(" D MM YYYY");
  endDate = moment(new Date()).format(" D MM YYYY");

  constructor(public dialog: MatDialog,
              private orderService: VentesService,
              private store: Store<CoreState>,) {
  }

  async ngOnInit(): Promise<void> {
    this.isLoading = true;
    await this.loadSaleDetails({startDate: new Date(), endDate: new Date()});
    this.isLoading = false;
  }

  async openQueryPeriodDialog(): Promise<void> {
    const dialogRef = this.dialog.open(QueryPeriodDialogComponent);
    const result = await dialogRef.afterClosed().toPromise();
    this.startDate = moment(result?.startDate).format(" D MM YYYY");
    this.endDate = moment(result?.endDate).format(" D MM YYYY");
    this.isLoading = true;
    await this.loadSaleDetails(result);
    this.isLoading = false;
  }

  private async loadSaleDetails(result: any) {
    const details = await this.orderService.loadSaleByRange(result).toPromise();
    if (details?.errorCode === 2) {
      this.dispatchError(details);
      return;
    }
    this.detailsDataSource.data = details?.details;
  }

  private dispatchError(res: any) {
    this.store.dispatch(
      onNotificationMessage({
        msgType: MessageType.ERROR,
        msg: res?.errorMessage,
      })
    );
  }

  applyFilterOnDetailSource(event: Event): void {
    this.applyFilter(event, this.detailsDataSource);
  }

  applyFilter(event: Event, dataSource: MatTableDataSource<any>): void {
    const filterValue = (event.target as HTMLInputElement).value;
    dataSource.filter = filterValue.trim().toLowerCase();

    if (dataSource.paginator) {
      dataSource.paginator.firstPage();
    }
  }

}
