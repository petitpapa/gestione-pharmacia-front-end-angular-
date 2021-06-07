import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RayonsComponent } from '../settings/rayons/rayons.component';
import { StocksComponent } from './stocks.component';
import { SupplierComponent } from './supplier/supplier.component';


const routes: Routes = [{
  path: '', component: StocksComponent, children: [
    { path: 'suppliers', component: SupplierComponent }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StocksRoutingModule { }
