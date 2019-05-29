import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TaskreviewComponent } from './taskreview/taskreview.component';
import { TasksviewComponent } from './tasksview/tasksview.component';
import { TutorialComponent } from './tutorial/tutorial.component';

const tutorroutingModule : Routes =[
  {path: 'taskreview/:groupCode',component:TaskreviewComponent},
  {path: 'tasksview/:groupCode/:courseid/:groupid/:studentid/:blockid',component:TasksviewComponent},
  {path: 'tutorial', component:TutorialComponent}
]

@NgModule({
  imports:[
    RouterModule.forChild(tutorroutingModule)
  ],
  exports:[
    RouterModule
  ]
})

export class TutorroutingModule{}
