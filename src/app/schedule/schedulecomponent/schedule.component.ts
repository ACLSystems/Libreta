import * as $ from 'jquery';
import { CalendarComponent } from 'ng-fullcalendar';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CourseService } from './../../shared/sharedservices/course.service';
import { DatePipe } from '@angular/common';
import { EventService } from './../event.service';
import { Options } from 'fullcalendar';
import { UserService } from './../../shared/sharedservices/user.service';



@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  providers: [UserService,CourseService, DatePipe, EventService]
})
export class ScheduleComponent implements OnInit {

  loading: boolean;
  calendarOptions: Options;
  @ViewChild(CalendarComponent) ucCalendar: CalendarComponent;
  data: any[] = [];
  colorevents: any[] = ['#088A4B', '#04B45F', '#04B45F', '#E6E6E6'];

  constructor(private datePipe: DatePipe, private eventService: EventService) {

  }

  ngOnInit() {
    this.loadEvents();
  }

  loadEvents(){
    this.loading = true;
    this.eventService.getEventSchedule().subscribe(res => {
      for (const id of res.message.groups){
        this.data.push({
          title: 'curso: ' + id.name,
          start: this.datePipe.transform(id.beginDate, 'yyyy-MM-dd'),
          end: this.datePipe.transform(id.endDate, 'yyyy-MM-dd'),
          color: this.colorevents[Math.floor(Math.random() * this.colorevents.length)]
        });
      }
      this.calendarOptions = {
        locale: 'es',
        height: 700,
        editable: true,
        eventLimit: false,
        header: {
          left: 'prev,next',
          center: 'title',
          right: ''
        },
        selectable: true,
        events: this.data
      };
      this.loading = false;
    });
  }

}
