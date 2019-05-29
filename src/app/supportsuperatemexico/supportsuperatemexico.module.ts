import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


import { SupportroutingModule} from './supportsuperate.routes';

import { SupportsuperatemexicoService } from './supportsuperatemexico.service';

@NgModule({
  imports: [
    CommonModule,
    SupportroutingModule,
    NgbModule
  ],
  declarations: [
  ],
  providers:[
    SupportsuperatemexicoService
  ]
})
export class SupportsuperatemexicoModule { }
