import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorroutingModule } from './error.routes';

import { NotfoundComponent } from './notfound/notfound.component';
import { SesionexpiredComponent } from './sesionexpired/sesionexpired.component';
import { ErrorComponent } from './error.component';

@NgModule({
  imports: [
    CommonModule,
    ErrorroutingModule
  ],
  declarations: [
    ErrorComponent,
    NotfoundComponent,
    SesionexpiredComponent
  ]
})
export class ErrorModule { }
