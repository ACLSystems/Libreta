import { ConfirmComponent } from './confirm/confirm.component';
import { ConsoleuserComponent } from './shared/consoleuser/consoleuser.component';
import { ErrorComponent } from './error/error.component';
import { HomeComponent } from './home/home.component';
import { ListcoursesComponent } from './user/listcourses/listcourses.component';
import { NgModule } from '@angular/core';
import { PrivacyComponent } from './shared/privacy/privacy.component';
import { RecoverComponent } from './recover/recover.component';
import { ResetpasswordComponent } from './shared/resetpassword/resetpassword.component';
import { RouterModule, Routes } from '@angular/router';
import { UserconfirmComponent } from './userconfirm/userconfirm.component';


const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
	{path: 'user', loadChildren: './user/user.module#UserModule'},
	{path: 'schedule', loadChildren: './schedule/schedule.module#ScheduleModule'},
	{path: 'searchconsole', loadChildren: './searchmanager/search.module#SearchModule'},
	{path: 'reports', loadChildren: './Reports/reports.module#ReportsModule'},
	{path: 'requests', loadChildren: './manager/manager.module#ManagerModule'},
	{path: 'editor', loadChildren: './editor/editor.module#EditorModule'},
	{path: 'tutor', loadChildren: './Tutor/tutor.module#TutorModule'},
	{path: 'admin', loadChildren: './adminconsole/adminconsole.module#AdminconsoleModule'},
  {path: 'consoleuser', component: ConsoleuserComponent},
  {path: 'avisoprivacidad', component: PrivacyComponent},
  {path: 'resetpass', component: ResetpasswordComponent},
  {path: 'recover/:tokentemp/:username', component: RecoverComponent},
  {path: 'userconfirm/:tokentemp/:username', component: UserconfirmComponent},
  {path: 'confirm/:tokentemp/:username/:name/:fathername/:mothername', component: ConfirmComponent},
  {path: 'error/:typeError', component: ErrorComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash:true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
