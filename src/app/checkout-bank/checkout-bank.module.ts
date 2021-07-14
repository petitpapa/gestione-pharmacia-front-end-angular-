import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckoutBankComponent } from './checkout-bank/checkout-bank.component';
import { ComptesComponent } from './comptes/comptes.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import {CheckoutBankRouting} from './checkout-bank.routing.module';
import { CustomerOrderDetailsComponent } from './comptes/customer-order-details/customer-order-details.component';
import { OperationComponent } from './operation/operation.component';
import { DailyIncomeExpenseComponent } from './daily-income-expense/daily-income-expense.component';
import { DailyCalendarDialogComponent } from './daily-income-expense/daily-calendar-dialog/daily-calendar-dialog.component';


@NgModule({
  declarations: [CheckoutBankComponent, ComptesComponent, CustomerOrderDetailsComponent, OperationComponent, DailyIncomeExpenseComponent, DailyCalendarDialogComponent],
  imports: [
    CommonModule, ReactiveFormsModule, SharedModule,
    CheckoutBankRouting
  ],
})
export class CheckoutBankModule { }
