import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SearchconsoleComponent } from './searchconsole/searchconsole.component';
//import { SearchstudentComponent } from './searchstudent/searchstudent.component';

const searchroutingModule : Routes =[
  {path:'',component:SearchconsoleComponent},
//  {path:'searchstudent',component:SearchstudentComponent}
]

@NgModule({
  imports:[
    RouterModule.forChild(searchroutingModule)
  ],
  exports:[
    RouterModule
  ]
})

export class SearchroutingModule { }
