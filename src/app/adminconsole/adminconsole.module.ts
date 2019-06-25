import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MonitorComponent } from './monitor/monitor.component';

import { AdminroutingModule } from './admin.routes';

@NgModule({
  imports: [
    CommonModule,
    AdminroutingModule
  ],
  declarations: [
    MonitorComponent
  ]
})
export class AdminconsoleModule { }
