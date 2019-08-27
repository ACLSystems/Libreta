import * as $ from 'jquery';
import * as jsPDF from 'jspdf';
import { ActivatedRoute, Router } from '@angular/router';
import { CalendarComponent } from 'ng-fullcalendar';
import { Comment } from './../../models/course/comment';
import {
	Component,
  DoCheck,
  OnInit,
  ViewChild
  } from '@angular/core';
import { constancias } from './../models/docsconalep';
import { CourseService } from './../../shared/sharedservices/course.service';
import { DatePipe, DecimalPipe } from '@angular/common';
import { Discussion } from './../../models/course/discussion';
import { Doubt } from './../../models/temp/doubt';
import { FollowId, Follows } from './../models/follow';
import { GeneratedocsService } from './generatedocs.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Notification } from './../models/notification';
import { Objects } from './../models/Objects';
import { Options } from 'fullcalendar';
import { Reply } from './../../models/course/reply';
import { ServiceisorgService } from './../../shared/sharedservices/serviceisorg.service';
import { UserService } from './../../shared/sharedservices/user.service';

@Component({
  selector: 'app-mycourses',
  templateUrl: './mycourses.component.html',
  providers: [CourseService, UserService, ServiceisorgService, DatePipe, DecimalPipe, GeneratedocsService]
})
export class MycoursesComponent implements OnInit, DoCheck {

  public identity: any;
  public token: any;

  calendarOptions: Options;
  @ViewChild(CalendarComponent) ucCalendar: CalendarComponent;


  public data: any;

  public objectCourse: Objects;
  public objectComment: Objects;
  public objectReply: Objects;
  public objectGroup: Objects;
  public objects: Objects [] = [];

  public doubt: Doubt;
  public comment: Comment;
  public reply: Reply;
  public follow: Follows;
  public followid: FollowId;
  public notification: Notification;

  public titleDoubt: string;
  public titleComment: string;
  public descDoubt: string;

  public rootcomment: any;
  public userid: any;
  public replytocomment: any;
  public blockcomment: any;

  public rootreply: any;
  public commentidreply: any;
  public replytoreply: any;
  public blockreply: any;

  public descComment: string;
  public discussion: Discussion;
  public replyEnt: Reply;
  public discussions: any[] = [];
  public comments: any[] = [];
  public replys: any[] = [];
  public grades: number[] = [];
  public announcements: any[] = [];
  public dataevents: any[] = [];

  public imgconalogo: any;
  public groupid: string;
  public courseid: string;
  public blockid: string;
  public curso: string;
  public minGrade: any;
  public minTrack: any;
  public finalGrade: any;
  public pass = false;
  public certificateActive = false;

  public certificateNumber: string;
  public rolUser: boolean;

  public nameStudent: string;
  public date: any;
  public duration: any;
  public durationUnit: any;
  public course: string;

  public block: any [] = [];
  public blockgrades: any[] = [];
  public sections: any [] = [];
  public contcourse: any;
  public idc: string;
  public totalgrades = 0;
  public gradefinal = 0;

  public testn: number;
  public trackPercent: number;
  public trackblock: any;
  public urlResource: string;
  public arrayblocks: any[] = [];
  public contentblock: any;
  public resources: any [] = [];
  public endDate: Date;
  public beginDate: Date;
  public endCourse: boolean;
  public endDateSpa: any;
  public beginDateSpa: any;

  public closemodal: NgbModalRef;

  public autofollow = false;
  loading = false;
	dateCertificate: any;
	approvalCertificate: boolean;
	startCertificateDate: any;

  /*
  constructor de la clase
  */
  constructor(private router: Router,
              private activeRouter: ActivatedRoute,
              private cursosService: CourseService,
              private userService: UserService,
              private modalService: NgbModal,
              public datePipe: DatePipe,
              public serviceorg: ServiceisorgService,
              private generateDocs: GeneratedocsService) {
    this.rolUser = true;
    this.activeRouter.params.subscribe( params => {
      if (params.curso !== null ) {
        this.curso = params.curso;
      }
      if (params.groupid !== null) {
        this.groupid = params.groupid;
      }
      if (params.courseid !== null) {
        this.courseid = params.courseid;
      }
      if (params.blockid !== null) {
        this.blockid =  params.blockid;
      }
    });
  }

  /*
  Metodo init de la clase
  */
  ngOnInit() {
    this.identity = this.userService.getidentity();
    this.token = this.userService.getToken();
    this.informationCourse(this.courseid);
    this.getMyGrades();
    this.getDiscussionCourse();
    this.getCommentsCourses();
    this.getReplysCourses();
    this.getAnnouncementCourse();

    this.cursosService.showBlocksTrack(this.groupid, this.token).subscribe(data => {
      this.block = data.message.blocks;
      for (const idevent of data.message.dates) {
        this.dataevents.push({
          title: idevent.label,
          start: this.datePipe.transform(idevent.beginDate, 'yyyy-MM-dd 00:00:01'),
          end: this.datePipe.transform(idevent.endDate, 'yyyy-MM-dd 23:59:00'),
          color: this.colorevents(idevent.type),
					textColor: this.textColorEvents(idevent.type),
					type: idevent.type
        });
      }

			this.dateCertificate = this.dataevents.find(dateEvent => dateEvent.type === 'certificate');

			if(this.dateCertificate != null) {
				const today = new Date();
				this.startCertificateDate = new Date(this.dateCertificate.start);
				this.approvalCertificate = this.startCertificateDate < today;
				console.log(this.approvalCertificate);
				this.startCertificateDate = this.datePipe.transform(this.startCertificateDate.toDateString(), 'yyyy-MMM-dd');
				console.log(this.startCertificateDate);
			} else {
				this.approvalCertificate = true;
			}


      this.calendarOptions = {
        locale: 'es',
        height: 500,
        editable: true,
        eventLimit: false,
        header: {
          //left: 'month,week,day,list',
					left: 'month,list',
          center: 'title',
          right: 'prev,today,next'
        },
				buttonText: {
					today: 'Hoy',
					month: 'Mes',
					week: 'Semana',
					day: 'Día',
					list: 'Lista'
				},
				noEventsMessage: 'No hay eventos para esta fecha',
				allDayText: 'todo el día',
				displayEventTime: false,
        selectable: true,
        events: this.dataevents
      };
    }, error => {
      console.log(error);
    });

    this.cursosService.getResources(this.groupid, this.token).subscribe(data => {
      this.resources = data.message;
    }, error => {
      console.log(error);
    });
    this.percentTrack();
  }

  ngDoCheck() {
    this.identity = this.userService.getidentity();
    this.token = this.userService.getToken();
  }


  informationCourse(courseid: any) {
    this.cursosService.getCoursesOrg().subscribe(data => {
      const objr = data.message.courses;
      this.contcourse = objr.find(id => id.id === courseid);
    });
  }

  public colorevents(type: string): string {
    let color: any;

    if (type === 'task') {
      color = '#87CEEB';
    }
    if (type === 'exam') {
      color = '#DC143C';
    }
    if (type === 'general') {
      color = '#FAEBD7';
    }
    if (type === 'certificate') {
      color = '#20B2AA';
    }
    return color;
  }

	public textColorEvents(type: string): string {
		let textColor: string = '#000000';
    if (type === 'exam') {
			textColor = '#FFFFFF';
    }
    if (type === 'certificate') {
			textColor = '#FFFFFF';
    }
    return textColor;
	}
  /*

  */
  public getAnnouncementCourse() {
    this.cursosService.getAnnouncementCourse(this.courseid, this.groupid).subscribe(
      data => {
        this.announcements = data.message;
      }
    );
  }

  /*

  */
  public getReplysCourses() {
    this.cursosService.getReplysCourses(this.courseid, this.groupid).subscribe(data => {
      this.replys = data.message;
      }
    );
  }

  /*

  */
  public getCommentsCourses() {
    this.cursosService.getCommentsCourses(this.courseid, this.groupid).subscribe(data => {
      this.comments = data.message;
      }
    );
  }

  /*
  Metodo para los temas del foro de discusion
  */
  public getDiscussionCourse() {
    this.cursosService.getDiscussionCourse(this.courseid, this.groupid).subscribe(data => {
      this.discussions = data.message;
      }
    );
  }

  /*
  metodo para obtener las calificaciones y avance del estudiante
  */
  public getMyGrades() {
    this.loading = true;
    const today = new Date();
    this.cursosService.getMyGrades(this.groupid, this.token).subscribe(data => {
      console.log(data);
      const res = data.message;
      this.data = data.message;
      this.finalGrade = res.finalGrade;
      this.minGrade = res.minGrade;
      this.minTrack = res.minTrack;
      this.blockgrades = res.blocks;
      this.certificateActive = res.certificateActive;

      this.nameStudent = res.name;
      this.date = res.passDate;
      this.duration = res.duration;
      this.durationUnit = res.durationUnits;
      this.course = res.course;
      this.endDate = new Date(res.endDate);
      this.beginDate = new Date(res.beginDate);
      this.endDateSpa = res.endDateSpa;
      this.beginDateSpa = res.beginDateSpa;
      this.certificateNumber = res.certificateNumber;

      if (this.endDate.getTime() < today.getTime()) {
        this.endCourse = false;
      } else {
        this.endCourse = true;
      }

      if (res.pass) {
        this.pass = true;
      } else {
        this.pass = false;
      }

      for (const idgrade of this.blockgrades) {
        this.totalgrades = this.totalgrades + idgrade.blockW;
        const values = (idgrade.grade * idgrade.blockW) / 100;
        this.gradefinal = this.gradefinal + values;
        this.grades.push(values);
      }
      this.loading = false;
    }, () => {
      this.loading = false;
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
  public showReply(content: any, id: any, root: any, userId: any, commentTitle: any, block?: any) {
    this.closemodal = this.modalService.open(content);
    this.replytoreply = id;
    this.rootreply = root;
    this.commentidreply = id;
    this.userid = userId;
    this.titleComment = commentTitle;
    this.blockreply = block;
  }

  /*
  Metodo para imprimir la constancia del curso
  */
  public getCertificated() {
    this.serviceorg.getUserConst(this.groupid);

    if (this.data.finalGrade >= this.data.minGrade) {
      this.generateDocs.printdocumentcredit(
        constancias.constancia_acreditacion,
        this.data.certificateNumber,
        this.data.name,
        this.data.course,
        this.data.finalGrade,
        this.data.duration,
        this.data.durationUnits,
        this.data.passDateSpa,
				null
      );
    } else {
      this.generateDocs.printdocassistance(
        constancias.constancia_participacion,
        this.data.certificateNumber,
        this.data.name,
        this.data.course,
        this.data.duration,
        this.data.durationUnits,
        this.data.passDateSpa,
				null
      );
    }
  }

  /*
  Metodo para ir al curso desde la pestaña de mi progreso actual
  */
  getLesson() {
    this.router.navigate(['/user/block', this.curso, this.groupid, this.courseid, this.blockid]);
  }

  /*
  Metodo para ir a la leccion desde el temario
  */
  getBlock(id: string) {
    this.router.navigate(['/user/block', this.curso, this.groupid, this.courseid, id]);
  }

  /*
  Metodo para calcular el porcentaje de avance del alumno en el curso
  */
  public percentTrack() {
    this.cursosService.getCourses(this.token).subscribe(data => {
      const res = data.message;

      for (const curso of res.groups) {
        if (curso.courseid === this.courseid) {
          this.trackPercent = curso.track;
        }
      }
    }, error => {
      console.log(error);
    });
  }

  /*
  Metodo para hacer el calculo de las lecciones vistas en base al track
  */
  public observable(data: any) {
    this.arrayblocks = data.message.groups;
    for (const crs of this.arrayblocks) {
      const id = crs.groupid;
      if ( id === this.groupid) {
        this.cursosService.showBlocksTrack(id, this.token).subscribe(this.verNumeros.bind(this), this.catchError.bind(this));
      }
    }
  }

  /*

  */
  public verNumeros(data: any) {
    let avT = 0;
    this.testn = data.message.blockNum;
    this.contentblock = data.message.blocks;
    for (const idT of this.contentblock) {
      const nT = idT.track;
      if (nT) {
        avT++;
      }
    }
    const percent = 100 / this.testn;
    this.trackPercent = avT * percent;
  }

  /*
  funcion para cerrar los modals del componente
  */
  closeDialog() {
    this.closemodal.dismiss();
  }

  /*
  Metodo para mostrar los errores en consola
  */
  public catchError(err: any) {
    console.log(err);
  }

  /*
  Metodo para agregar las dudas y comentarios
  */
  setDoubt(title: any, descr: any) {
    this.doubt = new Doubt(this.courseid, this.groupid, 'root', title, descr, 'discussion');
    this.cursosService.setDiscusion(this.doubt).subscribe( () => {
      this.cursosService.getDiscussionCourse(this.courseid, this.groupid).subscribe(data => {
        this.discussions = data.message;
      }, error => {
        console.log(error);
      });
    }, error => {
      console.log(error);
    });
    this.closeDialog();
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
    this.cursosService.setDiscusion(this.comment).subscribe( () => {
      const message = 'Agrego un comentario sobre tu duda: ' + this.titleDoubt;
      this.setNotificationComment(this.userid, message, this.rootcomment);
      this.cursosService.getCommentsCourses(this.courseid, this.groupid).subscribe(data => {
        this.comments = data.message;
      }, error => {
        console.log(error);
      });
    }, error => {
      console.log(error);
    });
    this.closeDialog();
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
    this.cursosService.setReplytto(this.reply).subscribe( () => {
      const message = 'Respondio a tu comentario: ' + this.titleComment;
      this.setNotificationComment(this.userid, message, this.commentidreply);
      this.cursosService.getReplysCourses(this.courseid, this.groupid).subscribe( data => {
        this.replys = data.message;
      }, error => {
        console.log(error);
      });
    }, error => {
      console.log(error);
    });
    this.closeDialog();
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

    this.userService.setNotification(this.notification);
  }

  /*
  metodo para la notificación del follow
  */
  setFollow(discussionId: any) {
    this.follow = new Follows(discussionId, 'discussions');
    this.userService.setFollow(this.follow).subscribe(data => {
      this.getDiscussionCourse();
    }, error => {
      console.log(error);
    });
  }

  /*

  */
  deleteFollow(followid: any) {
    this.followid = new FollowId(followid);
    this.userService.quitFollow(this.followid).subscribe(data => {
      this.getDiscussionCourse();
    }, error => {
      console.log(error);
    });
  }
}
