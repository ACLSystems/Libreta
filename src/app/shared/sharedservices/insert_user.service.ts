import { Injectable } from '@angular/core';
//import { Http, Response, Headers } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';
import { environment } from '../../../environments/environment';
import 'rxjs/add/operator/map' ;

@Injectable()
export class InsertUserService {

  public url:string;

  constructor(private _http:HttpClient) {
    this.url = environment.url;
  }

  //Servicio para registrar al usuario
  registerUser(usertosave){
    const params = JSON.stringify(usertosave);
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this._http.post(this.url+'api/user/register', params, {headers:headers});
  }

  //funcion para obtener los estados de la republica
  getStates(org: string, query: any) {
    const json = JSON.stringify(query);
    return this._http.get(this.url + 'api/orgunit/list?org=' + org + '&query=' + json + '&limit=32');
  }

  //metodo para obtener las areas de educacion
  getAreas(org: string) {
    return this._http.get(this.url+ 'api/career/listareas?org=' + org);
  }

  //metodo para obtener las carreras en base a area de educacion
  getCarreras(org:string, query:any){
    let json = JSON.stringify(query);
    return this._http.get(this.url+'api/career/list?org='+org+"&query="+json+"&limit=50")//.map(res=>res.json());
  }

  //metodo para obtener los tipos de grados de la institucion
  getlistTypes(org:string){
    return this._http.get(this.url+'api/term/listtypes?org='+org)//.map(res=>res.json());
  }

  getTerms(org:string,query:any){
    let json = JSON.stringify(query);
    return this._http.get(this.url+'api/term/list?org='+org+"&query="+json+"&limit=50")//.map(res=>res.json());
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

  parserErrors(error:string):string{
    if(error.match("Not Found")){
      return "Usuario o contraseña invalido, favor de validar que los datos proporcionados sean las correctos";
    }else if(error.match("You have already been registered previously")){
      return "Este usuario ya esta registrado, favor de validar los datos de correo electrónico y usuario ó intenta recuperar tu contraseña desde el botón de Iniciar sesión";
    }
    else{
      return "Error desconocido";
    }

  }
}
