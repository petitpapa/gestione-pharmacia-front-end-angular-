import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Store } from "@ngrx/store";
import { IncomeExpenseService } from "../../core/services";
import {DateUtils} from "../../core/utils/date.utils";
import {
  onNextOpeningCashFund,
  onNotificationMessage,
} from "../../core/store/core.actions";
import { CoreState } from "../../core/store/core.reducer";
import { DailyCalendarDialogComponent } from "./daily-calendar-dialog/daily-calendar-dialog.component";

@Component({
  selector: "app-daily-income-expense",
  templateUrl: "./daily-income-expense.component.html",
  styleUrls: ["./daily-income-expense.component.scss"],
})
export class DailyIncomeExpenseComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    private incomesExpensesSrv: IncomeExpenseService,
    private store: Store<CoreState>
  ) {}
  localDate = new Date();
  isLoading = false;
  data;
  formattedDate;
  previousFund = 0;
  nextOpeningCashFund = new FormControl(0, { updateOn: "blur" });

  amountToTake = 0;
  fund = 0;
  ngOnInit(): void {
    this.nextOpeningCashFund.valueChanges.subscribe((newValue) => {
      this.previousFund = this.fund;
      if (newValue <= this.amountToTake) {
        this.fund = newValue;
      } else {
        this.nextOpeningCashFund.setValue (this.fund);
      }

      if (this.data?.sold - this.fund >= 0) {
        this.amountToTake = this.data?.sold - this.fund;
        this.store.dispatch(
          onNextOpeningCashFund({ openingCashFund: this.fund })
        );
      }
    });
    this.openDialog();
  }

  public async openDialog(): Promise<void> {
    const dialogRef = this.dialog.open(DailyCalendarDialogComponent, {
      width: "60%",
    });

    const onDate = await dialogRef.afterClosed().toPromise();
    this.localDate = onDate?.chosenDate;
    this.formattedDate =  DateUtils.formatDate(this.localDate);
    this.isLoading = true;
    const response = await this.incomesExpensesSrv
      .dailyCashRegister({ localDate: this.localDate })
      .toPromise();
    if (response.errorCode === 2) {
      this.store.dispatch(
        onNotificationMessage({ msgType: "ERROR", msg: response?.errorMessage })
      );
      this.isLoading = false;
    }
    if (response.errorCode === 0) {
      this.data = response;
      this.amountToTake = this.data.sold - this.fund;
      this.isLoading = false;
    }
  }
}
