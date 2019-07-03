import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MonitorComponent } from './monitor/monitor.component';

import { AdminroutingModule } from './admin.routes';
import { UserComponent } from './user/user.component';

@NgModule({
  imports: [
    CommonModule,
    AdminroutingModule
  ],
  declarations: [
    MonitorComponent,
    UserComponent
  ]
})
export class AdminconsoleModule { }
