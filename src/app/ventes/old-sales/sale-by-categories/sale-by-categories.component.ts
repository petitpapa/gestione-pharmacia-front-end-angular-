import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import moment from "moment";
import {MatPaginator} from "@angular/material/paginator";
import {MatDialog} from "@angular/material/dialog";
import {VentesService} from "../../../core/services";
import {Store} from "@ngrx/store";
import {CoreState} from "../../../core/store/core.reducer";
import {QueryPeriodDialogComponent} from "../query-period-dialog/query-period-dialog.component";
import {onNotificationMessage} from "../../../core/store/core.actions";
import {MessageType} from "../../../core/models";

@Component({
  selector: 'app-sale-by-categories',
  templateUrl: './sale-by-categories.component.html',
  styleUrls: ['./sale-by-categories.component.scss']
})
export class SaleByCategoriesComponent implements OnInit {

  salesByCategoryColumns: string[] = ["category", "qty", "ppv"];

  salesByCategoriesDataSource = new MatTableDataSource<any>();

  startDate = moment(new Date()).format(" D/MM/YYYY");
  endDate = moment(new Date()).format(" D/MM/YYYY");
  private isLoading: boolean;

  @ViewChild("saleCategoriesPaginator") set productPaginator(pager: MatPaginator) {
    if (pager) this.salesByCategoriesDataSource.paginator = pager;
  }

  constructor( public dialog: MatDialog,
               private orderService: VentesService,
               private store: Store<CoreState>,) { }

  async ngOnInit(): Promise<void> {
    this.isLoading = true;
    await this.salesByCategories({ startDate: new Date(), endDate: new Date() });
    this.isLoading = false;
  }

  applyFilterOnSaleByProduct(event: Event): void {
    this.applyFilter(event, this.salesByCategoriesDataSource);
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
    this.startDate = moment(result?.startDate).format(" D/MM/YYYY");
    this.endDate = moment(result?.endDate).format(" D/MM/YYYY");
    this.isLoading = true;
    await this.salesByCategories(result);
    this.isLoading = false;
  }
  private async salesByCategories(dateRange: any) {
    const response = await this.orderService
      .loadSalesByCategories(dateRange)
      .toPromise();

    if (response?.errorCode === 2) {
      this.dispatchError(response);
    } else {
      this.salesByCategoriesDataSource.data = response?.results;
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
