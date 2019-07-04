import { ArchwizardModule } from 'ng2-archwizard';
import { CommonModule } from '@angular/common';
import { ContrasenaPipe } from './../shared/login/contrasena.pipe';
import { CourseshopComponent } from './courseshop/courseshop.component';
import { CursoComponent } from './curso/curso.component';
import { CursosComponent } from './cursos/cursos.component';
import { FormsModule } from '@angular/forms';
import { GuiasComponent } from './guias/guias.component';
import { HomeComponent } from './home.component';
import { HomeroutingModule } from './home.routes';
import { HomeService } from './homeservices/home.service';
import { LoginComponent } from './../shared/login/login.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { QuotationComponent } from './quotation/quotation.component';
import { RecoverpasswordComponent } from './../shared/recoverpassword/recoverpassword.component';
import { SigninComponent } from './signin/signin.component';
import { ConstanciasComponent } from './constancias/constancias.component';
import { TimeAgoPipe } from 'time-ago-pipe';

@NgModule({
  imports: [
    CommonModule,
    HomeroutingModule,
    NgxPaginationModule,
    NgbModule,
    FormsModule,
    ArchwizardModule
  ],
  declarations: [
    CursosComponent,
    CursoComponent,
    GuiasComponent,
    SigninComponent,
    LoginComponent,
    RecoverpasswordComponent,
    ContrasenaPipe,
    HomeComponent,
    QuotationComponent,
    CourseshopComponent,
    ConstanciasComponent,
		TimeAgoPipe
  ],
  providers: [
    HomeService
  ]
})
export class HomeModule { }
