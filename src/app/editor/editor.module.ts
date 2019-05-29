import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxEditorModule } from 'ngx-editor';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { CourseeditComponent } from './courseedit/courseedit.component';
import { EditcoursesComponent } from './editcourses/editcourses.component';
import { EditmanagerComponent } from './editmanager/editmanager.component';
import { NewblockComponent } from './newblock/newblock.component';
import { NewcourseComponent } from './newcourse/newcourse.component';
import { TesteditComponent } from './testedit/testedit.component';

import { EditorroutingModule} from './editor.routes';
import { CourselessonsComponent } from './courselessons/courselessons.component';

@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    NgxEditorModule,
    EditorroutingModule,
    FormsModule,
    HttpClientModule
  ],
  declarations: [
    CourseeditComponent,
    EditcoursesComponent,
    EditmanagerComponent,
    NewblockComponent,
    NewcourseComponent,
    TesteditComponent,
    CourselessonsComponent
  ]
})
export class EditorModule { }
