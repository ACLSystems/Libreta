import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from 'ng-fullcalendar';

import { ScheduleComponent } from './schedulecomponent/schedule.component';
import { ScheduleroutingModule } from './schedule.routes';

@NgModule({
  imports: [
    CommonModule,
    ScheduleroutingModule,
    FullCalendarModule
  ],
  declarations: [
    ScheduleComponent
  ],
  providers:[]
})
export class ScheduleModule { }
