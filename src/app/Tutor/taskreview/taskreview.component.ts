import { ActivatedRoute, Router } from '@angular/router';
import { CalendarComponent } from 'ng-fullcalendar';
import { Comment } from './../../models/course/comment';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CourseService } from './../../shared/sharedservices/course.service';
import { DatePipe } from '@angular/common';
import { Doubt } from './../../models/temp/doubt';
import { FollowId, Follows } from './../../user/models/follow';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Notification } from './../../user/models/notification';
import { Objects } from './../../user/models/Objects';
import { Options } from 'fullcalendar';
import { Reply } from './../../models/course/reply';
import { ServiceisorgService } from './../../shared/sharedservices/serviceisorg.service';
import { TutorService } from './../tutorservice';
import { UserService } from './../../shared/sharedservices/user.service';




@Component({
  selector: 'app-taskreview',
  templateUrl: './taskreview.component.html',
  providers: [UserService, ServiceisorgService, CourseService, DatePipe, TutorService]
})
export class TaskreviewComponent implements OnInit {

  token: any;
  loading = false;
  loadingbtn = false;
  closemodal: NgbModalRef;

  calendarOptions: Options;
  @ViewChild(CalendarComponent) calendarActivities: CalendarComponent;
  dataActivities: any [] = [];
  // v1.0.2
  dataTask: any [] = [];
  messageErrorevent: any;
  messageSuccesevent: any;
  today = new Date().getDate();

  // v1.0.0.1

  doubt: Doubt;
  comment: Comment;
  reply: Reply;
  notification: Notification;

  follow: Follows;
  followid: FollowId;


  objectCourse: Objects;
  objectComment: Objects;
  objectReply: Objects;
  objectGroup: Objects;
  objects: Objects[] = [];

  replytoreply: any;
  rootreply: any;
  commentidreply: any;
  userid: any;
  titleComment: any;
  blockreply: any;
  rootcomment: any;
  replytocomment: any;
  titleDoubt: any;
  blockcomment: any;

  rosteridl: any;
  namel: string;
  fatherNamel: string;
  motherNamel: string;
  messagecertificate: any;

  public listRooster: any;
  public idrooster: any;
  public curso: string;
  public grupo: string;
  public beginDate: Date;
  public endDate: Date;
  public totalStudents: number;
  public courseid: any;
  public groupid: any;
  public dataGrades: any[] = [];
  public students: any[] = [];
  public grades: any[] = [];
  public tasksStudent: any[] = [];
  public labelGrades: any;
  public labelGradesList: any[] = [];

  public studentid: any;
  public announcement: Doubt;
  public announcements: any[] = [];

  discussions: any[];
  comments: any[];
  replys: any[];

  public messageSuccess: any = '';
  public messageSuccessConst: any = '';
  public messageError: any = '';

  groupCode: string;

  constructor(
    private tutorservice: TutorService,
    private modalService: NgbModal,
    private router: Router,
    private activeRouter: ActivatedRoute,
    private user: UserService,
    private courseService: CourseService,
    private datePipe: DatePipe) {
    this.token = this.user.getToken();
    this.activeRouter.params.subscribe(params => {
      this.groupCode = params.groupCode;
    });
  }
  ngOnInit() {
    this.getTasks();
  }

  /*
  Metodo para obtener el listado de los alumnos por grupo con sus respectivas tareas
  */
  public getTasks() {
    this.loading = true;
    this.labelGradesList = [];
    this.tutorservice.getlistroster(this.groupCode).subscribe(data => {
      this.listRooster = data.message;
      //console.log(this.listRooster);
      this.courseid = data.message.courseid;
      this.groupid = data.message.groupid;
      for (const item of data.message.students) {
        if (item.grades.length === 0) {
          this.labelGrades = 'sin tareas';
        } else {
          for (const itemGrades of item.grades) {
            if (!itemGrades.taskGrade) {
              this.labelGrades = 'sin revisar tarea';
            } else {
              this.labelGrades = 'tareas';
            }
          }
        }
        this.labelGradesList.push(this.labelGrades);
      }
      this.tutorservice.getTaskReview(this.courseid, this.groupid).subscribe( rest => {
        this.announcements = rest[0].message;
        this.discussions = rest[1].message;
        this.comments = rest[2].message;
        this.replys = rest[3].message;
        this.dataActivities = rest[4].message.dates;
        for (const id of rest[4].message.dates) {
          this.beginDate = new Date(id.beginDate);
          this.endDate = new Date(id.endDate);
          this.dataTask.push({
            title: id.label,
            start: this.datePipe.transform(this.beginDate, 'yyyy-MM-dd 00:00:01'),
            end: this.datePipe.transform(this.endDate, 'yyyy-MM-dd 23:59:00'),
            color: this.colorevents(id.type),
            type: id.type
          });
        }
        this.loading = false;
      });
    });
    this.calendarOptions = {
      locale: 'es',
      height: 700,
      editable: true,
      eventLimit: false,
      header: {
        left: 'prev,next',
        center: 'title',
        right: ''
      },
      selectable: false,
      events: this.dataTask
    };
  }

  public colorevents(type: string): string {
    let color: any;
    if (type === 'task') {
      color = 'red';
    }
    if (type === 'exam') {
      color = 'green';
    }
    if (type === 'general') {
      color = 'blue';
    }
    if (type === 'certificate') {
      color = 'yellow';
    }
    return color;
  }

  /*
  Metodo para enviar a la vista de tareas
  */
  setTaskReview(grupo: any, courseid: any, groupid: any, blockid: any) {
    this.router.navigate(['/tutor/tasksview', grupo, courseid, groupid, this.studentid, blockid]);
    this.closeModal();
  }

  /*
  metodo para recibir las tareas
  */
  viewTask(tasks: any, studentid: any, content: any) {
    this.tasksStudent = [];
    this.tasksStudent = tasks;
    this.studentid = studentid;
    this.showModal(content);
  }

  /**
   *
   * Metodo para liberar la constancia por alumno
   */
  viewMessageCertificated(rosterid: any, name: string, fatherName: string, motherName: string, content: any) {
    this.rosteridl = rosterid;
    this.namel = name;
    this.fatherNamel = fatherName;
    this.motherNamel = motherName;
// tslint:disable-next-line: max-line-length
    this.messagecertificate = 'Se activara la constancia para el participante: ' + this.namel + ' ' + this.fatherNamel + ' ' + this.motherNamel;
    this.showModal(content);
  }

  /*
  metodo para traer el historial de calificaciones del alumno
  */
  viewGrades(groupid: any, userid: any, content: any) {
    this.tutorservice.getGradesStudent(groupid, userid).subscribe(data => {
      this.dataGrades = data.message.blocks;
      this.showModal(content);
    });
  }

  /*

  */
  public setAnnouncement(descr: any) {
    this.loadingbtn = true;
    this.announcement = new Doubt(this.courseid, this.groupid, 'root', 'Aviso del instructor', descr, 'announcement');

    this.tutorservice.setDiscusion(this.announcement).subscribe(data => {
      this.getAnnouncementCourse();
      this.loadingbtn = false;
      this.messageSuccess = 'Se agregó el aviso exitosamente';
    });
  }

  /*

  */
  public getAnnouncementCourse() {

    this.tutorservice.getAnnouncementCourse(this.courseid, this.groupid).subscribe(data => {
      this.announcements = data.message;
    });
  }

  /*
  metodo para mostrar el modal de la cancelación de la solicitud
  */
  public showModal(content: any) {
    this.closemodal = this.modalService.open(content);
  }

  public closeModal() {
    this.closemodal.dismiss();
  }

  /*
  Metodo para los temas del foro de discusion
  */
  public getDiscussionCourse() {
    this.tutorservice.getDiscussionCourse(this.courseid, this.groupid).subscribe(data => {
      this.discussions = data.message;
    });
  }

  /*

  */
  public getCommentsCourses() {
    this.tutorservice.getCommentsCourses(this.courseid, this.groupid).subscribe(data => {
      this.comments = data.message;
    });
  }

  /*

  */
  public getReplysCourses() {

    this.tutorservice.getReplysCourses(this.courseid, this.groupid).subscribe(data => {
      this.replys = data.message;
    });
  }

  /*
  funcion para agregar una nueva discusion en FAQ
  */
  shownewDoubt(content: any) {
    this.closemodal = this.modalService.open(content);
  }

  /*
  Funcion que muestra el modal para agregar un comentario
  */
  public showComment(content: any, idroot: any, userId: any, doubTitle: any, block?: any) {
    this.closemodal = this.modalService.open(content);
    this.rootcomment = idroot;
    this.replytocomment = idroot;
    this.userid = userId;
    this.titleDoubt = doubTitle;
    this.blockcomment = block;
  }

  /*
  Funcion que muestra el modal para agregar un comentario
  */
  public showReply(content: any, id: any, root: any, userId: any, commentTitle: string, block?: any) {
    this.closemodal = this.modalService.open(content);
    this.replytoreply = id;
    this.rootreply = root;
    this.commentidreply = id;
    this.userid = userId;
    this.titleComment = commentTitle;
    this.blockreply = block;
  }

  /*
  Metodo para agregar las dudas y comentarios
  */
  setDoubt(title: any, descr: any) {
    this.doubt = new Doubt(this.courseid, this.groupid, 'root', title, descr, 'discussion');
    this.tutorservice.setDiscusion(this.doubt).subscribe(data => {
      this.tutorservice.getDiscussionCourse(this.courseid, this.groupid).subscribe(res => {
        this.discussions = res.message;
      });
    });
    this.closeModal();
  }

  /*
  Metodo para agregar un comentario a una discusion del tema
  */
  setComment(descr: any) {
    if (this.blockcomment) {
      this.comment = new Comment(this.courseid, this.groupid, 'comment', this.rootcomment, this.replytocomment, descr, this.blockcomment);
    } else {
      this.comment = new Comment(this.courseid, this.groupid, 'comment', this.rootcomment, this.replytocomment, descr);
    }
    this.tutorservice.setDiscusion(this.comment).subscribe(data => {

    });
    this.courseService.setDiscusion(this.comment).subscribe(data => {
      const message = 'Agrego un comentario sobre tu duda: ' + this.titleDoubt;
      this.setNotificationComment(this.userid, message, this.rootcomment);
      this.tutorservice.getCommentsCourses(this.courseid, this.groupid).subscribe( tres => {
      });
      this.courseService.getCommentsCourses(this.courseid, this.groupid).subscribe( res => {
        this.comments = res.message;
      });
    });
    this.closeModal();
  }

  /*
  Metodo para agregar una respuesta de un comentario
  */
  setReply(text: any) {
    if (this.blockreply) {
// tslint:disable-next-line: max-line-length
      this.reply = new Reply(this.courseid, this.groupid, 'reply', this.rootreply, this.commentidreply, this.replytoreply, text, this.blockreply);
    } else {
      this.reply = new Reply(this.courseid, this.groupid, 'reply', this.rootreply, this.commentidreply, this.replytoreply, text);
    }
    this.courseService.setReplytto(this.reply).subscribe(data => {
      const message = 'Respondio a tu comentario: ' + this.titleComment;
      this.setNotificationComment(this.userid, message, this.commentidreply);
      this.tutorservice.getReplysCourses(this.courseid, this.groupid).subscribe( rest => {
        this.replys = rest.message;
      });
      this.courseService.getReplysCourses(this.courseid, this.groupid).subscribe( resc => {
        this.replys = resc.message;
      });
    });
    this.closeModal();
  }

  /*
  Metodo para agregar las notificaciones de comentarios
  */
  setNotificationComment(destination: any, message: string, rootcomment: any) {

    this.objectCourse = new Objects ('courses', this.courseid);
    this.objects.push(this.objectCourse);

    this.objectGroup = new Objects('groups', this.groupid);
    this.objects.push(this.objectGroup);

    this.objectComment = new Objects('discussions', rootcomment);
    this.objects.push(this.objectComment);

    this.notification = new Notification(destination, message, 'user', this.objects);

    this.tutorservice.setNotification(this.notification).subscribe( data => {
    });

    this.user.setNotification(this.notification).subscribe( data => {
      //console.log(data);
    });
  }

  /*
  metodo para la notificación del follow
  */
  setFollow(discussionId: any) {
    this.follow = new Follows(discussionId, 'discussions');
    this.tutorservice.setFollow(this.follow).subscribe( data => {
      this.getDiscussionCourse();
    });
    this.user.setFollow(this.follow).subscribe( data => {
      this.getDiscussionCourse();
    });
  }

  /*

  */
  deleteFollow(followid: any) {
    this.followid = new FollowId(followid);
    this.tutorservice.quitFollow(this.followid).subscribe(data => {
      this.getDiscussionCourse();
    });
    this.user.quitFollow(this.followid).subscribe(data => {
      this.getDiscussionCourse();
    });
  }

  /*
  Metodo de validacion de fechas
  */
  public setevent(label: any, type: any, begindate: any, enddate: any) {
    this.messageErrorevent = null;
    this.messageSuccesevent = null;
    this.beginDate = new Date(begindate);
    this.endDate = new Date(enddate);
    const begin = this.beginDate.setDate(this.beginDate.getDate() + 1);
    const end = this.endDate.setDate(this.endDate.getDate() + 1);
    if (label !== '' || type !== '' || enddate !== '' || begindate !== '') {
      const eventsupd = {
        beginDate: this.datePipe.transform(begin, 'yyyy-MM-dd 00:00:01'),
        endDate: this.datePipe.transform(end, 'yyyy-MM-dd 23:59:59'),
        label,
        type
      };
      this.dataActivities.push(eventsupd);
      const jsonupd = {
        groupid: this.groupid,
// tslint:disable-next-line: indent
	      dates: this.dataActivities
      };
      this.tutorservice.updateEventsTutor(JSON.stringify(jsonupd)).subscribe(data => {
        this.dataTask.push({
          title: label,
          start: this.datePipe.transform(begin, 'yyyy-MM-dd 00:00:01'),
          end: this.datePipe.transform(end, 'yyyy-MM-dd 23:59:59'),
          color: this.colorevents(type),
          type
        });
        this.closeModal();
      });
      this.messageErrorevent = null;
    } else {
      this.messageErrorevent = 'Todos los campos son obligatorios';
    }
  }

  approvedConst() {
// tslint:disable-next-line: prefer-const
    let temproster: any = [];
    temproster.push(this.rosteridl);
    const rosteraproval = {
      rosters: temproster
    };
    this.tutorservice.approvalconst(rosteraproval).subscribe(data => {
      this.messageSuccessConst = 'Se liberó la constancia de ' + this.namel + ' ' + this.fatherNamel + ' ' + this.motherNamel + '  exitosamente.';
      this.closeModal();
    });
  }
}
