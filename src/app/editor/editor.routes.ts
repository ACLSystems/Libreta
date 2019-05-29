import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CourseeditComponent } from './courseedit/courseedit.component';
import { CourselessonsComponent } from './courselessons/courselessons.component';
import { EditcoursesComponent } from './editcourses/editcourses.component';
import { EditmanagerComponent } from './editmanager/editmanager.component';
import { NewblockComponent } from './newblock/newblock.component';
import { NewcourseComponent } from './newcourse/newcourse.component';
import { TesteditComponent } from './testedit/testedit.component';


const editorroutingModule : Routes = [
  {path:'courseedit/:courseid/:blockid', component:CourseeditComponent},
  {path: 'courselessons/:id', component:CourselessonsComponent},
  {path: 'editmanager', component:EditmanagerComponent},
  {path: 'editcourses', component:EditcoursesComponent},
  {path: 'newcourse', component:NewcourseComponent},
  {path: 'newblock', component:NewblockComponent},
  {path: 'testedit', component:TesteditComponent}
]

@NgModule({
  imports:[
    RouterModule.forChild(editorroutingModule)
  ],
  exports:[
    RouterModule
  ]
})

export class EditorroutingModule { }
