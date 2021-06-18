import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommandListComponent } from './command-list/command-list.component';
import { CommandReceptionComponent } from './command-reception/command-reception.component';
import { CommandesComponent } from './commandes.component';
import { CreateCommandeComponent } from './create-commande/create-commande.component';
import { EmissionAvoirsComponent } from './emission-avoirs/emission-avoirs.component';
import { GestionCommandeComponent } from './gestion-commande/gestion-commande.component';
import { ValidateCommandesComponent } from './validate-commandes/validate-commandes.component';
import {ResponseReturnedProductsComponent} from "./response-returned-products/response-returned-products.component";
import {ConsultationAvoirRecuComponent} from "./consultation-avoir-recu/consultation-avoir-recu.component";
import {ReglementSupplierComponent} from "./reglement-supplier/reglement-supplier.component";
import {FacturationComponent} from "./reglement-supplier/facturation/facturation.component";
import {FactureHistoriqueComponent} from "./reglement-supplier/facture-historique/facture-historique.component";
import {GraphiqueAchatsComponent} from "./graphique-achats/graphique-achats.component";

const routes: Routes = [{
  path: '', component: CommandesComponent,
  children: [
    {path: 'create-commande', component: CreateCommandeComponent},
    { path: 'gestion-commande', component: GestionCommandeComponent },
    { path: 'command-reception', component: CommandReceptionComponent },
    { path: 'pointer-bon-commandes', component: ValidateCommandesComponent },
    { path: 'liste-bons-commande', component: CommandListComponent},
    { path: 'emission-avoirs', component: EmissionAvoirsComponent },
    {path: 'reception-avoirs', component: ResponseReturnedProductsComponent},
    {path: 'product-return-already-processed', component: ConsultationAvoirRecuComponent},
    {path: 'reglement-fournisseur', component: ReglementSupplierComponent},
    {path: 'reglement-fournisseur/facturation', component: FacturationComponent},
    {path: 'reglement-fournisseur/historiques', component: FactureHistoriqueComponent},
    {path: 'graphiques-achats', component: GraphiqueAchatsComponent}
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommandesRoutingModule { }
