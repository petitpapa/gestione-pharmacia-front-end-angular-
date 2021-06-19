import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StocksRoutingModule } from './stocks-routing.module';
import { StocksComponent } from './stocks.component';
import { SupplierComponent } from './supplier/supplier.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormesComponent } from '../settings/formes/formes.component';
import { SharedModule } from '../shared/shared.module';
import { ConsultationFicheStockComponent } from './consultation-fiche-stock/consultation-fiche-stock.component';
import { ConsultationGeneraleComponent } from './consultation-fiche-stock/consultation-generale/consultation-generale.component';
import { NewProductsComponent } from './consultation-fiche-stock/new-products/new-products.component';


@NgModule({
  declarations: [StocksComponent, SupplierComponent, ConsultationFicheStockComponent, ConsultationGeneraleComponent, NewProductsComponent],
  imports: [
    CommonModule, ReactiveFormsModule, SharedModule,
    StocksRoutingModule
  ],

})
export class StocksModule { }
