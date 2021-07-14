import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";
import { IncomeExpenseService } from "../../core/services";
import { onNotificationMessage } from "../../core/store/core.actions";
import { CoreState } from "../../core/store/core.reducer";

@Component({
  selector: "app-operation",
  templateUrl: "./operation.component.html",
  styleUrls: ["./operation.component.scss"],
})
export class OperationComponent implements OnInit, OnDestroy {
  operationFormGroup = new FormGroup({
    description: new FormControl(""),
    amount: new FormControl(0),
    operationDate: new FormControl(""),
    operation: new FormControl(""),
  });

  options: [] = [];

  subscriptions$: Subscription[] = [];

  constructor(
    private incomeExpenseSrv: IncomeExpenseService,
    private store: Store<CoreState>
  ) {}

  ngOnInit(): void {
    const sub = this.incomeExpenseSrv.allWordings().subscribe((response) => {
      if (!response?.ok) {
        this.store.dispatch(onNotificationMessage(response));
      }
      if (response?.errorCode === 0) {
        this.options = response.descriptions;
      }
    });
    this.subscriptions$.push(sub);
  }

  onSubmit(): void {
    const incomeExpense = { ...this.operationFormGroup.value };

    if (incomeExpense["operation"] === "recette") {
      incomeExpense["isIncome"] = true;
    }
    if (incomeExpense["operation"] === "depense") {
      incomeExpense["isIncome"] = false;
    }

    const sub = this.incomeExpenseSrv
      .createIncomeExpense(incomeExpense)
      .subscribe((response) => {
        if (!response?.ok) {
          this.store.dispatch(onNotificationMessage(response));
        }
        if (response?.errorCode === 0) {
          this.store.dispatch(
            onNotificationMessage({
              msgType: "SUCCESS",
              msg: response?.errorMessage,
            })
          );
        }
        this.operationFormGroup.reset();
      });
    this.subscriptions$.push(sub);
  }

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions$) {
      subscription.unsubscribe();
    }
  }
}
