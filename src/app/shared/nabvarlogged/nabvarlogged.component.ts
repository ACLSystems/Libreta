import { Component, DoCheck, OnInit } from '@angular/core';
import { CourseService } from './../../shared/sharedservices/course.service';
import { environment } from './../../../environments/environment';
import { log } from 'util';
import { NotificationClose } from './../models/notificationClose';
import { Roles } from './../models/roles';
import { Router } from '@angular/router';
import { UserService } from './../../shared/sharedservices/user.service';


@Component({
  selector: 'app-nabvarlogged',
  templateUrl: './nabvarlogged.component.html',
  providers: [UserService, CourseService]
})
export class NabvarloggedComponent implements OnInit, DoCheck {

  identiti: any;
  token: any;
  sesionExpired = false;
  rolesUser: any[] = [];
  courseShop: any[] = [];
  groupsUser = 0;
  notificationid: NotificationClose;
  responseRoles: any;
  rolOrg =  false;
  rolSup =  false;
  rolUser = false;
  rolAdmin = false;
  rolAutho = false;
  rolRequester = false;
  rolInstructor = false;

  notifications = 0;
  messagesNotifications: any [] = [];
  messaError: string;

  courseid: any;
  coursetitle: any;
  groupid: any;
  itemid: any;
  studentid: any;
  production: any;

  constructor(private userService: UserService, private router: Router, private course: CourseService) {
    this.token = this.userService.getToken();
    this.identiti = this.userService.getIdentiti();
    this.production = environment.production;
    this.getRolesUser();
  }

  ngOnInit() {
    this.token = this.userService.getToken();
    this.identiti = this.userService.getIdentiti();
    this.getNumberNotifications();
    this.getCourses();
    this.getRolesUser();
  }

  ngDoCheck() {
    this.identiti = this.userService.getIdentiti();
  }

  getCourses() {
    this.course.getCourses(this.token).subscribe(data => {
      this.groupsUser = data.message.numgroups;
    });
  }


  /*
  metodo para consultar los roles del usuario
  */
  getRolesUser() {
     this.userService.getRoles().subscribe(data => {
      this.rolUser = data.message.isUser;
      this.rolSup = data.message.isSupervisor;
      this.rolAdmin = data.message.isAdmin;
      this.rolAutho = data.message.isAuthor;
      this.rolInstructor = data.message.isInstructor;
      this.rolOrg = data.message.isOrg;
      this.rolRequester = data.message.isRequester;
    });
  }

  /*
  funcion para el cierre de sesion del usuario
  */
  logout() {
    localStorage.removeItem('identiti');
    localStorage.removeItem('token');
    localStorage.clear();
    this.router.navigate(['/home']);
  }

  /*
  metodo para obtener el numero de notificaciones
  */
  getNumberNotifications() {
    this.userService.getNotifications().subscribe(data => {
      this.messagesNotifications = [];
      if (data.newNotifications > 0) {
        this.notifications = data.newNotifications;
// tslint:disable-next-line: no-shadowed-variable
        this.userService.getMyNotificationsBell().subscribe(data => {
          const messages = data.message;
          for (const idmessage of messages) {
            if (!idmessage.read) {
              this.messagesNotifications.push(idmessage);
            }
          }
        });
      } else {
        this.notifications = 0;
      }
    });
  }

  /*
  metodo para redireccionar al mensaje de la notificacion de el FAQ del curso
  */
  public getviewnotification(objects: any[], sourceRole: any, notificationid: any, studentid: any, type: any) {
    this.studentid = studentid;
    this.reloadConst();
    for (const idObject of objects) {
      if (idObject.kind === 'courses') {
        if (type === 'system') {
          this.coursetitle = idObject.item.title;
        }
        this.courseid = idObject.item._id;
      }
      if (idObject.kind === 'groups') {
        this.groupid = idObject.item._id;
      }
      if (idObject.kind === 'blocks') {
        this.itemid = idObject.item._id;
      }
      if (idObject.kind === 'discussions') {
        this.itemid = idObject.item._id;
      }
    }

    if (type === 'system') {
      this.router.navigate(['/mycourses', this.coursetitle, this.groupid, this.courseid, this.itemid]);
      this.notificationid = new NotificationClose(notificationid);
      this.closeNotification(this.notificationid);
    } else {
      this.router.navigate(['viewNotification', this.courseid, this.groupid, this.itemid, sourceRole, this.studentid]);
      this.notificationid = new NotificationClose(notificationid);
      this.closeNotification(this.notificationid);
    }
  }

  /*
  metodo para redireccionar al mensaje de la notificacion de un bloque
  */
  public getviewnotificationblock(blockid: any, id: any, type: any, notificationid: any) {
    this.router.navigate(['viewNotificationB', blockid, id, type]);
    this.notificationid = new NotificationClose(notificationid);
    this.closeNotification(this.notificationid);
  }

  /*
  metodo para visualizar la tarea del usuario
  */
  public getTaskUser(blockid: any, id: any, type: any, notificationid: any) {
    this.router.navigate(['viewNotificationB', blockid, id, type]);
    this.notificationid = new NotificationClose(notificationid);
    this.closeNotification(this.notificationid);
  }

  /*
  metodo para actualizar una notificacion como vista
  */
  public closeNotification(notificationid: any) {
    this.userService.closeNotification(notificationid).subscribe(data => {
      this.getNumberNotifications();
    });
  }

  public setShopCourses( courseid: any, members: number) {
    this.courseShop.push({
      curso: courseid,
      member: members
    });
  }

  /*

  */
  reloadConst() {
    this.courseid = '';
    this.groupid = '';
    this.itemid = '';
  }
}
