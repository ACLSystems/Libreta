import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';

import { ConsoleuserComponent } from './consoleuser/consoleuser.component';
import { LoadingComponent } from './loading/loading.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { RecoverComponent } from './../recover/recover.component'
import { ConfirmComponent } from './../confirm/confirm.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import { UserconfirmComponent } from './../userconfirm/userconfirm.component';

import { SharedroutingModule } from './shared.routes';

@NgModule({
  imports: [
    CommonModule,
    SharedroutingModule,
    NgbModule,
    NgxPaginationModule
  ],
  declarations: [
    ConsoleuserComponent,
    PrivacyComponent,
    RecoverComponent,
    ConfirmComponent,
    ResetpasswordComponent,
    LoadingComponent,
    UserconfirmComponent,
  ]
})
export class SharedModule { }
