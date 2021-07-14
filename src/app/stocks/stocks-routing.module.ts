import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { StocksComponent } from "./stocks.component";
import { SupplierComponent } from "./supplier/supplier.component";
import { ConsultationFicheStockComponent } from "./consultation-fiche-stock/consultation-fiche-stock.component";
import { ConsultationGeneraleComponent } from "./consultation-fiche-stock/consultation-generale/consultation-generale.component";
import { NewProductsComponent } from "./consultation-fiche-stock/new-products/new-products.component";
import { ProductsInventoriesComponent } from "./consultation-fiche-stock/products-inventories/products-inventories.component";
import { ProductsExpireComponent } from "./consultation-fiche-stock/products-expire/products-expire.component";
import { AuditGeneralComponent } from "./audit-general/audit-general.component";
import { AuditStockComponent } from "./audit-general/audit-stock/audit-stock.component";
import { AuditPreviousMonthComponent } from "./audit-general/audit-previous-month/audit-previous-month.component";
import { AuditLastDayComponent } from "./audit-general/audit-last-day/audit-last-day.component";

const routes: Routes = [
  {
    path: "",
    component: StocksComponent,
    children: [
      { path: "suppliers", component: SupplierComponent },
      {
        path: "consultation-fichier-stock",
        component: ConsultationFicheStockComponent,
        children: [
          { path: "", redirectTo: "consultation-generale" },
          {
            path: "consultation-generale",
            component: ConsultationGeneraleComponent,
          },
          { path: "new-products", component: NewProductsComponent },
          {
            path: "products-inventories",
            component: ProductsInventoriesComponent,
          },
          {
            path: "products-about-to-expire",
            component: ProductsExpireComponent,
          },
        ],
      },
      {
        path: "audit-general",
        component: AuditGeneralComponent,
        children: [
          { path: "", redirectTo: "audit-stock" },
          { path: "audit-stock", component: AuditStockComponent },
          {
            path: "audit-previous-month",
            component: AuditPreviousMonthComponent,
          },
          { path: "audit-last-day", component: AuditLastDayComponent },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StocksRoutingModule {}
