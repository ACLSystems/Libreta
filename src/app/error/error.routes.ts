import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotfoundComponent } from './notfound/notfound.component';
import { SesionexpiredComponent } from './sesionexpired/sesionexpired.component';

const errorroutingModule: Routes = [
  { path: 'notfound', component: NotfoundComponent },
  { path: 'sesionexpired', component: SesionexpiredComponent }
]

@NgModule({
  imports:[
    RouterModule.forChild(errorroutingModule)
  ],
  exports:[
    RouterModule
  ]
})

export class ErrorroutingModule { }
