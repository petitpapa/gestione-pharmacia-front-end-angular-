import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {StocksComponent} from './stocks.component';
import {SupplierComponent} from './supplier/supplier.component';
import {ConsultationFicheStockComponent} from "./consultation-fiche-stock/consultation-fiche-stock.component";
import {ConsultationGeneraleComponent} from "./consultation-fiche-stock/consultation-generale/consultation-generale.component";
import {NewProductsComponent} from "./consultation-fiche-stock/new-products/new-products.component";


const routes: Routes = [{
  path: '', component: StocksComponent, children: [
    {path: 'suppliers', component: SupplierComponent},
    {
      path: 'consultation-fichier-stock', component: ConsultationFicheStockComponent, children: [
        {path: '', redirectTo: 'consultation-generale'},
        {path: 'consultation-generale', component: ConsultationGeneraleComponent},
        {path: 'new-products', component: NewProductsComponent}
      ]
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StocksRoutingModule {
}
