import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormesComponent } from './formes/formes.component';
import { RayonsComponent } from './rayons/rayons.component';
import { CategoriesComponent } from './categories/categories.component';
import { CategoriesConfirmDialogComponent } from './categories/categories-confirm-dialog/categories-confirm-dialog.component';


@NgModule({
  declarations: [SettingsComponent, FormesComponent, RayonsComponent, CategoriesComponent, CategoriesConfirmDialogComponent],
  imports: [
    CommonModule,FormsModule, ReactiveFormsModule, SharedModule,
    SettingsRoutingModule
  ]
})
export class SettingsModule { }
