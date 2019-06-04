import { environment } from './../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { UserService } from './user.service';
import 'rxjs/add/operator/map';
 ;

@Injectable()
export class CourseService {

  public url: string;
  public token: any;
  public resultQueryCours: any[];
  public idRQ: string;

  youtubeUrl = 'https://www.googleapis.com/youtube/v3';
  apikey = 'AIzaSyD0yRdoVfZWhISHwYu1j758Phg6jZggvrQ';

  constructor(public http: HttpClient, private user: UserService) {
    this.url = environment.url;
    this.token = this.user.getToken();
  }

  /*
  metodo para enviar los archivos de la tareas
  */
  setAttachment(file: any, dir1: any, dir2: any): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', file.name);
    const headers = new HttpHeaders({
      'Content-Type': 'multipart/form-data'
    });
    return this.http.post(this.url + 'api/v1/file/upload?dir1=' + dir1 + '&dir2=' + dir2, formData, {headers:headers});
  }

  /*
  Metodo para enviar las tareas
  */
  setTasks(task): Observable <any>{
    const params = JSON.stringify(task);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.put(this.url + 'api/v1/user/savetask' , params, {headers:headers});
  }
  /*
  Metodo para obtener los recursos de un curso
  */
  getResources(groupid:any, token:any):Observable<any>{
    let headers = new HttpHeaders({
      'x-access-token': token
    });

    return this.http.get(this.url + 'api/v1/user/getresource?groupid=' + groupid);
  }

  /*
  obtener las respuestas en la pestaña de dudas y preguntas de los bloques
  */
  getReplysBlock(blockid):Observable<any>{
    let headers = new HttpHeaders({
      'x-access-token':this.token
    });
    return this.http.get(this.url+'api/v1/user/comment/get?query={"pubtype":"discussion","type":"reply","block":"'+blockid+'"}&order=1&skip=0&limit=500');
  }

  /*
  obtener las respuestas en la pestaña de dudas y preguntas de los bloques
  */
  getReplysCourses(courseid:any,groupid:any):Observable<any>{
    let headers = new HttpHeaders({
      'x-access-token':this.token
    });
    return this.http.get(this.url+'api/v1/user/comment/get?query={"course":"'+courseid+'","group":"'+groupid+'","pubtype":"discussion","type":"reply"}&order=1&skip=0&limit=500');
  }

  /*
  obtener los comentarios en la pestaña de dudas y preguntas de los bloques
  */
  getCommentsBlock(blockid):Observable<any>{
    return this.http.get(this.url+'api/v1/user/comment/get?query={"pubtype":"discussion","type":"comment","block":"'+blockid+'"}&order=1&skip=0&limit=500');
  }

  /*
  obtener los comentarios en la pestaña de dudas y preguntas de los cursos
  */
  getCommentsCourses(courseid:any, groupid:any):Observable<any>{
    return this.http.get(this.url+'api/v1/user/comment/get?query={"course":"'+courseid+'","group":"'+groupid+'","pubtype":"discussion","type":"comment"}&order=1&skip=0&limit=500');
  }

  /*
  listar las dudas y comentarios de los bloques
  */
  getDiscussion(blockid):Observable<any>{
    return this.http.get(this.url+'api/v1/user/comment/get?query={"pubtype":"discussion","type":"root","block":"'+blockid+'"}&order=-1&skip=0&limit=500');
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
  comentar en un tema del foro de discusion
  */
  setReplytto(reply): Observable<any> {
    const params = JSON.stringify(reply);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post(this.url + 'api/v1/user/comment/create', params, {headers:headers});
  }

  /*
  crear un tema para el foro de discusión
  */
  setDiscusion(discusion):Observable<any>{
    const params = JSON.stringify(discusion);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post(this.url + "api/v1/user/comment/create", params, {headers:headers});
  }

  /*
  Mostrar la información de avance en el curso al alumno
  */
  getMyGrades(groupid:any, token:any):Observable<any>{
    return this.http.get(this.url + 'api/v1/user/mygrades?groupid=' + groupid );
  }

  /*
  guardar las calificaciones del alumno en el mongodb
  */
  setAttempt(attempt):Observable<any>{
    let params = JSON.stringify(attempt);
    let headers = new HttpHeaders(
      {
        'Content-Type':'application/json'
      }
    );
    return this.http.put(this.url+'api/v1/user/createattempt', params, {headers:headers});
  }

  getCourses(token:any):Observable<any>{
    return this.http.get(this.url+'api/v1/user/mygroups');
  }

  getCoursesOrg():Observable<any>{
    return this.http.get(this.url+'api/course/list?org=conalep');
  }

  showBlocks(id:any):Observable<any>{
    return this.http.get(this.url+'api/course/getblocklist?id='+id);
  }


  /*
  funcion para mostrar el listado del temario en base al track
  */

  showBlocksTrack(id:any, token:any):Observable<any>{
    return this.http.get(this.url+'api/v1/user/mygroup?groupid=' + id);
  }


  /*
  Metodo para traer la informacion del bloque
  */
  getBlock(groupid:string,courseid:string,blockid:string, prev?:boolean):Observable<any>{
    if(prev){
      return this.http.get(this.url + 'api/v1/user/nextblock?groupid=' + groupid + '&courseid=' + courseid + '&blockid=' + blockid + '&lastid=' + blockid);
    }else{
      return this.http.get(this.url + 'api/v1/user/nextblock?groupid=' + groupid + '&courseid=' + courseid + '&blockid=' + blockid);
    }
  }

  getBlockNext(groupid:string,courseid:string,blockid:string):Observable<any>{
    return this.http.get(this.url+'api/v1/user/nextblock?groupid='+groupid+'&courseid='+courseid+'&blockid='+blockid+'&lastid='+blockid);
  }

  getMyGradesTask(groupid: any, blockid: any): Observable<any> {
    return this.http.get(this.url+'api/v1/user/getgrade?groupid='+groupid+'&blockid='+blockid);
  }

}
