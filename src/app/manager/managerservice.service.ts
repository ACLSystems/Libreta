import { concatMap } from 'rxjs/operators';
import { environment } from './../../environments/environment';
import { from } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { UserService } from './../shared/sharedservices/user.service';


@Injectable()
export class ManagerserviceService {

  numberRegex = /^([0-9])*$/
  stringRegex = /^([A-Za-z])+$/
  stringRegexBlank = /([A-Za-z])\s([A-Za-z])/
  termnRegex = /^Semestre\s([I,II,III,IV,V,VI,VII])/
  emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  rfcRegex = /^([A-ZÑ&]{3,4}) ?(?:- ?)?(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])) ?(?:- ?)?([A-Z\d]{2})([A\d])$/;


  public datosOk:boolean;
  public datosOkrfc:boolean;
  public url:string;
  public token;


  constructor(private http:HttpClient, private userservice:UserService) {
    this.url = environment.url;
  }

  /*
  Metodo de consulta de grupos para el supervisor
  */
  public getGroupsManager(ou:any):Observable<any>{
    return this.http.get(this.url+'api/v1/requester/group/list?ou='+ou);
  }

  /*
  Metodo para obtener el listado de cursos disponibles
  */
  public getCourses():Observable<any>{
    return this.http.get(this.url+'api/course/list?org=conalep');
  }

  /*

  */
  public getGroupsforParent(idcourse, parent):Observable<any>{
    return this.http.get(this.url+'api/v1/requester/report/groupsquery?course='+idcourse+'&parent='+parent);
  }

  //funcion para obtener los estados de la republica
  getStates(org:string, query:any):Observable<any>{
    let json = JSON.stringify(query);
    return this.http.get(this.url+'api/orgunit/list?org='+org+"&query="+json+"&limit=100");
  }

  //Metodo para crear el grupo
  postGroup(groupSave):Observable<any>{
    let params = JSON.stringify(groupSave);
    return this.http.post(this.url+'api/v1/requester/group/create', params);
  }

  //Metodo para activar el grupo
  modifyGroup(groupModify):Observable<any>{
    let params = JSON.stringify(groupModify);
    return this.http.put(this.url+'api/v1/requester/group/modify', params);
  }

  //Consultar la nueva clave del grupo para que no se duplique
  getCodeGroup(codegroup):Observable<any>{
    return this.http.get(this.url+'api/v1/requester/group/listroster?code='+codegroup);
  }

  /*
  funcion para la creacion de una nueva solicitud
  */
  getNewRequest(request):Observable<any>{
    let params = JSON.stringify(request);
    return this.http.post(this.url+'api/v1/requester/request/create',request);
  }

  /*
  Metodo para cancelar una solicitud
  */
  deletedRequest(request):Observable<any>{
    let params = JSON.stringify(request);
    return this.http.put(this.url+"api/v1/requester/request/cancel", params);
  }

  //metodo para obtener las carreras en base a area de educacion
  getCarreras(org:string):Observable<any>{
    return this.http.get(this.url+'api/career/list?org='+org+"&limit=50");
  }

  //metodo para obtener el listado de las solicitudes de servicio por usuario
  getRequestsManager():Observable<any>{
    return this.http.get(this.url+"api/v1/requester/request/my?active=false");
  }

  //metodo para la consulta de una solicitud mediante numero de solicitud
  getRequestFinder(numberrequest):Observable<any>{
    return this.http.get(this.url+'api/v1/requester/request/get?number='+numberrequest);
  }

  //Metodo para actualizar las solicitudes
  updateRequestManager(request):Observable<any>{
    let params = JSON.stringify(request);
    return this.http.put(this.url+"api/v1/requester/request/modify", params);
  }

  sendMailRequestManager(bodyemail):Observable<any>{
    let params = JSON.stringify(bodyemail);
    return this.http.post(this.url+"api/v1/requester/request/sendemail", params);
  }

  //metodo para cerrar una solicitud
  closeRequestManager(request):Observable<any>{
    let params = JSON.stringify(request);
    return this.http.put(this.url+"api/v1/requester/request/finish", params);
  }

  //Metodo para obtener los datos del usuario
  getUserDetailsByManager(username):Observable<any>{
    return this.http.get(this.url+"api/v1/requester/user/getdetails?username="+username);
  }

  //metodo para obtener los datos fiscales del usuario en caso de que si los tenga
  getFiscalDetailsByManager(name):Observable<any>{
    return this. http.get(this.url+"api/v1/requester/user/getdetails?username="+name);
  }

  //metodo para el alta del usuario masivamente
  createuserbymanager(usermuir):Observable<any>{
    let params = JSON.stringify(usermuir);
    return this.http.post(this.url+"api/v1/requester/user/muir", params);
  }

  createroosterbymanager(roosters):Observable<any>{
    let params = JSON.stringify(roosters);
    return this.http.put(this.url+"api/v1/requester/group/createroster", params);
  }

  //metodo para obtener el listado de RFC del supervisor
  getrfccorporate():Observable<any>{
    return this.http.get(this.url+"api/v1/requester/fiscal/list");
  }

  //
  createusers(usermuir):Observable<any>{
    return from(usermuir).pipe(concatMap(idUser => <Observable<any>> this.http.post(this.url+"api/v1/requester/user/muir", idUser) ));
  }

  /*
  metodo para enviar los archivos de la tareas
  */
  setAttachment(file, dir1:any, dir2:any, token:any):Observable<any>{
    let formData = new FormData();
    formData.append('file',file);
    formData.append('fileName',file.name);
    return this.http.post(this.url + 'api/v1/file/upload?dir1='+dir1+'&dir2='+dir2, formData);
  }

  /*
  metodo para enviar el comprobante de pago al api del fresh
  */
  sendPayment(payment):Observable<any>{
    let params = JSON.stringify(payment);
    return this.http.post(this.url+'api/v1/requester/request/setpayment', params);
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

  /*
  metodo para validar el correo electronico del usuario
  */
  public validateEmails(value):boolean{
    let datosOk = false;
    datosOk = this.emailRegex.test(value);
    return datosOk;
  }

  /*
  Metodo para validar los semestres del alumno
  */
  public validateTermn(value):boolean{
    let datosOk = false;
    datosOk = this.termnRegex.test(value);
    return datosOk
  }

  /*
  Metodo para validar espacios en blanco
  */
  public validateSpaceBlank(value):boolean{
    let datosOk = false;
    datosOk = this.stringRegexBlank.test(value) || this.stringRegex.test(value);
    return datosOk
  }

  /*
  Metodo para generar el password del usuarios
  */
  public passwordGenerator(consecutivo, name:string, fatherName:string):string{
    let elementsPass = ['.','+','-','*','$','&','#'];
    let password = fatherName.substring(0,1).toUpperCase() + elementsPass[Math.floor(Math.random() * elementsPass.length)] + consecutivo + name.substring(0,3)
    return password;
  }

  /*
  Metodo para la validacion de nuevos rfc
  */
  public validaterfc(rfc):boolean{
    this.datosOkrfc = this.rfcRegex.test(rfc);
    return this.datosOkrfc;
  }
}
