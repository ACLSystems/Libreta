import { concatMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { from } from 'rxjs';
import { GLOBAL } from './global';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { UserService } from './user.service';
 ;

@Injectable()
export class ServiceisorgService {

  public url:string;
  public identiti;
  public token;

  /*
  constructor de la clase
  */
  constructor(public _http:HttpClient, public _user:UserService) {
    this.url = environment.url;
    this.token = this._user.getToken();
  }

  /*
  Metodo para obtener los datos de los usuario que obtuvieron su constancia
  */
  public getUserConst(groupid):Observable<any>{
    let headers = new HttpHeaders({
      'x-access-token':this.token
    });
    return this._http.get(this.url+'api/v1/user/tookcert?groupid='+groupid, {headers:headers})//.map(res=>res.json());
  }

  /*
  Metodo para obtener las calificaciones por ou
  */
  getGradesbyou():Observable<any>{
    let headers = new HttpHeaders({
      'x-access-token':this.token
    });
    return this._http.get(this.url+'api/v1/supervisor/report/rostersummary',{headers:headers})//.map(res=>res.json());
  }

  /*
  metodo para traer el historial de calificaciones del alumno
  */
  getGradesStudent(groupid, studentid):Observable<any>{
    let headers = new HttpHeaders({
      'x-access-token':this.token
    });
    return this._http.get(this.url+'api/v1/instructor/group/studentgrades?groupid='+groupid+'&studentid='+studentid,{headers:headers})//.map(res=>res.json());
  }

  /*
  Metodo para obtener la actividad de usuarios por grupo
  */
  getGradesforgroup(idgroup:any):Observable<any>{
    let headers = new HttpHeaders({
      'x-access-token':this.token
    });
    return this._http.get(this.url+'api/v1/supervisor/report/gradesbygroup?groupid='+idgroup,{headers:headers})//.map(res=>res.json());
  }
  /*
  Metodo para los alumnos inactivos
  */
  getUserInactives():Observable<any>{
    let header = new HttpHeaders({
      'x-access-token':this.token
    });
    return this._http.get(this.url+'api/v1/supervisor/report/userswoactivity',{headers:header})//.map(res=>res.json());
  }
  /*
  Metodo para los reportes estadisticos
  */
  public getCharts(query):Observable<any>{
    let queryJson = JSON.stringify(query);
    let headers = new HttpHeaders({
      'x-access-token':this.token
    });
    return this._http.get(this.url+'api/v1/supervisor/report/percentil?ou='+queryJson,{headers:headers})//.map(res=>res.json());
  }

  /*
  reseteo de contraseña por usuario isOrg
  */
  public resetpassisorg(emailuser:string):Observable<any>{
    let headers = new HttpHeaders({
      'x-access-token':this.token
    });
    return this._http.get(this.url+'api/v1/orgadm/user/passwordreset?username='+emailuser,{headers:headers})//.map(res=>res.json());
  }

  /*
  agregar una nueva seccion a un curso
  */
  public setSection(coursecode):Observable<any>{
    let params = JSON.stringify(coursecode);
    let headers = new HttpHeaders({
      'Content-Type':'application/json',
      'x-access-token':this.token
    });
    return this._http.put(this.url +'api/v1/author/course/newsection' ,params ,{headers:headers})//.map(res=>res.json());
  }

  /*
  Metodo para agregar el bloque a un curso
  */
  public setNewBlock(block):Observable<any>{
    let params = JSON.stringify(block);
    let headers = new HttpHeaders({
      'Content-Type':'application/json',
      'x-access-token':this.token
    });
    return this._http.post(this.url +'api/v1/author/course/createblock' ,params ,{headers:headers})//.map(res=>res.json());

  }
  /*
  Metodo para agregar un nuevo curso
  */
  public setNewCourse(course):Observable<any>{
    let params = JSON.stringify(course);
    let headers = new HttpHeaders({
      'Content-Type':'application/json',
      'x-access-token':this.token
    });
    return this._http.post(this.url +'api/v1/author/course/create' ,params ,{headers:headers})//.map(res=>res.json());
  }

  /*
  Metodo para calificar las tareas desde la vista del tutor
  */
  public setgradeTask(gradetask):Observable<any>{
    let params = JSON.stringify(gradetask);
    let headers = new HttpHeaders({
      'Content-Type':'application/json',
      'x-access-token':this.token
    });
    return this._http.put(this.url +'api/v1/instructor/group/gradetask' ,params)//.map(res=>res.json());
  }

  /*
  Metodo para calificar las tareas desde la vista del tutor v1.0.1
  */
  public setgradeTaskconcatMap(task:any[]):Observable<any>{
    return from(task).pipe(concatMap(idTask => <Observable<any>> this._http.put(this.url +'api/v1/instructor/group/gradetask' ,idTask)));
    //return this._http.put(this.url +'api/v1/instructor/group/gradetask' ,params)//.map(res=>res.json());
  }

  /*
  Metodo para modificar el contenido del curso
  */
  public updateContent(block:any):Observable<any>{
    let params = JSON.stringify(block);
    let headers = new HttpHeaders({
      'Content-Type':'application/json',
      'x-access-token':this.token
    });
    return this._http.put(this.url +'api/v1/author/course/modifyblock' ,params ,{headers:headers})//.map(res=>res.json());
  }
  /*
  Metodo para traer el contenido del curso que editara el autor
  */
  public getContent(id):Observable<any>{
    let headers = new HttpHeaders({
      'x-access-token':this.token
    });
    return this._http.get(this.url+'api/v1/author/course/getblock?id='+id,{headers:headers})//.map(res=>res.json());
  }

  /*
  metodo para obtener el temario por cada curso y mostrarlo al autor
  */
  public getlistBlock(courseid):Observable<any>{
    let headers = new HttpHeaders({
      'x-access-token':this.token
    });
    return this._http.get(this.url+'api/v1/author/course/getblocklist?id='+courseid+'&section1=0&section2=500',{headers:headers})//.map(res=>res.json());
  }

  /*
  metodo para obtener el listado de cursos y mostrarlos al autor
  */
  public getCoursesAuth():Observable<any>{
    let headers = new HttpHeaders({
      'x-access-token':this.token
    });
    return this._http.get(this.url+'api/v1/course/listcourses',{headers:headers})//.map(res=>res.json());
  }

  /*
  obtener la tarea por alumno
  */
  public getTask(groupid, studentid, blockid):Observable<any>{
    let headers = new HttpHeaders({
      'x-access-token':this.token
    });
    //api/v1/instructor/group/studenttask?groupid='+groupid+'&studentid='+studentid+'&blockid='+blockid
    return this._http.get(this.url+'api/v1/instructor/group/studenttask?groupid='+groupid+'&studentid='+studentid+'&blockid='+blockid,{headers:headers})//.map(res=>res.json());
  }
  /*
  Obtener el listado de los alumnos con el detalle de cada uno
  */
  public getlistroster(groupcode):Observable<any>{
    let headers = new HttpHeaders({
      'x-access-token':this.token
    });
    return this._http.get(this.url+'api/v1/instructor/group/listroster?code='+groupcode,{headers:headers})//.map(res=>res.json());
  }

  /*
  Obtener el listado de los grupos asignados por tutor
  */
  public mylistgroup():Observable<any>{
    let headers = new HttpHeaders({
      'x-access-token':this.token
    });
    return this._http.get(this.url+'api/v1/instructor/group/mylist',{headers:headers})//.map(res=>res.json());
  }

  /*
  Reportes por campo
  */
  public getReportsOrg():Observable<any>{
    let headers = new HttpHeaders({
      'x-access-token':this.token
    });
    return this._http.get(this.url+'api/v1/supervisor/report/gradesbycampus',{headers:headers})//.map(res=>res.json());
  }

  /*
  api para la descarga de archivos
  */
  public downloadFile(id:any):Observable<any>{
    let headers = new HttpHeaders({
      'x-access-token':this.token
    });
    return this._http.get(this.url+'api/v1/file/download?fileid='+id+'&link=true',{headers:headers})//.map(res=>res.json());
  }

  /*
  api para obtener el arbol de organizaciones para los reportes
  */
  public getOrgTree():Observable<any>{
    let headers = new HttpHeaders({
      'x-access-token':this.token
    });
    return this._http.get(this.url+'api/v1/supervisor/report/orgtree',{headers:headers})//.map(res=>res.json());
  }

  public getUserAccount(username):Observable<any>{
    let headers = new HttpHeaders({
      'x-access-token':this.token
    });
    //return this._http.get(this.url+'api/v1/supervisor/user/getdetails?username='+username,headers).map(res=>res.json());
    return this._http.get(this.url+'api/v1/supervisor/user/getgroups?username='+username,{headers:headers})//.map(res=>res.json());
  }

  public getGroupsManager(ou):Observable<any>{
    let headers = new HttpHeaders({
      'x-access-token':this.token
    });
    return this._http.get(this.url+'api/v1/supervisor/group/list?ou='+ou,{headers:headers})//.map(res=>res.json());
  }

  public getUserBySupervisor(username):Observable<any>{
    let headers = new HttpHeaders({
      'x-access-token':this.token
    });
    return this._http.get(this.url+'api/v1/supervisor/user/getdetails?username='+username,{headers:headers})//.map(res=>res.json());
  }

  public resetpassBySupervisor(bodypass):Observable<any>{
    let params = JSON.stringify(bodypass);
    let headers = new HttpHeaders({
      'Content-Type':'application/json',
      'x-access-token':this.token
    });
    return this._http.put(this.url +'api/v1/supervisor/user/passwordreset',params ,{headers:headers})//.map(res=>res.json());
  }

  public updateuserBySupervisor(bodynewuser):Observable<any>{
    let params = JSON.stringify(bodynewuser);
    let headers = new HttpHeaders({
      'Content-Type':'application/json',
      'x-access-token':this.token
    });
    return this._http.put(this.url +"api/v1/supervisor/user/changeuser",params ,{headers:headers})//.map(res=>res.json());
  }
}
