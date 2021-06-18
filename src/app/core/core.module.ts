import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MainContentComponent } from "./main-content/main-content.component";
import { HeaderComponent } from "./header/header.component";
import { SidebarComponent } from "./sidebar/sidebar.component";
import { MainLayoutComponent } from "./main-layout/main-layout.component";
import { RouterModule } from "@angular/router";
import { SharedModule } from "../shared/shared.module";
import { StoreModule } from "@ngrx/store";
import { EffectsModule } from "@ngrx/effects";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import { AppConfig } from "../../environments/environment";
import { Corereducers } from "./core.reducer";
import { SidebarEffects } from "./sidebar/store/sidebar.effects";
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from "@angular/material/core";
import { MATERIAL_DATE_FORMATS } from "./utils";
import {NgxChartsModule} from "@swimlane/ngx-charts";
@NgModule({
  declarations: [
    MainContentComponent,
    HeaderComponent,
    MainLayoutComponent,
    SidebarComponent,
    HeaderComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    NgxChartsModule,
    StoreModule.forRoot(Corereducers),
    EffectsModule.forFeature([SidebarEffects]),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: AppConfig.production,
    }),
  ],
  exports: [MainLayoutComponent, HeaderComponent],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },

    { provide: MAT_DATE_FORMATS, useValue: MATERIAL_DATE_FORMATS },
  ],
})
export class CoreModule {}
