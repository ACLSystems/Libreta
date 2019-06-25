import { environment } from './../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
 ;

@Injectable()
export class AdminService {

  public url: string;
  public token: any;

  constructor(public http: HttpClient) {
    this.url = environment.url;
  }

  getSessions(): Observable<any> {
    return this.http.get(this.url+'api/v1/admin/sessions');
  }

}
