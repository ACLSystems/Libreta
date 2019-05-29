import { Component, OnInit, Input} from '@angular/core';
import { CourseService } from './../../shared/sharedservices/course.service';
import { UserService } from './../../shared/sharedservices/user.service';
import { NgbModule, NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { Doubt } from './../../models/temp/doubt';
import { Comment} from './../../models/course/comment';
import { Discussion } from './../../models/course/discussion';
import { Reply } from './../../models/course/reply';
import { Notification } from './../models/notification';
import { Objects } from './../models/Objects';


@Component({
  selector: 'app-block-lesson',
  templateUrl: './block-lesson.component.html',
  providers:[CourseService, UserService]
})
export class BlockLessonComponent implements OnInit {

  @Input() block:any;

  objectCourse:Objects;
  objectComment:Objects;
  objectReply:Objects;
  objectGroup:Objects;
  objects:Objects[]=[];

  doubt:Doubt;
  comment:Comment;
  reply:Reply;
  notification:Notification;
  closemodal:NgbModalRef;

  blockDiscussion:any[]=[];
  blockComments:any[]=[];
  blockReplys:any[]=[];

  replytoreply:any;
  rootreply:any;
  commentidreply:any;
  userid:any;
  commentTitle:any;
  rootcomment:any;
  replytocomment:any;
  doubTitle:any;
  blockcomment:any;
  blockreply:any;

  constructor(private course:CourseService, private userservice:UserService, private modalService:NgbModal) {
  }

  ngOnInit() {
    this.getBlock(this.block.data);
  }

  getBlock(data:any){
    this.course.getDiscussion(data.blockCurrentId).subscribe(data=>{
      this.blockDiscussion = data.message;
    },error=>{
      console.log(error);
    });
    this.course.getCommentsBlock(data.blockCurrentId).subscribe(data=>{
      this.blockComments = data.message;
    },error=>{
      console.log(error);
    });
    this.course.getReplysBlock(data.blockCurrentId).subscribe(data=>{
      this.blockReplys = data.message;
    },error=>{
      console.log(error);
    });
  }

  /*
  Metodo para agregar las dudas y comentarios
  */
  setDoubt(title:any, descr:any){
    this.doubt= new Doubt(this.block.courseid,this.block.groupid,'root',title,descr,'discussion',this.block.data.blockCurrentId);
    this.course.setDiscusion(this.doubt).subscribe(data=>{
      this.course.getDiscussion(this.block.data.blockCurrentId).subscribe(data=>{
        this.blockDiscussion = data.message;
      },error=>{
        console.log(error);
      });
    },error=>{
      console.log(error);
    });
    this.closeDialog();
  }

  /*
  Metodo para agregar comentarios a la sección de dudas y comentarios del bloque
  */
  setComment(descr:any){
    this.comment = new Comment(this.block.courseid,this.block.groupid,'comment',this.rootcomment,this.replytocomment,descr,this.block.data.blockCurrentId);
    this.course.setDiscusion(this.comment).subscribe(data=>{
      let message = "Agrego un comentario sobre tu duda: '"+this.doubTitle+"'";
      this.setNotification(this.userid, message,this.rootcomment);
      this.course.getCommentsBlock(this.block.data.blockCurrentId).subscribe(data=>{
        this.blockComments = data.message;
      },error=>{
        console.log(error);
      });
    },error=>{
      console.log(error);
    });
    this.closeDialog();
  }

  /*
  Metodo para agregar las respuestas de los comentarios
  */
  setReply(text:any){
    this.reply = new Reply (this.block.courseid,this.block.groupid,'reply',this.rootreply,this.commentidreply,this.replytoreply,text,this.block.data.blockCurrentId);
    this.course.setReplytto(this.reply).subscribe(data=>{
      let message ="Respondio a tu comentario: '"+this.commentTitle+"'";
      this.setNotification(this.userid, message, this.commentidreply)
      this.course.getReplysBlock(this.block.data.blockCurrentId).subscribe(data=>{
        this.blockReplys = data.message;
      },error=>{
        console.log(error);
      });
    },error=>{
      console.log(error);
    });
    this.closeDialog();
  }

  /*
  metodo para crear la notificacion
  */
  setNotification(destination:any, message:string, rootcomment:any){

    this.objectCourse = new Objects ('courses',this.block.courseid);
    this.objects.push(this.objectCourse);

    this.objectGroup = new Objects('groups',this.block.groupid);
    this.objects.push(this.objectGroup);

    this.objectComment = new Objects('discussions', rootcomment);
    this.objects.push(this.objectComment);

    this.notification = new Notification(destination, message, 'user', this.objects);

    this.userservice.setNotification(this.notification).subscribe(data=>{
      console.log(data);
    }, error=>{
      console.log(error);
    });
  }


  /*
  funcion que muestra el modal de agregar un root de duda o comentario
  */
  public shownewDoubt(content){
    this.closemodal = this.modalService.open(content);
  }

  /*
  Funcion que muestra el modal para agregar un comentario
  */
  public showComment(content, id_root, userId, doubTitle, block){
    this.closemodal = this.modalService.open(content);
    this.rootcomment = id_root;
    this.replytocomment = id_root;
    this.userid = userId;
    this.doubTitle = doubTitle;
    this.blockcomment = block;
  }

  /*
  Funcion que muestra el modal para agregar un comentario
  */
  public showReply(content, id, root, userid, commenttitle, block){
    this.closemodal = this.modalService.open(content);
    this.replytoreply = id;
    this.rootreply = root;
    this.commentidreply = id;
    this.userid = userid;
    this.commentTitle = commenttitle;
    this.blockreply = block;
  }

  /*
  Metodo para cerrar el modal del cuestionario
  */
  closeDialog(){
    this.closemodal.dismiss();
  }
}
