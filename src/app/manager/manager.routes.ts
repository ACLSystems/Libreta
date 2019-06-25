import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GruposComponent } from './grupos/grupos.component';
import { NewgroupComponent } from './newgroup/newgroup.component';
import { ViewrequestComponent } from './viewrequest/viewrequest.component';
import { AddusersComponent } from './addusers/addusers.component';
import { CheckrequestComponent } from './checkrequest/checkrequest.component';


const manageroutingModule : Routes = [
  {path:'',component:GruposComponent},
  {path:'newrequest/:id/:numberrequest/:labelrequest',component:NewgroupComponent},
  {path:'viewrequest/:numberrequest',component:ViewrequestComponent},
  {path:'addusers/:idrequest/:numberrequest/:labelrequest/:idgroup/:codegroup/:orgUnit',component:AddusersComponent},
  {path:'checkrequest/:numberrequest',component:CheckrequestComponent}
]

@NgModule({
  imports:[
    RouterModule.forChild(manageroutingModule)
  ],
  exports:[
    RouterModule
  ]
})

export class ManageroutingModule { }
