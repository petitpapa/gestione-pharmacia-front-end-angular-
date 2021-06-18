import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";
import { DateRangeResponse, MessageType, SaleQueryPeriodWem } from "../../../core/models";
import { VentesService } from "../../../core/services";
import { onNotificationMessage } from "../../../core/store/core.actions";
import { CoreState } from "../../../core/store/core.reducer";

@Component({
  selector: "app-query-period-dialog",
  templateUrl: "./query-period-dialog.component.html",
  styleUrls: ["./query-period-dialog.component.scss"],
})
export class QueryPeriodDialogComponent implements OnInit, OnDestroy {
  queriesPeriod: SaleQueryPeriodWem[];
  subscriptions$: Subscription[] = [];

  selectedQueryPeriod = new FormControl();

  startDate = new FormControl(new Date());
  endDate = new FormControl(new Date());
  constructor(
    private orderService: VentesService,
    private store: Store<CoreState>,
    public dialogRef: MatDialogRef<QueryPeriodDialogComponent>
  ) {}

  ngOnInit(): void {
    const queriesSub = this.loadqueriesPeriods();
    this.subscriptions$.push(queriesSub);

    this.selectedQueryPeriod.valueChanges.subscribe((newValue) => {
      const rangeDateSub = this.loadRangeDates(newValue);
      this.subscriptions$.push(rangeDateSub);
    });
  }

  private loadRangeDates(newValue: any) {
    return this.orderService
      .loadDateRangeQueries({ keyQuery: newValue })
      .subscribe((res) => {
        if (res.errorCode === 2) {
          this.dispatchError(res);
        } else {
          this.startDate.setValue(res.startDate);
          this.endDate.setValue(res.endDate);
        }
      });
  }

  private dispatchError(res: DateRangeResponse) {
    this.store.dispatch(
      onNotificationMessage({
        msgType: MessageType.ERROR,
        msg: "Une erreur c est produite: ".concat(res.errorMessage),
      })
    );
  }

  private loadqueriesPeriods() {
    return this.orderService.loadSaleePeriodQueries().subscribe((res) => {
      if (res.errorCode === 2) {
        this.store.dispatch(
          onNotificationMessage({
            msgType: MessageType.ERROR,
            msg: "Une erreur c est produite: ".concat(res.errorMessage),
          })
        );
      } else {
        this.queriesPeriod = res.queriesPeriod;
      }
    });
  }

  sendDateRange(): void {
    this.dialogRef.close({startDate: new Date(this.startDate.value), endDate: new Date(this.endDate.value)});
  }
  ngOnDestroy(): void {
    this.subscriptions$.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
