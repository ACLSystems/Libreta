import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { CourseService } from './../../shared/sharedservices/course.service';
import { Doubt } from './../../models/temp/doubt';
import { GradeTask } from './../models/course';
import { Notification } from './../../user/models/notification';
import { Objects } from './../../user/models/Objects';
import { ServiceisorgService } from './../../shared/sharedservices/serviceisorg.service';
import { TaskGrade } from './../../models/course/taskgrade';
import { UserService } from './../../shared/sharedservices/user.service';
import { HttpResponse,  HttpEventType } from '@angular/common/http';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-tasksview',
  templateUrl: './tasksview.component.html',
  providers: [UserService, ServiceisorgService, CourseService]
})
export class TasksviewComponent implements OnInit {

  tasksStudents: any;
  loading = false;
  isGradeOk = true;

  groupCode: any;

  courseid: any;
  groupid: string;
  studentid: string;
  blockid: any;
  roosterid: any;
  messageTasks: any[] = [];

  taskGrade: TaskGrade;
  gradeTask: GradeTask [] = [];
  tasks: any[] = [];
  comment: Doubt;
  notification: Notification;

  objectCourse: Objects;
  objectGroup: Objects;
  objectTutor: Objects;
  objects: Objects[] = [];
  file: object;
	fileDetails: {
		name: string
		originalName: string
		size: number
		url: string
		sizeH: string
		mimetype: string
		fileid: string
	};
	currentFileDownload: boolean;
	progress: {
		percentage: number,
		status: string,
		statusAlert: string,
		icon: string
	} = {
		percentage: 0,
		status: 'Descargando...',
		statusAlert: 'alert-info',
		icon: 'fas fa-info-circle'
	};

// tslint:disable-next-line: variable-name
  constructor(private _router: Router,
// tslint:disable-next-line: variable-name
              private _activeRouter: ActivatedRoute,
// tslint:disable-next-line: variable-name
              private _user: UserService,
              private serviceisorg: ServiceisorgService,
              private courseservice: CourseService) {
              this._activeRouter.params.subscribe(params => {
      if (params.groupCode != null) {
        this.groupCode = params.groupCode;
      }
      if (params.courseid != null) {
        this.courseid = params.courseid;
      }
      if (params.groupid != null) {
        this.groupid = params.groupid;
      }
      if (params.studentid != null) {
        this.studentid = params.studentid;
      }
      if (params.blockid != null) {
        this.blockid = params.blockid;
      }
    });
  }

  ngOnInit() {
    this.getTask();
  }

  /*
  metodo para obtener las tareas
  */
  public getTask() {
    this.loading = true;
    this.serviceisorg.getTask(this.groupid, this.studentid, this.blockid).subscribe(data => {
      this.tasksStudents = data.message;
      for (const id of this.tasksStudents.tasks) {
        if (id.type === 'file') {
					if(id.content){
          	this.downloadTask(id.content);
					} else {
						this.fileDetails = {
							name: '',
							originalName: 'No hay archivo',
							size: 0,
							url: '',
							sizeH: '0.0B',
							mimetype: '',
							fileid: ''
					}
					}
        }
      }
      this.loading = false;
    });
  }
  /*
  metodo para guardar las calificaciones que captura el tutor
  */
  setGrade(id: any, grade: number, label: any, indexTask: any) {
    if (grade <= 100) {
      this.isGradeOk = true;
      this.taskGrade = new TaskGrade(this.tasksStudents.rosterid, this.blockid, id, grade, indexTask);
      if (this.gradeTask.length > 0 && this.tasks.length > 0) {
        if (this.gradeTask.find(task => task.id === id) && this.tasks.find(idtask => idtask.taskid === this.taskGrade.taskid )) {
          const indexRpt = this.gradeTask.indexOf(this.gradeTask.find(task => task.id === id));
          const indexRpttask = this.tasks.indexOf(this.tasks.find(idtask => idtask.taskid === this.taskGrade.taskid));
          this.gradeTask.splice(indexRpt, 1);
          this.tasks.splice(indexRpttask, 1);
          this.gradeTask.push({id, grade, label, indexTask});
          this.tasks.push(this.taskGrade);
        } else {
          this.gradeTask.push({id, grade, label, indexTask});
          this.tasks.push(this.taskGrade);
        }
      } else {
        this.gradeTask.push({id, grade, label, indexTask});
        this.tasks.push(this.taskGrade);
      }
    } else {
      this.isGradeOk = false;
    }
  }
  /*
  metodo para enviar las calificaciones al api
  */
  sendGrades(comment?: string) {
    this.objects = [];
    this.serviceisorg.setgradeTaskconcatMap(this.tasks).subscribe(data => {
      const message = 'Se guardó la calificación correctamente';
      this.messageTasks.push({Mensaje: message, id: data.taskid});
    }, error => {
      const er = error;
      this.messageTasks.push({Mensaje: error});
    });

    if (comment) {
      this.comment = new Doubt(this.courseid, this.groupid, 'root', 'Mensaje del tutor', comment, 'tutor', this.blockid, this.studentid);
      this.courseservice.setDiscusion(this.comment).subscribe(data => {
        this.objectCourse = new Objects('courses', this.courseid);
        this.objects.push(this.objectCourse);
        this.objectGroup = new Objects('groups', this.groupid);
        this.objects.push(this.objectGroup);
        this.objectTutor = new Objects('blocks', this.blockid);
        this.objects.push(this.objectTutor);
        const message = 'Calificó tu tarea y agregó un comentario';
        this.notification = new Notification(this.studentid, message, 'user', this.objects, 'instructor');
        this._user.setNotification(this.notification);
      });
    } else {
      const message = 'Calificó tu tarea';
      this.objectCourse = new Objects('courses', this.courseid);
      this.objects.push(this.objectCourse);
      this.objectGroup = new Objects('groups', this.groupid);
      this.objects.push(this.objectGroup);
      this.objectTutor = new Objects('blocks', this.blockid);
      this.objects.push(this.objectTutor);
      this.notification = new Notification(this.studentid, message, 'user', this.objects, 'instructor');
      this._user.setNotification(this.notification);
    }
  }

  /*

  */
  // downloadTask(idTask: any) {
  //   this.serviceisorg.downloadFile(idTask).subscribe(
  //     (res) => {
  //       this.file = res.file.url;
  //     });
  // }

	downloadTask(idTask: string) {
		this.serviceisorg.downloadFileDetails(idTask).subscribe((res:any) => {
			this.fileDetails = res.file;
			this.fileDetails.fileid = idTask;
			let e = Math.floor(Math.log(this.fileDetails.size) / Math.log(1024));
			this.fileDetails.sizeH = (this.fileDetails.size/Math.pow(1024, e)).toFixed(2)+' '+ ' KMGTP'.charAt(e)+'B';
		});
	}

	getFile(id: string) {
		this.serviceisorg.downloadFile(id).subscribe(event => {
			if(event.type === HttpEventType.Sent) {
				this.currentFileDownload = true;
				this.progress.status = 'Preparando archivo...';
				this.progress.statusAlert = 'alert-info';
				this.progress.icon = 'fas fa-info-circle';
			} else if(event.type === HttpEventType.DownloadProgress) {
				this.progress.percentage = Math.round(100 * event.loaded / event.total);
				if(this.progress.percentage === 100) {
					this.progress.status = 'Procesando, espera...';
					this.progress.statusAlert = 'alert-info';
					this.progress.icon = 'fas fa-info-circle';
				}
			} else if(event instanceof HttpResponse) {
				let status = event.status;
				if(status === 200){
					this.progress.status = 'Archivo '+ this.fileDetails.originalName +' descargado';
					this.progress.statusAlert = 'alert-success';
					this.progress.icon = 'fas fa-check';
					const blob = new Blob([event.body], { type: this.fileDetails.mimetype });
					let fileDetails = this.fileDetails;
					let fileName = fileDetails.originalName;
					saveAs(blob, fileName);
				} else if(status > 399 || status < 500) {
					this.progress.status = 'Archivo no localizado';
					this.progress.statusAlert = 'alert-warning';
					this.progress.icon = 'fas fa-exclamation-triangle';
				} else if(status > 499) {
					this.progress.status = 'Error en la descarga';
					this.progress.statusAlert = 'alert-danger';
					this.progress.icon = 'fas fa-exclamation-triangle';
				}
			}
		}, error => {
			this.progress.status = 'Error en la descarga';
			this.progress.statusAlert = 'alert-danger';
			this.progress.icon = 'fas fa-exclamation-triangle';
			console.log(error);
		});
	}

  /*
  metodo para regresar a la vista de tareas del tutor
  */
  returnTaskReview() {
    this._router.navigate(['/taskreview', this.groupCode]);
  }
}
