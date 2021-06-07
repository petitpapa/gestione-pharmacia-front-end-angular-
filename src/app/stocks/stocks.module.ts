import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StocksRoutingModule } from './stocks-routing.module';
import { StocksComponent } from './stocks.component';
import { SupplierComponent } from './supplier/supplier.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormesComponent } from '../settings/formes/formes.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [StocksComponent, SupplierComponent],
  imports: [
    CommonModule, ReactiveFormsModule, SharedModule,
    StocksRoutingModule
  ],

})
export class StocksModule { }
