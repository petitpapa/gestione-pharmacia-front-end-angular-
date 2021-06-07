import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VentesRoutingModule } from './ventes-routing.module';
import { VentesComponent } from './ventes.component';
import { SalesProductsComponent } from './sales-products/sales-products.component';
import { SharedModule } from '../shared/shared.module';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { AddCustomerDialogComponent } from './sales-products/add-customer-dialog/add-customer-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ItemRowComponent } from './shopping-cart/item-row/item-row.component';
import { OrderConfirmationDialogComponent } from './shopping-cart/order-confirmation-dialog/order-confirmation-dialog.component';
import { OldSalesComponent } from './old-sales/old-sales.component';
import { QueryPeriodDialogComponent } from './old-sales/query-period-dialog/query-period-dialog.component';
import { SaleDetailComponent } from './old-sales/sale-detail/sale-detail.component';
import { ProductDetailDialogComponent } from './sales-products/product-detail-dialog/product-detail-dialog.component';


@NgModule({
  declarations: [VentesComponent, SalesProductsComponent, ShoppingCartComponent, AddCustomerDialogComponent, ItemRowComponent, OrderConfirmationDialogComponent, OldSalesComponent, QueryPeriodDialogComponent, SaleDetailComponent, ProductDetailDialogComponent],
  imports: [
    CommonModule,SharedModule, ReactiveFormsModule,
    VentesRoutingModule
  ]
})
export class VentesModule { }
