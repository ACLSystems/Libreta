import { CursoComponent } from './curso/curso.component';
import { CursosComponent } from './cursos/cursos.component';
import { LoginComponent } from './../shared/login/login.component';
import { NgModule } from '@angular/core';
import { QuotationComponent } from './quotation/quotation.component';
import { RecoverpasswordComponent } from './../shared/recoverpassword/recoverpassword.component';
import { RouterModule, Routes } from '@angular/router';
import { SigninComponent } from './signin/signin.component';
import { ConstanciasComponent } from './constancias/constancias.component';
import { OfflineComponent } from './offline/offline.component';

const homeroutingModule: Routes = [
  {path: 'cursos', component: CursosComponent},
  {path: 'quotation', component: QuotationComponent},
  {path: 'curso/:id', component: CursoComponent},
  {path: 'signin', component: SigninComponent},
  {path: 'login', component: LoginComponent},
  {path: 'recoverpassword', component: RecoverpasswordComponent},
	{path: 'constancias', component: ConstanciasComponent},
	{path: 'offline', component: OfflineComponent}
]

@NgModule({
  imports: [
    RouterModule.forChild(homeroutingModule)
  ],
  exports: [
    RouterModule
  ]
})

export class HomeroutingModule { }
