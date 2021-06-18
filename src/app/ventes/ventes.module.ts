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
import { DetailsByProductsComponent } from './old-sales/details-by-products/details-by-products.component';
import { SaleByProductsComponent } from './old-sales/sale-by-products/sale-by-products.component';
import { SaleByCategoriesComponent } from './old-sales/sale-by-categories/sale-by-categories.component';
import { SaleByFormsComponent } from './old-sales/sale-by-forms/sale-by-forms.component';


@NgModule({
  declarations: [VentesComponent, SalesProductsComponent, ShoppingCartComponent, AddCustomerDialogComponent, ItemRowComponent, OrderConfirmationDialogComponent, OldSalesComponent, QueryPeriodDialogComponent, SaleDetailComponent, ProductDetailDialogComponent, DetailsByProductsComponent, SaleByProductsComponent, SaleByCategoriesComponent, SaleByFormsComponent],
  imports: [
    CommonModule,SharedModule, ReactiveFormsModule,
    VentesRoutingModule
  ]
})
export class VentesModule { }
