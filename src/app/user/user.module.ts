import { ArchwizardModule } from 'ng2-archwizard';
import { BlockLessonComponent } from './block-lesson/block-lesson.component';
import { BlockQuestionnarieComponent } from './block-questionnarie/block-questionnarie.component';
import { BlocksComponent } from './blocks/blocks.component';
import { BlockSectionComponent } from './block-section/block-section.component';
import { BlockTasksComponent } from './block-tasks/block-tasks.component';
import { CommonModule } from '@angular/common';
import { EmbedVideo } from 'ngx-embed-video';
import { FullCalendarModule } from 'ng-fullcalendar';
import { ListcoursesComponent } from './listcourses/listcourses.component';
import { MycoursesComponent } from './mycourses/mycourses.component';
import { MygroupsComponent } from './mygroups/mygroups.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { UserprofileComponent } from './userprofile/userprofile.component';
import { UserroutingModule } from './user.routes';
import { VideosPipe } from './userservices/videos.pipe';
import { ViewNotificationsBlocksComponent } from './view-notifications-blocks/view-notifications-blocks.component';
import { ViewNotificationsComponent } from './view-notifications/view-notifications.component';


@NgModule({
  imports: [
    CommonModule,
    UserroutingModule,
    EmbedVideo,
    NgbModule,
    NgxPaginationModule,
    FullCalendarModule,
    ArchwizardModule
  ],
  declarations: [
    BlocksComponent,
    ListcoursesComponent,
    MycoursesComponent,
    MygroupsComponent,
    VideosPipe,
    BlockSectionComponent,
    BlockLessonComponent,
    UserprofileComponent,
    ViewNotificationsComponent,
    ViewNotificationsBlocksComponent,
    BlockQuestionnarieComponent,
    BlockTasksComponent
  ]
})
export class UserModule { }
