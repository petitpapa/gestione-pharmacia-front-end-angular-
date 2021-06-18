import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { CoreModule } from '../core/core.module';
import { SharedModule } from '../shared/shared.module';
import { MatIconModule } from '@angular/material/icon';
import { MainLayoutComponent } from '../core/main-layout/main-layout.component';
import { RouterModule } from '@angular/router';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { TopTenPieChartComponent } from './top-ten-pie-chart/top-ten-pie-chart.component'
import {BarChartModule, LineChartModule, PieChartModule} from "@swimlane/ngx-charts";
import { TopTenTableComponent } from './top-ten-table/top-ten-table.component';
import { TopHeaderComponent } from './top-header/top-header.component';
import { PeremptionBarComponent } from './peremption-bar/peremption-bar.component';
import { SaleOverviewComponent } from './sale-overview/sale-overview.component';

@NgModule({
  declarations: [DashboardComponent, TopTenPieChartComponent, TopTenTableComponent, TopHeaderComponent, PeremptionBarComponent, SaleOverviewComponent],
  imports: [
    DashboardRoutingModule,
    SharedModule,
    PieChartModule,
    CommonModule,
    LineChartModule,
    BarChartModule,
  ]
})
export class DashboardModule { }
