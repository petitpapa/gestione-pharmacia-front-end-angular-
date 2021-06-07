import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { OldSalesComponent } from "./old-sales/old-sales.component";
import { SalesProductsComponent } from "./sales-products/sales-products.component";
import { ShoppingCartComponent } from "./shopping-cart/shopping-cart.component";
import { VentesComponent } from "./ventes.component";

const routes: Routes = [
  {
    path: "",
    component: VentesComponent,
    children: [
      { path: "ventes-produits", component: SalesProductsComponent },
      { path: "panier", component: ShoppingCartComponent },
      {path: "ventes-passées", component:OldSalesComponent}
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VentesRoutingModule {}
