import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ArchwizardModule } from 'ng2-archwizard';
import { NgxPaginationModule } from 'ngx-pagination';

import { ManageroutingModule} from './manager.routes';
import { GruposComponent } from './grupos/grupos.component';
import { NewgroupComponent } from './newgroup/newgroup.component';
import { ViewrequestComponent } from './viewrequest/viewrequest.component';
import { AddusersComponent } from './addusers/addusers.component';
import { CheckrequestComponent } from './checkrequest/checkrequest.component';
import { CheckfacComponent } from './checkrequest/checkfac/checkfac.component';

@NgModule({
  imports: [
    CommonModule,
    ManageroutingModule,
    NgbModule,
    ArchwizardModule,
    NgxPaginationModule
  ],
  declarations: [GruposComponent, NewgroupComponent, ViewrequestComponent, AddusersComponent, CheckrequestComponent, CheckfacComponent]
})
export class ManagerModule { }
