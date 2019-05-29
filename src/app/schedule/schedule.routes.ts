import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ScheduleComponent } from './schedulecomponent/schedule.component';

const scheduleroutingModule : Routes=[
  {path: 'schedule', component:ScheduleComponent}
]

@NgModule({
  imports:[
    RouterModule.forChild(scheduleroutingModule)
  ],
  exports:[
    RouterModule
  ]
})
export class ScheduleroutingModule{}
