import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const sharedroutingModule: Routes = [ ];

@NgModule({
  imports: [RouterModule.forChild(sharedroutingModule)
  ],
  exports: [RouterModule]
})

export class SharedroutingModule {}
