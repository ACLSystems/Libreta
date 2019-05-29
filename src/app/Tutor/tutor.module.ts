import { ArchwizardModule } from 'ng2-archwizard';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from 'ng-fullcalendar';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { TaskreviewComponent } from './taskreview/taskreview.component';
import { TasksviewComponent } from './tasksview/tasksview.component';
import { TutorialComponent } from './tutorial/tutorial.component';
import { TutorroutingModule } from './tutor.routes';
import { TutorService } from './tutorservice';


@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    TutorroutingModule,
    ArchwizardModule,
    NgxPaginationModule,
    FullCalendarModule
  ],
  declarations: [
    TasksviewComponent,
    TaskreviewComponent,
    TutorialComponent
  ],
  providers: [
    TutorService
  ]
})
export class TutorModule { }
