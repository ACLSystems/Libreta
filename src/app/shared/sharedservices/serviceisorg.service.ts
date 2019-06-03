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
    return this._http.get(this.url + 'api/v1/user/tookcert?groupid=' + groupid, {headers});
  }

  /*
  Metodo para obtener las calificaciones por ou
  */
  getGradesbyou():Observable<any>{
    let headers = new HttpHeaders({
      'x-access-token':this.token
    });
    return this._http.get(this.url + 'api/v1/supervisor/report/rostersummary', {headers});
  }

  /*
  metodo para traer el historial de calificaciones del alumno
  */
  getGradesStudent(groupid, studentid):Observable<any>{
    let headers = new HttpHeaders({
      'x-access-token':this.token
    });
    return this._http.get(this.url+'api/v1/instructor/group/studentgrades?groupid='+groupid+'&studentid='+studentid,{headers});
  }

  /*
  Metodo para obtener la actividad de usuarios por grupo
  */
  getGradesforgroup(idgroup:any):Observable<any>{
    let headers = new HttpHeaders({
      'x-access-token':this.token
    });
    return this._http.get(this.url+'api/v1/supervisor/report/gradesbygroup?groupid='+idgroup,{headers});
  }
  /*
  Metodo para los alumnos inactivos
  */
  getUserInactives():Observable<any>{
    let headers = new HttpHeaders({
      'x-access-token':this.token
    });
    return this._http.get(this.url+'api/v1/supervisor/report/userswoactivity',{headers});
  }
  /*
  Metodo para los reportes estadisticos
  */
  public getCharts(query):Observable<any>{
    let queryJson = JSON.stringify(query);
    let headers = new HttpHeaders({
      'x-access-token':this.token
    });
    return this._http.get(this.url+'api/v1/supervisor/report/percentil?ou='+queryJson,{headers});
  }

  /*
  reseteo de contraseña por usuario isOrg
  */
  public resetpassisorg(emailuser:string):Observable<any>{
    let headers = new HttpHeaders({
      'x-access-token':this.token
    });
    return this._http.get(this.url+'api/v1/orgadm/user/passwordreset?username='+emailuser,{headers});
  }

  /*
  agregar una nueva seccion a un curso
  */
  public setSection(coursecode): Observable<any> {
    const params = JSON.stringify(coursecode);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-access-token': this.token
    });
    return this._http.put(this.url + 'api/v1/author/course/newsection' , params , {headers});
  }

  /*
  Metodo para agregar el bloque a un curso
  */
  public setNewBlock(block): Observable<any> {
    const params = JSON.stringify(block);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-access-token': this.token
    });
    return this._http.post(this.url +'api/v1/author/course/createblock' , params , {headers});

  }
  /*
  Metodo para agregar un nuevo curso
  */
  public setNewCourse(course): Observable<any> {
    const params = JSON.stringify(course);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-access-token': this.token
    });
    return this._http.post(this.url + 'api/v1/author/course/create', params , {headers});
  }

  /*
  Metodo para calificar las tareas desde la vista del tutor
  */
  public setgradeTask(gradetask): Observable<any>{
    const params = JSON.stringify(gradetask);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-access-token': this.token
    });
    return this._http.put(this.url + 'api/v1/instructor/group/gradetask', params, {headers});
  }

  /*
  Metodo para calificar las tareas desde la vista del tutor v1.0.1
  */
  public setgradeTaskconcatMap(task: any[]): Observable<any>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-access-token': this.token
    });
    return from(task).pipe(concatMap(
      idTask => this._http.put(this.url + 'api/v1/instructor/group/gradetask', idTask, {headers}) as Observable<any>));
  }

  /*
  Metodo para modificar el contenido del curso
  */
  public updateContent(block: any): Observable<any> {
    const params = JSON.stringify(block);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-access-token': this.token
    });
    return this._http.put(this.url + 'api/v1/author/course/modifyblock', params , {headers});
  }
  /*
  Metodo para traer el contenido del curso que editara el autor
  */
  public getContent(id):Observable<any>{
    let headers = new HttpHeaders({
      'x-access-token':this.token
    });
    return this._http.get(this.url + 'api/v1/author/course/getblock?id=' + id, {headers});
  }

  /*
  metodo para obtener el temario por cada curso y mostrarlo al autor
  */
  public getlistBlock(courseid):Observable<any>{
    let headers = new HttpHeaders({
      'x-access-token':this.token
    });
    return this._http.get(this.url+'api/v1/author/course/getblocklist?id=' + courseid + '&section1=0&section2=500',{headers});
  }

  /*
  metodo para obtener el listado de cursos y mostrarlos al autor
  */
  public getCoursesAuth():Observable<any>{
    let headers = new HttpHeaders({
      'x-access-token':this.token
    });
    return this._http.get(this.url+'api/v1/course/listcourses',{headers});
  }

  /*
  obtener la tarea por alumno
  */
  public getTask(groupid, studentid, blockid):Observable<any>{
    let headers = new HttpHeaders({
      'x-access-token':this.token
    });
    //api/v1/instructor/group/studenttask?groupid='+groupid+'&studentid='+studentid+'&blockid='+blockid
    return this._http.get(this.url+'api/v1/instructor/group/studenttask?groupid='+groupid+'&studentid='+studentid+'&blockid='+blockid,{headers});
  }
  /*
  Obtener el listado de los alumnos con el detalle de cada uno
  */
  public getlistroster(groupcode):Observable<any>{
    let headers = new HttpHeaders({
      'x-access-token':this.token
    });
    return this._http.get(this.url+'api/v1/instructor/group/listroster?code='+groupcode,{headers});
  }

  /*
  Obtener el listado de los grupos asignados por tutor
  */
  public mylistgroup():Observable<any>{
    let headers = new HttpHeaders({
      'x-access-token':this.token
    });
    return this._http.get(this.url+'api/v1/instructor/group/mylist',{headers});
  }

  /*
  Reportes por campo
  */
  public getReportsOrg():Observable<any>{
    let headers = new HttpHeaders({
      'x-access-token':this.token
    });
    return this._http.get(this.url+'api/v1/supervisor/report/gradesbycampus',{headers});
  }

  /*
  api para la descarga de archivos
  */
  public downloadFile(id:any):Observable<any>{
    let headers = new HttpHeaders({
      'x-access-token':this.token
    });
    return this._http.get(this.url+'api/v1/file/download?fileid='+id+'&link=true',{headers});
  }

  /*
  api para obtener el arbol de organizaciones para los reportes
  */
  public getOrgTree():Observable<any>{
    let headers = new HttpHeaders({
      'x-access-token':this.token
    });
    return this._http.get(this.url+'api/v1/supervisor/report/orgtree',{headers});
  }

  public getUserAccount(username):Observable<any>{
    let headers = new HttpHeaders({
      'x-access-token':this.token
    });
    return this._http.get(this.url+'api/v1/supervisor/user/getgroups?username='+username,{headers});
  }

  public getGroupsManager(ou):Observable<any>{
    let headers = new HttpHeaders({
      'x-access-token':this.token
    });
    return this._http.get(this.url+'api/v1/supervisor/group/list?ou='+ou,{headers});
  }

  public getUserBySupervisor(username): Observable<any> {
    const headers = new HttpHeaders({
      'x-access-token': this.token
    });
    return this._http.get(this.url + 'api/v1/supervisor/user/getdetails?username=' + username, {headers});
  }

  public resetpassBySupervisor(bodypass): Observable<any> {
    const params = JSON.stringify(bodypass);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-access-token': this.token
    });
    return this._http.put(this.url +'api/v1/supervisor/user/passwordreset', params, {headers});
  }

  public updateuserBySupervisor(bodynewuser): Observable<any> {
    let params = JSON.stringify(bodynewuser);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-access-token': this.token
    });
    return this._http.put(this.url + 'api/v1/supervisor/user/changeuser', params, {headers});
  }
}
