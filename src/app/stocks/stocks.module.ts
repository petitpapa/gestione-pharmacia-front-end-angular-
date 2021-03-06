import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StocksRoutingModule } from './stocks-routing.module';
import { StocksComponent } from './stocks.component';
import { SupplierComponent } from './supplier/supplier.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { ConsultationFicheStockComponent } from './consultation-fiche-stock/consultation-fiche-stock.component';
import { ConsultationGeneraleComponent } from './consultation-fiche-stock/consultation-generale/consultation-generale.component';
import { NewProductsComponent } from './consultation-fiche-stock/new-products/new-products.component';
import { ProductsInventoriesComponent } from './consultation-fiche-stock/products-inventories/products-inventories.component';
import { ProductsExpireComponent } from './consultation-fiche-stock/products-expire/products-expire.component';
import { AuditGeneralComponent } from './audit-general/audit-general.component';
import { AuditStockComponent } from './audit-general/audit-stock/audit-stock.component';
import { AuditPreviousMonthComponent } from './audit-general/audit-previous-month/audit-previous-month.component';
import { AuditLastDayComponent } from './audit-general/audit-last-day/audit-last-day.component';


@NgModule({
  declarations: [StocksComponent, SupplierComponent, ConsultationFicheStockComponent, ConsultationGeneraleComponent, NewProductsComponent, ProductsInventoriesComponent, ProductsExpireComponent, AuditGeneralComponent, AuditStockComponent, AuditPreviousMonthComponent, AuditLastDayComponent],
  imports: [
    CommonModule, ReactiveFormsModule, SharedModule,
    StocksRoutingModule
  ],

})
export class StocksModule { }
