import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {OldSalesComponent} from "./old-sales/old-sales.component";
import {SalesProductsComponent} from "./sales-products/sales-products.component";
import {ShoppingCartComponent} from "./shopping-cart/shopping-cart.component";
import {VentesComponent} from "./ventes.component";
import {DetailsByProductsComponent} from "./old-sales/details-by-products/details-by-products.component";
import {SaleByProductsComponent} from "./old-sales/sale-by-products/sale-by-products.component";
import {SaleByCategoriesComponent} from "./old-sales/sale-by-categories/sale-by-categories.component";
import {SaleByFormsComponent} from "./old-sales/sale-by-forms/sale-by-forms.component";

const routes: Routes = [
  {
    path: "",
    component: VentesComponent,
    children: [
      {path: "ventes-produits", component: SalesProductsComponent},
      {path: "panier", component: ShoppingCartComponent},
      {
        path: "ventes-passées", component: OldSalesComponent, children: [
          {path: '', redirectTo: 'details-by-product'},
          {path: 'details-by-product', component: DetailsByProductsComponent},
          {path:'sale-by-product', component: SaleByProductsComponent},
          {path: 'sale-by-category', component: SaleByCategoriesComponent},
          {path: 'sale-by-form', component: SaleByFormsComponent}
        ]
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VentesRoutingModule {
}
