import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CheckoutBankComponent } from "./checkout-bank/checkout-bank.component";
import { ComptesComponent } from "./comptes/comptes.component";
import { DailyIncomeExpenseComponent } from "./daily-income-expense/daily-income-expense.component";
import { OperationComponent } from "./operation/operation.component";
const routes: Routes = [
  {
    path: "",
    component: CheckoutBankComponent,
    children: [
      { path: "comptes", component: ComptesComponent },
      { path: "encaissement-decaissement", component: OperationComponent },
      { path: "daily-income-expense", component: DailyIncomeExpenseComponent },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CheckoutBankRouting {}
