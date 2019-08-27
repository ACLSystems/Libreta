import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map' ;

@Injectable()
export class SupportsuperatemexicoService {

  public url:string;
  public identity;
  public token;
  public roles;

  constructor(private http:HttpClient) {
    this.url = environment.url;
  }


}
