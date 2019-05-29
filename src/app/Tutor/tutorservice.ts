import { environment } from './../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
//import 'rxjs/add/operator/map' ;


@Injectable()

export class TutorService {

  public url:string;

  constructor(public http:HttpClient){
    this.url = environment.url
  }

  /*
  Obtener el listado de los alumnos con el detalle de cada uno
  */
  public getlistroster(groupcode):Observable<any>{
    return this.http.get(this.url+'api/v1/instructor/group/listroster?code='+groupcode);
  }

  /*
  metodo para traer el historial de calificaciones del alumno
  */
  getGradesStudent(groupid, studentid):Observable<any>{
    return this.http.get(this.url+'api/v1/instructor/group/studentgrades?groupid='+groupid+'&studentid='+studentid);
  }

  /*
  crear un tema para el foro de discusión
  */
  setDiscusion(discusion):Observable<any>{
    let params = JSON.stringify(discusion);
    return this.http.post(this.url+"api/v1/user/comment/create",params);
  }

  /*
  listar las dudas y comentarios de los cursos
  */
  getDiscussionCourse(courseid:any, groupid:any):Observable<any>{
    return this.http.get(this.url+'api/v1/user/comment/get?query={"course":"'+courseid+'","group":"'+groupid+'","pubtype":"discussion","type":"root"}&order=-1&skip=0&limit=500');
  }

  /*
  listar los avisos de los cursos
  */
  getAnnouncementCourse(courseid:any, groupid:any):Observable<any>{
    return this.http.get(this.url+'api/v1/user/comment/get?query={"course":"'+courseid+'","group":"'+groupid+'","pubtype":"announcement","type":"root"}&order=-1&skip=0&limit=500');
  }

  /*
  obtener los comentarios en la pestaña de dudas y preguntas de los cursos
  */
  getCommentsCourses(courseid:any, groupid:any):Observable<any>{
    return this.http.get(this.url+'api/v1/user/comment/get?query={"course":"'+courseid+'","group":"'+groupid+'","pubtype":"discussion","type":"comment"}&order=1&skip=0&limit=500');
  }

  /*
  obtener las respuestas en la pestaña de dudas y preguntas de los bloques
  */
  getReplysCourses(courseid:any,groupid:any):Observable<any>{
    return this.http.get(this.url+'api/v1/user/comment/get?query={"course":"'+courseid+'","group":"'+groupid+'","pubtype":"discussion","type":"reply"}&order=1&skip=0&limit=500');
  }

  /*
  meotodo para agregar una notificacion
  */
  setNotification(message){
    let params = JSON.stringify(message);
    return this.http.post(this.url+'api/v1/user/message/create', params);
  }

  /*
  crear un follos a determinado elemento
  */
  setFollow(follow){
    let params = JSON.stringify(follow);
    return this.http.post(this.url+'api/v1/user/follow/create', params);
  }

  /*
  quitar el follos a determinado elemento
  */
  quitFollow(followid){
    let params = JSON.stringify(followid);
    return this.http.put(this.url + 'api/v1/user/follow/delete', params);
  }

  getDetailsGroup(groupid): Observable <any> {
    return this.http.get(this.url + 'api/v1/instructor/group/get?groupid=' + groupid);
  }

  updateEventsTutor( params: any): Observable<any> {
    return this.http.put(this.url + 'api/v1/instructor/group/savedates', params);
  }

  approvalconst( roster: any) {
    return this.http.put(this.url + 'api/v1/instructor/group/releasecert', roster);
  }

  /*
  metodo forkjoin para traer los datos del taskreview
  */
  getTaskReview(courseid, groupid){
    return Observable.forkJoin(
      this.getAnnouncementCourse(courseid, groupid),
      this.getDiscussionCourse(courseid, groupid),
      this.getCommentsCourses(courseid, groupid),
      this.getReplysCourses(courseid, groupid),
      this.getDetailsGroup(groupid)
    )//.map(res => this.joinEventsTaskReviewInit(res[0],res[1],res[2],res[3]))
  }
}
