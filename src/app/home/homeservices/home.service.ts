import { environment } from './../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class HomeService {
  public url: string;
  public identiti: any;
  public token: any;
  public roles: any;

  constructor(private http: HttpClient) {
    this.url = environment.url;
  }

  /*
  metodo para traer los datos del usuario logueado
  */
  getIdentiti() {
    const identiti = JSON.parse(localStorage.getItem('identiti'));
    if (identiti !== 'undefined') {
      this.identiti = identiti;
    } else {
      this.identiti = null;
    }
    return this.identiti;
  }

  /*
  metodo para poner el token del usuario logueado donde el api lo requiera
  */
  getToken() {
    const token = localStorage.getItem('token');
    if (token !== 'undefined') {
      this.token = token;
    } else {
      this.token = null;
    }
    return this.token;
  }

  /*
  metodo para obtener los roles del usuario logueado
  */
  getRolSup() {
    const roles = JSON.parse(localStorage.getItem('roles'));
    if (roles.isSupervisor !== 'undefined') {
      this.roles = roles;
    }
    return this.roles;
  }

  /*
  Metodo para obtener los roles del usuario
  */
  getRoles() {
    const httpaccess = {
      headers : new HttpHeaders({
        'x-access-token': localStorage.getItem('token')
      })
    };
    return this.http.get(this.url + 'api/v1/user/myroles', httpaccess);
  }

  /*
  Funcion para obtener los estados de la republica
  */
  getStates(org: string, query: any): Observable<any> {
    const json = JSON.stringify(query);
    return this.http.get(this.url + 'api/orgunit/list?org=' + org + '&query=' + json + '&limit=100');
  }

  /*
  Metodo para traer los cursos de la organizacion
  */
  getCoursesOrg(): Observable<any> {
    return this.http.get(this.url+'api/course/list?org=conalep', {observe: 'response'});
  }

  /*
  Metodo para mostrar el contenido del temario del curso al usuario final
  */
  showBlocks(id: any): Observable<any> {
    return this.http.get(this.url + 'api/course/getblocklist?id=' + id, {observe: 'response'});
  }
  //metodo para obtener las areas de educacion
  getAreas(org: string): Observable<any> {
    return this.http.get(this.url + 'api/career/listareas?org=' + org, {observe: 'response'});
  }

  //metodo para obtener las carreras en base a area de educacion
  getCarreras(org:string, query:any):Observable<any> {
    let json = JSON.stringify(query);
    return this.http.get(this.url+'api/career/list?org='+org+"&query="+json+"&limit=50",{observe:'response'});
  }

  getTerms(org:string,query:any):Observable<any> {
    let json = JSON.stringify(query);
    return this.http.get(this.url+'api/term/list?org='+org+"&query="+json+"&limit=50",{observe:'response'})//.map(res=>res.json());
  }

	getCertificate(folio:number) {
		return this.http.get(this.url+'api/cert/get?certificate='+folio);
	}


}
