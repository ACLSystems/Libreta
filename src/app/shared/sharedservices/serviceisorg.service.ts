import { concatMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { from } from 'rxjs';
import { GLOBAL } from './global';
import { HttpClient, HttpRequest, HttpHeaders } from '@angular/common/http';
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
  constructor(public http:HttpClient, public _user:UserService) {
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
    return this.http.get(this.url + 'api/v1/user/tookcert?groupid=' + groupid, {headers:headers});
  }

  /*
  Metodo para obtener las calificaciones por ou
  */
  getGradesbyou():Observable<any>{
    let headers = new HttpHeaders({
      'x-access-token':this.token
    });
    return this.http.get(this.url + 'api/v1/supervisor/report/rostersummary', {headers:headers});
  }

  /*
  metodo para traer el historial de calificaciones del alumno
  */
  getGradesStudent(groupid, studentid):Observable<any>{
    let headers = new HttpHeaders({
      'x-access-token':this.token
    });
    return this.http.get(this.url+'api/v1/instructor/group/studentgrades?groupid='+groupid+'&studentid='+studentid,{headers:headers});
  }

  /*
  Metodo para obtener la actividad de usuarios por grupo
  */
  getGradesforgroup(idgroup:any):Observable<any>{
    let headers = new HttpHeaders({
      'x-access-token':this.token
    });
    return this.http.get(this.url+'api/v1/supervisor/report/gradesbygroup?groupid='+idgroup,{headers:headers});
  }
  /*
  Metodo para los alumnos inactivos
  */
  getUserInactives():Observable<any>{
    let headers = new HttpHeaders({
      'x-access-token':this.token
    });
    return this.http.get(this.url+'api/v1/supervisor/report/userswoactivity',{headers:headers});
  }
  /*
  Metodo para los reportes estadisticos
  */
  public getCharts(query):Observable<any>{
    let queryJson = '';
		if(typeof query != 'string'){
			queryJson = JSON.stringify(query);
		} else {
			queryJson = query;
		}
    // let headers = new HttpHeaders({
    //   'x-access-token':this.token
    // });
    // return this.http.get(this.url+'api/v1/supervisor/report/percentil?ou='+queryJson,{headers:headers});
		return this.http.get(this.url+'api/v1/supervisor/report/percentil?ou='+queryJson);
  }

	public getEval(ou:string,project:string):Observable<any>{
		return this.http.get(this.url+'ap1/v1/supervisor/report/eval?ou='+ou+'&project='+project);
  }

  /*
  reseteo de contraseña por usuario isOrg
  */
  public resetpassisorg(emailuser:string):Observable<any>{
    let headers = new HttpHeaders({
      'x-access-token':this.token
    });
    return this.http.get(this.url+'api/v1/orgadm/user/passwordreset?username='+emailuser,{headers:headers});
  }

  /*
  agregar una nueva seccion a un curso
  */
  public setSection(coursecode): Observable<any> {
    const params = JSON.stringify(coursecode);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
			'x-access-token':this.token
    });
    return this.http.put(this.url + 'api/v1/author/course/newsection' , params , {headers:headers});
  }

  /*
  Metodo para agregar el bloque a un curso
  */
  public setNewBlock(block): Observable<any> {
    const params = JSON.stringify(block);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
			'x-access-token':this.token
    });
    return this.http.post(this.url +'api/v1/author/course/createblock' , params , {headers:headers});

  }
  /*
  Metodo para agregar un nuevo curso
  */
  public setNewCourse(course): Observable<any> {
    const params = JSON.stringify(course);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
			'x-access-token':this.token
    });
    return this.http.post(this.url + 'api/v1/author/course/create', params , {headers:headers});
  }

  /*
  Metodo para calificar las tareas desde la vista del tutor
  */
  public setgradeTask(gradetask): Observable<any>{
    const params = JSON.stringify(gradetask);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.put(this.url + 'api/v1/instructor/group/gradetask', params, {headers:headers});
  }

  /*
  Metodo para calificar las tareas desde la vista del tutor v1.0.1
  */
  public setgradeTaskconcatMap(task: any[]): Observable<any>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return from(task).pipe(concatMap(
      idTask => this.http.put(this.url + 'api/v1/instructor/group/gradetask', idTask, {headers:headers}) as Observable<any>));
  }

  /*
  Metodo para modificar el contenido del curso
  */
  public updateContent(block: any): Observable<any> {
    const params = JSON.stringify(block);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
			'x-access-token':this.token
    });
    return this.http.put(this.url + 'api/v1/author/course/modifyblock', params , {headers:headers});
  }
  /*
  Metodo para traer el contenido del curso que editara el autor
  */
  public getContent(id):Observable<any>{
		const headers = new HttpHeaders({
			'x-access-token':this.token
    });
    return this.http.get(this.url + 'api/v1/author/course/getblock?id=' + id, {headers:headers});
  }

  /*
  metodo para obtener el temario por cada curso y mostrarlo al autor
  */
  public getlistBlock(courseid):Observable<any>{
		const headers = new HttpHeaders({
			'x-access-token':this.token
    });
    return this.http.get(this.url+'api/v1/author/course/getblocklist?id=' + courseid + '&section1=0&section2=500', {headers:headers});
  }

  /*
  metodo para obtener el listado de cursos y mostrarlos al autor
  */
  public getCoursesAuth():Observable<any>{
		const headers = new HttpHeaders({
			'x-access-token':this.token
    });
    return this.http.get(this.url+'api/v1/course/listcourses',{headers:headers});
  }

  /*
  obtener la tarea por alumno
  */
  public getTask(groupid, studentid, blockid):Observable<any>{
    return this.http.get(this.url+'api/v1/instructor/group/studenttask?groupid='+groupid+'&studentid='+studentid+'&blockid='+blockid);
  }
  /*
  Obtener el listado de los alumnos con el detalle de cada uno
  */
  public getlistroster(groupcode):Observable<any>{
    return this.http.get(this.url+'api/v1/instructor/group/listroster?code='+groupcode);
  }

	/*
  Obtener el listado de los alumnos con el detalle de cada uno
	Este lo pusimos por la duda de que otro componente usara este servicio
  */
  public getlistrostersuper(groupcode):Observable<any>{
    return this.http.get(this.url+'api/v1/supervisor/group/listroster?code='+groupcode);
  }

  /*
  Obtener el listado de los grupos asignados por tutor
  */
  public mylistgroup():Observable<any>{
    return this.http.get(this.url+'api/v1/instructor/group/mylist');
  }

  /*
  Reportes por campo
  */
  public getReportsOrg():Observable<any>{
    return this.http.get(this.url+'api/v1/supervisor/report/gradesbycampus');
  }

  /*
  api para la descarga de archivos
  */
  // public downloadFile(id:any):Observable<any>{
  //   return this.http.get(this.url+'api/v1/file/download?fileid='+id, {
	// 		reportProgress: true
	// 	});
  // }
	public downloadFile(fileid:string):Observable<any>{
		const req = new HttpRequest('GET', this.url+'api/v1/file/download?fileid='+fileid,{
			reportProgress: true,
			responseType: 'blob'
		});
		return this.http.request(req);
  }

	public downloadFileDetails(fileid:any):Observable<any>{
    return this.http.get(this.url+'api/v1/file/download?fileid='+fileid+'&link=true');
  }

  /*
  api para obtener el arbol de organizaciones para los reportes
  */
  public getOrgTree(project:string):Observable<any>{
		if(project) {
			return this.http.get(this.url+'api/v1/supervisor/report/orgtree?project='+project);
		} else {
			return this.http.get(this.url+'api/v1/supervisor/report/orgtree');
		}
  }

	public projects():Observable<any>{
		return this.http.get(this.url+'api/v1/supervisor/projects');
	}

  public getUserAccount(username):Observable<any>{
    return this.http.get(this.url+'api/v1/supervisor/user/getgroups?username='+username);
  }

  public getGroupsManager(ou):Observable<any>{
    return this.http.get(this.url+'api/v1/supervisor/group/list?ou='+ou);
  }

  public getUserBySupervisor(username): Observable<any> {
    return this.http.get(this.url + 'api/v1/supervisor/user/getdetails?username=' + username);
  }

	public modifyUser(bodypass): Observable<any> {
		const params = JSON.stringify(bodypass);
    return this.http.put(this.url + 'api/v1/admin/user/modify',params);
  }

  public resetpassBySupervisor(bodypass): Observable<any> {
    const params = JSON.stringify(bodypass);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.put(this.url +'api/v1/supervisor/user/passwordreset', params, {headers: headers});
  }

  public updateuserBySupervisor(bodynewuser): Observable<any> {
    let params = JSON.stringify(bodynewuser);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.put(this.url + 'api/v1/supervisor/user/changeuser', params, {headers: headers});
  }
}
