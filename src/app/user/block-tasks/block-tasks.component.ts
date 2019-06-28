import { Component, Input, OnInit } from '@angular/core';
import { CourseService } from './../../shared/sharedservices/course.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Task } from './../../models/temp/task';
import { TaskEntry } from './../../models/course/task';
import { UserService } from './../../shared/sharedservices/user.service';
import { HttpResponse, HttpEventType } from '@angular/common/http';


//declare var $: any ;

@Component({
  selector: 'app-block-tasks',
  templateUrl: './block-tasks.component.html',
  providers: [CourseService, UserService]
})
export class BlockTasksComponent implements OnInit {

  @Input() block: any;

  token: any;

  task: TaskEntry;
  taskStudent: Task [] = [];
  isSendTask = false;
  isAttachmen = false;

  //messageUserSuccess: any;
  //messageUserError: any;
	currentFileUpload: File;
	progress: {
		percentage: number,
		status: string,
		statusAlert: string,
		icon: string
	} = {
		percentage: 0,
		status: 'Cargando...',
		statusAlert: 'alert-info',
		icon: 'fas fa-info-circle'
	};

  closemodal: NgbModalRef;

  constructor(private courseService: CourseService, private userService: UserService,  private modalService: NgbModal) {
    this.token = this.userService.getToken();
  }

  ngOnInit() {
		console.log(this.block.data)
		//console.log(this.block.data.tasks)
  }

  /*
  para usar el api y guardar las tareas
  */

  public sendTask(force: boolean) {
    if (force) {
      this.task = new TaskEntry( this.block.groupid, this.block.data.blockCurrentId, this.taskStudent, force);
    } else {
      this.task = new TaskEntry( this.block.groupid, this.block.data.blockCurrentId, this.taskStudent);
    }
    this.courseService.setTasks(this.task).subscribe(data => {
      this.isSendTask = true;
    }, error => {
      this.isSendTask = false;
    });
    this.task = new TaskEntry('', '', null);
    this.closeDialog();
  }

  /*
  subir archivos de las tareas
  */
  // public uploadFile($event: any, idtask: any, label: number) {
	// 	const maxSize = 1048576;
	// 	this.messageUserSucces = null;
  //   this.messageUserError = null;
  //   this.isAttachmen = false;
	// 	var sizeOf = function (bytes) {
	// 		if(bytes == 0) { return '0.00 B'; }
	// 		var e = Math.floor(Math.log(bytes) / Math.log(1024));
	// 		return (bytes/Math.pow(1024, e)).toFixed(2)+' '+ ' KMGTP'.charAt(e)+'B';
	// 	}
  //   if ($event.target.files.length === 1 && $event.target.files[0].size <= maxSize) {
	// 		// var that = this;
  //     this.courseService.setAttachment(
  //       $event.target.files[0],
  //       this.block.data.courseCode,
  //       this.block.data.groupCode).subscribe(data => {
	//       this.messageUserSucces = 'Se cargo el archivo correctamente';
	// 			console.log(data.body);
	//       this.setTask(data.fileId, 'file', idtask, label);
  //     }, error => {
  //       console.log(error);
  //     });
  //   } else {
  //     this.messageUserError = 'Archivo mide: '+ sizeOf($event.target.files[0].size) +' El archivo no puede ser mayor a ' + sizeOf(maxSize);
  //   }
  // }
	public uploadFile(event: any, idtask: any, label: number) {
		const maxSize = 1048576;
		//this.messageUserSuccess = null;
    //this.messageUserError = null;
    this.isAttachmen = false;
		this.progress.status = 'Cargando...';
		this.progress.statusAlert = 'alert-info';
		this.progress.icon = 'fas fa-info-circle';
		this.currentFileUpload = event.target.files[0];
		var sizeOf = function (bytes:number) {
			if(bytes == 0) { return '0.00 B'; }
			var e = Math.floor(Math.log(bytes) / Math.log(1024));
			return (bytes/Math.pow(1024, e)).toFixed(2)+' '+ ' KMGTP'.charAt(e)+'B';
		}
    if (event.target.files.length === 1 && this.currentFileUpload.size <= maxSize) {
			// var that = this;
			this.progress.percentage = 0;
      this.courseService.setAttachment(
        this.currentFileUpload,
        this.block.data.courseCode,
        this.block.data.groupCode).subscribe(event => {
					if(event.type === HttpEventType.UploadProgress) {
						this.progress.percentage = Math.round(100 * event.loaded / event.total);
						if(this.progress.percentage === 100) {
							this.progress.status = 'Procesando...';
							this.progress.statusAlert = 'alert-info';
							this.progress.icon = 'fas fa-info-circle';
						}
					} else if(event instanceof HttpResponse) {
						this.progress.status = 'Archivo cargado correctamente';
						this.progress.statusAlert = 'alert-success';
						this.progress.icon = 'fas fa-check';
						//this.messageUserSuccess = 'Se cargo el archivo correctamente';
						console.log(event.body.fileId);
						this.setTask(event.body.fileId, 'file', idtask, label);
					}
      }, error => {
				this.progress.status = 'Error en la carga';
				this.progress.statusAlert = 'alert-danger';
				this.progress.icon = 'fas fa-exclamation-triangle';
        console.log(error);
      });
    } else {
			this.progress.status = 'Archivo mide '+ sizeOf(this.currentFileUpload.size) +' y no puede ser mayor a ' + sizeOf(maxSize);
			this.progress.statusAlert = 'alert-warning';
			this.progress.icon = 'fas fa-exclamation-triangle';
      //this.messageUserError = 'Archivo mide: '+ sizeOf(this.currentFileUpload.size) +' El archivo no puede ser mayor a ' + sizeOf(maxSize);
    }
  }


  /*
  Metodo para setear las tareas del usuario
  */
  public setTask(content: any, type: any, idtask: any, label: number) {
    if (this.taskStudent.find(id => id.idtask === idtask) ) {
      const indexRepeat = this.taskStudent.indexOf(this.taskStudent.find(id => id.label === label));
      this.taskStudent.splice(indexRepeat, 1);
      this.taskStudent.push({idtask, content, type, label});
      this.isAttachmen = true;
    } else {
      this.taskStudent.push({idtask, content, type, label});
      this.isAttachmen = true;
    }
		console.log(this.taskStudent)
  }

  /*
  Funcion de modal para validar las respuestas del usuario
  */
  public showAccept(content: any) {
    this.closemodal = this.modalService.open(content, {size: 'lg'});
  }

  /*
  Metodo para cerrar el modal del cuestionario
  */
  closeDialog() {
    this.closemodal.dismiss();
  }
}
