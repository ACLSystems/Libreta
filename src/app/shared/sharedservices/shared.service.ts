import { Injectable } from '@angular/core';
//import { Http,Response,Headers } from '@angular/http';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { environment } from './../../../environments/environment';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map' ;


@Injectable()
export class SharedService {

  url:string;

  constructor(private http: HttpClient) {
    this.url = environment.url;
  }

  /*
  funcion para usar el api de recuperacion de contraseña (envio de email al usuario)
  */
  recoverPassword(email: string){
		let params = { mail: email };
		let headers = new HttpHeaders({'Content-Type':'application/json'});
    return this.http.post(this.url + 'api/user/validateemail', params, {headers:headers});
  }
}
