import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './shared/components';

import { HomeRoutingModule } from './home/home-routing.module';
import { DetailRoutingModule } from './detail/detail-routing.module';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },

  {path: 'home', component: HomeComponent},
  { path: 'stockages', loadChildren: () => import('./stocks/stocks.module').then(m => m.StocksModule) },
  { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule) },
  { path: 'parametrages', loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule) },
  { path: 'commandes', loadChildren: () => import('./commandes/commandes.module').then(m => m.CommandeModule) },
  { path: 'ventes', loadChildren: () => import('./ventes/ventes.module').then(m => m.VentesModule) },
  { path: 'caisses-banques', loadChildren: () => import('./checkout-bank/checkout-bank.module').then(m => m.CheckoutBankModule) },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' }),
    HomeRoutingModule,
    DetailRoutingModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
