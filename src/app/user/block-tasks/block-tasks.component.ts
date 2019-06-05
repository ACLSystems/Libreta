import { Component, Input, OnInit } from '@angular/core';
import { CourseService } from './../../shared/sharedservices/course.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Task } from './../../models/temp/task';
import { TaskEntry } from './../../models/course/task';
import { UserService } from './../../shared/sharedservices/user.service';


declare var $: any ;

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

  messageUserSucces: any;
  messageUserError: any;

  closemodal: NgbModalRef;

  constructor(private courseService: CourseService, private userService: UserService,  private modalService: NgbModal) {
    this.token = this.userService.getToken();
  }

  ngOnInit() {
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
  public uploadFile($event: any, idtask: any, label: number) {
		const maxSize = 1048576;
		this.messageUserSucces = null;
    this.messageUserError = null;
    this.isAttachmen = false;
		var sizeOf = function (bytes) {
			if(bytes == 0) { return '0.00 B'; }
			var e = Math.floor(Math.log(bytes) / Math.log(1024));
			return (bytes/Math.pow(1024, e)).toFixed(2)+' '+ ' KMGTP'.charAt(e)+'B';
		}
    if ($event.target.files.length === 1 && $event.target.files[0].size <= maxSize) {
			// var that = this;
      this.courseService.setAttachment(
        $event.target.files[0],
        this.block.data.courseCode,
        this.block.data.groupCode).subscribe(data => {
	      this.messageUserSucces = 'Se cargo el archivo correctamente';
	      this.setTask(data.fileId, 'file', idtask, label);
      }, error => {
        console.log(error);
      });
    } else {
      this.messageUserError = 'Archivo mide: '+ sizeOf($event.target.files[0].size) +' El archivo no puede ser mayor a ' + sizeOf(maxSize);
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
