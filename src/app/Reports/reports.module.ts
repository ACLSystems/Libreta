import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartsModule } from 'ng2-charts';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ChartsComponent } from './charts/charts.component';
import { GradesbygroupComponent } from './gradesbygroup/gradesbygroup.component';

import { ReportsroutingModule } from './reports.router';
import { ConsolereportsComponent } from './consolereports/consolereports.component';

@NgModule({
  imports: [
    CommonModule,
    ChartsModule,
    NgbModule,
    ReportsroutingModule
  ],
  declarations: [
    ChartsComponent,
    GradesbygroupComponent,
    ConsolereportsComponent
  ]
})
export class ReportsModule { }
