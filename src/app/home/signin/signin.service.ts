import { environment } from './../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
//import { Http,Response,Headers } from '@angular/http';
 ;

@Injectable()
export class SigninService{
  url:string;
  constructor(private http:HttpClient){
    this.url = environment.url;
  }

  //metodo para aplicar el login al usuario
  signIn(usertologin):Observable<any>{
    let json = JSON.stringify(usertologin);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post(this.url+'login', json, {headers:headers});
  }

  /*
  metodo para obtener la informacion del usuario
  */
  getUser(username):Observable<any>{

    return this.http.get(this.url+'api/v1/user/getdetails?name='+username)
  }

  //Servicio para registrar al usuario
  registerUser(usertosave){
    let params = JSON.stringify(usertosave);
    let headers = new HttpHeaders({'Content-Type':'application/json'});
    return this.http.post(this.url+'api/user', params, {headers:headers});
  }

  //funcion para obtener los estados de la republica
  getStates(org: string, query: any): Observable<any> {
    let json = JSON.stringify(query);
    return this.http.get(this.url + 'api/orgunit/list?org=' + org + '&query=' + json + '&limit=100');
  }

  //metodo para obtener las areas de educacion
  getAreas(org:string):Observable<any>{
    return this.http.get(this.url+'api/career/listareas?org='+org)//.map(res=>res.json());
  }

  //metodo para obtener las carreras en base a area de educacion
  getCarreras(org:string, query:any):Observable<any>{
    let json = JSON.stringify(query);
    return this.http.get(this.url+'api/career/list?org='+org+"&query="+json+"&limit=50")//.map(res=>res.json());
  }

  //funcion para parsear los textos que vengan con caracteres especiales
  public parserString(text_s:string):string{
    var text_p = text_s.replace(/\s/g,'');
    text_p = text_p.replace('á','a');
    text_p = text_p.replace('é','e');
    text_p = text_p.replace('í','i');
    text_p = text_p.replace('ó','o');
    text_p = text_p.replace('ú','u');
    text_p = text_p.toLowerCase();

    return text_p;
  }
}
