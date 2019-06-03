import { AdminconsoleModule } from './adminconsole/adminconsole.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { ChartsModule } from 'ng2-charts';
import { EditorModule } from './editor/editor.module';
import { environment } from '../environments/environment';
import { ErrorModule } from './error/error.module';
import { ErrorService } from './error/error.service';
import { FooterComponent } from './shared/footer/footer.component';
import { FormsModule } from '@angular/forms';
import { HomeModule } from './home/home.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { HttpConfigInterceptor } from './Interceptors/http.interceptor';
import { ManagerModule } from './manager/manager.module';
import { metaReducers, reducers } from './reducers';
import { NabvarComponent } from './shared/nabvar/nabvar.component';
import { NabvarloggedComponent } from './shared/nabvarlogged/nabvarlogged.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { NgxEditorModule } from 'ngx-editor';
import { NgxPaginationModule } from 'ngx-pagination';
import { ReportsModule } from './Reports/reports.module';
import { ScheduleModule } from './schedule/schedule.module';
import { SearchModule } from './searchmanager/search.module';
import { SharedModule } from './shared/shared.module';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreModule } from '@ngrx/store';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { SupportsuperatemexicoModule } from './supportsuperatemexico/supportsuperatemexico.module';
import { TutorModule } from './Tutor/tutor.module';
import { UserModule } from './user/user.module';

@NgModule({
  declarations: [
    AppComponent,
    NabvarComponent,
    NabvarloggedComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HomeModule,
    HttpClientModule,
    UserModule,
    SharedModule,
    SupportsuperatemexicoModule,
    AdminconsoleModule,
    ReportsModule,
    EditorModule,
    ErrorModule,
    TutorModule,
    SearchModule,
    FormsModule,
    ManagerModule,
    NgxEditorModule,
    ScheduleModule,
    NgbModule,
    NgxPaginationModule,
    ChartsModule,
    StoreModule.forRoot(reducers, { metaReducers }),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production }),
    StoreRouterConnectingModule.forRoot({stateKey: 'router'})
  ],
  providers: [
    ErrorService
    //{provide: HTTP_INTERCEPTORS, useClass: HttpConfigInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
