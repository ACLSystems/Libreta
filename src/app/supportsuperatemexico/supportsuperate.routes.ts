import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';




const supportroutingModule:Routes=[
  //{path:'avisoprivacidad',component:PrivacyComponent}
]
@NgModule({
  imports:[
    RouterModule.forChild(supportroutingModule)
  ],
  exports:[
    RouterModule
  ]
})

export class SupportroutingModule { }
