import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MonitorComponent } from './monitor/monitor.component';
import { UserComponent } from './user/user.component';

const adminroutingModule : Routes =[
  {path:'monitor',component:MonitorComponent},
	{path:'user', component:UserComponent}
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
