import {Inject, Injectable} from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserService } from './../shared/sharedservices/user.service';
//import { CourseService } from './../shared/sharedservices/course.service';


import { environment } from './../../environments/environment';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

export interface EventSchedule {
  id: number;
  ext_id: number;
  name: string
}

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class EventService {

  datatmp:any[]=[];
  private url = environment.url;
  constructor(private user:UserService, private http: HttpClient){

  }

  getEventSchedule():Observable<any>{
    const urltmp =  `${this.url}api/v1/user/mygroups`
    const httpOptionsToken = {headers: new HttpHeaders({'x-access-token':this.user.getToken()})}
    return this.http.get<any[]>(urltmp, httpOptionsToken).pipe(
      tap(
				// data=>
        // console.log(data)
      )
      ,catchError(this.handleError('getClusters', []))
    );
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  private log(message: string) {

  }

  public getEvents(){
      const dateObj = new Date();
      const yearMonth = dateObj.getUTCFullYear() + '-' + (dateObj.getUTCMonth() + 1);
      let data: any = [{
          title: 'All Day Event',
          start: yearMonth + '-01'
      },
      {
          title: 'Long Event',
          start: yearMonth + '-07',
          end: yearMonth + '-10'
      },
      {
          id: 999,
          title: 'Repeating Event',
          start: yearMonth + '-09T16:00:00'
      },
      {
          id: 999,
          title: 'Repeating Event',
          start: yearMonth + '-16T16:00:00'
      },
      {
          title: 'Conference',
          start: yearMonth + '-11',
          end: yearMonth + '-13'
      },
      {
          title: 'Meeting',
          start: yearMonth + '-12T10:30:00',
          end: yearMonth + '-12T12:30:00'
      },
      {
          title: 'Lunch',
          start: yearMonth + '-12T12:00:00'
      },
      {
          title: 'Meeting',
          start: yearMonth + '-12T14:30:00'
      },
      {
          title: 'Happy Hour',
          start: yearMonth + '-12T17:30:00'
      },
      {
          title: 'Dinner',
          start: yearMonth + '-12T20:00:00'
      },
      {
          title: 'Birthday Party',
          start: yearMonth + '-13T07:00:00'
      },
      {
          title: 'Click for Google',
          url: 'http://google.com/',
          start: yearMonth + '-28'
      }];
      data;
      return data;
  }
}
