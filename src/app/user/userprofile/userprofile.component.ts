import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from './../../shared/sharedservices/user.service';
import { CourseService } from './../../shared/sharedservices/course.service';

@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  providers:[UserService, CourseService]

})
export class UserprofileComponent implements OnInit {

  public identiti
  public token;

  user:any;

  courseid:any;
  groupid:any;
  itemid:any;
  studentid:any;

  newpasswordOk:boolean;

  cursos:any[]=[];
  notification:any[]=[];

  messaggeError:string;
  messaggeSuccess:string;
  loading:boolean=false;

  constructor(private userservice:UserService, public courseservice:CourseService, private router:Router) {
    this.identiti = this.userservice.getIdentiti();
    this.token = this.userservice.getToken();
  }

  ngOnInit() {
    this.getPerson(this.identiti.name);
    this.getCourses();
    this.getNotifications();
  }

  getPerson(username){
    this.userservice.getUserDetails(username).subscribe(data=>{
      this.user = data.user;
    },error=>{
      this.messaggeError = error;
    });
  }

  public getCourses(){
    this.courseservice.getCourses(this.token).subscribe(data =>{
      this.cursos = data.message.groups;
    },error =>{
      this.messaggeError = error;
    });
  }

  /*
  Metodo para redireccionar al usuario al curso que selecciono
  */
  public getMycourse(course:string, groupid:string, courseid:string, lastSeenBlock:string, firstBlock:string){
    if(!lastSeenBlock){
      this.router.navigate(['/user/mycourses',course,groupid,courseid,firstBlock]);
    }else{
      this.router.navigate(['/user/mycourses',course,groupid,courseid,lastSeenBlock]);
    }
  }

  /*
  metodos para traer las notificaciones
  */
  public getNotifications(){
    this.loading = true;
    this.notification=[];
    this.userservice.getMyNotifications().subscribe(data=>{
      if(Array.isArray(data.message)){
        for(let id of data.message){
          this.notification.push(id);
        }
      }
      this.loading = false;
			console.log(this.notification)
    },error=>{
      console.log(error);
      this.loading = false;
    });
  }

  /*
  metodo para redireccionar al mensaje de la notificacion
  */
  public getviewnotification(objects:any[], sourceRole:any, notificationid:any, studentid:any){
    this.studentid = studentid;
		console.log(objects)
    this.reloadConst();
    for(let idObject of objects){
      if(idObject.kind === "courses" && idObject.item){
        this.courseid = idObject.item._id;
      }
      if(idObject.kind === "groups" && idObject.item){
        this.groupid = idObject.item._id;
      }
      if(idObject.kind === "blocks" && idObject.item){
        this.itemid = idObject.item._id;
      }
      if(idObject.kind === "discussions" && idObject.item){
        this.itemid = idObject.item._id;
      }
    }

    this.router.navigate(['/user/viewNotification', this.courseid, this.groupid, this.itemid, sourceRole, this.studentid]);
  }

  /*
  metodo para redireccionar al mensaje de la notificacion
  */
  public getviewnotificationblock(blockid, id, type){
    this.router.navigate(['viewNotificationB',blockid,id,type])
  }

  /*

  */
  reloadConst(){
    this.courseid="";
    this.groupid="";
    this.itemid="";
  }

  /*
  metodo para validar si existe la nueva contraseña
  */
  validatenewpassword(newpassword){
    this.newpasswordOk = newpassword!='null' && newpassword!='';
    console.log(this.newpasswordOk);
  }

  /*
  funcion para el cambio de contraseña del usuario
  */
  changePassword(newpassword){
    this.messaggeError = null;
    this.messaggeSuccess = null;
    let json = {
      "password":newpassword
    }
    this.userservice.changePassword(json).subscribe(
      data=>{
        this.messaggeSuccess = "Se actualizó la contraseña exitosamente"
      },error=>{
        this.messaggeError = "Ocurrio un error interno en la plataforma";
        console.log(error);
      });
  }
}
