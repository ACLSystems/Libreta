import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminComponent } from './admin/admin.component';

import { AdminroutingModule } from './admin.routes';

@NgModule({
  imports: [
    CommonModule,
    AdminroutingModule
  ],
  declarations: [
    AdminComponent
  ]
})
export class AdminconsoleModule { }
