import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChartsComponent } from './charts/charts.component';
import { GradesbygroupComponent } from './gradesbygroup/gradesbygroup.component';
import { ConsolereportsComponent } from './consolereports/consolereports.component';

const reportsroutingModule : Routes =[
  {path:'consolereports',component:ConsolereportsComponent},
  {path:'charts/:query/:ouType',component:ChartsComponent},
  //{path:'gradesbygroup/:idgroup/:query/:ouType',component:GradesbygroupComponent}
	{path:'gradesbygroup/:idgroup',component:GradesbygroupComponent}
]

@NgModule({
  imports:[
    RouterModule.forChild(reportsroutingModule)
  ],
  exports:[
    RouterModule
  ]
})

export class ReportsroutingModule { }
