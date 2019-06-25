import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MonitorComponent } from './monitor/monitor.component';

const adminroutingModule : Routes =[
  {path:'monitor',component:MonitorComponent}
]

@NgModule({
  imports:[
    RouterModule.forChild(adminroutingModule)
  ],
  exports:[
    RouterModule
  ]
})

export class AdminroutingModule { }
