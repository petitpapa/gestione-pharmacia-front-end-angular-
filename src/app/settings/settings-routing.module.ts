import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettingsComponent } from './settings.component';
import { FormesComponent } from './formes/formes.component';
import { RayonsComponent } from './rayons/rayons.component';
import { CategoriesComponent } from './categories/categories.component';


const routes: Routes = [{
  path: '', component: SettingsComponent, children: [
    {
      path: 'all-formes', component: FormesComponent
    },
    { path: 'rayons', component: RayonsComponent },
    {path: 'categories', component: CategoriesComponent}

  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
