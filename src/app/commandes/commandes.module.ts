import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommandesRoutingModule } from './commandes-routing.module';
import { CommandesComponent } from './commandes.component';
import { CreateCommandeComponent } from './create-commande/create-commande.component';
import { CreateCommandDialogContainerComponent } from './dialog/create-command-dialog-container/create-command-dialog-container.component';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { GestionCommandeComponent } from './gestion-commande/gestion-commande.component';
import { DetailComponent } from './gestion-commande/detail/detail.component';
import { ValidateCommandesComponent } from './validate-commandes/validate-commandes.component';
import { CommandReceptionComponent } from './command-reception/command-reception.component';
import { DetailDialogComponent } from './validate-commandes/detail-dialog/detail-dialog.component';
import { CommandListComponent } from './command-list/command-list.component';
import { EmissionAvoirsComponent } from './emission-avoirs/emission-avoirs.component';
import { ResponseReturnedProductsComponent } from './response-returned-products/response-returned-products.component';
import { SuppliersListComponent } from './response-returned-products/suppliers-list/suppliers-list.component';
import { DetailsOfSupplierReturnedProductDialogComponent } from './response-returned-products/details-of-supplier-returned-product-dialog/details-of-supplier-returned-product-dialog.component';
import { ConsultationAvoirRecuComponent } from './consultation-avoir-recu/consultation-avoir-recu.component';
import { ReglementSupplierComponent } from './reglement-supplier/reglement-supplier.component';
import { CommandsAvoirsComponent } from './reglement-supplier/commands-avoirs/commands-avoirs.component';
import { FacturationComponent } from './reglement-supplier/facturation/facturation.component';


@NgModule({
  declarations: [CommandesComponent, CreateCommandeComponent, CreateCommandDialogContainerComponent, CommandReceptionComponent,
 GestionCommandeComponent, DetailComponent, ValidateCommandesComponent, DetailDialogComponent, CommandListComponent, EmissionAvoirsComponent, ResponseReturnedProductsComponent, SuppliersListComponent, DetailsOfSupplierReturnedProductDialogComponent, ConsultationAvoirRecuComponent, ReglementSupplierComponent, CommandsAvoirsComponent, FacturationComponent],
  imports: [
    CommonModule,SharedModule, ReactiveFormsModule,
    CommandesRoutingModule
  ]
})
export class CommandeModule {}
