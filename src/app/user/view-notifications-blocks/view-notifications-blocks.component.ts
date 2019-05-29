import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { CourseService } from './../../shared/sharedservices/course.service';
import { Reply } from './../../models/course/reply';
import { Comment } from './../../models/course/comment';

@Component({
  selector: 'app-view-notifications-blocks',
  templateUrl: './view-notifications-blocks.component.html',
  providers:[CourseService]
})
export class ViewNotificationsBlocksComponent implements OnInit {

  blockid:any;
  itemid:any;
  type:any;
  discussions:any[]=[];
  comments:any[]=[];
  replys:any[]=[];

  reply:Reply;
  comment:Comment;

  constructor(private courseservice:CourseService, private activatedroute:ActivatedRoute) {
    this.activatedroute.params.subscribe( params =>{
      if(params['blockid']!=null){
        this.blockid=params['blockid'];
      }
      if(params['id']!=null){
        this.itemid=params['id'];
      }
      if(params['type']!=null){
        this.type=params['type'];
      }
    });
  }

  ngOnInit() {
    this.getView();
  }

  /*
  funcion para obtener los datos del mensaje en al vistade notificación
  */
  getView(){
    this.courseservice.getDiscussion(this.blockid).subscribe(data=>{
      this.discussions = data.message;
    },error=>{
      console.log(error);
    });

    this.courseservice.getCommentsBlock(this.blockid).subscribe(data=>{
      this.comments = data.message;
    },error=>{
      console.log(error);
    });

    this.courseservice.getReplysBlock(this.blockid).subscribe(data=>{
      this.replys = data.message;
    },error=>{
      console.log(error);
    });
  }

  /*
  función para enviar una respuesta a un comentario
  */
  setReply(replyComment, course, group, discussionId, root, userId, text, block){
    this.reply = new Reply(course, group,'reply',root,discussionId,discussionId,replyComment,block);
    this.courseservice.setReplytto(this.reply).subscribe(data=>{
      this.courseservice.getCommentsBlock(this.blockid).subscribe(data=>{
        this.comments = data.message;
      },error=>{
        console.log(error);
      });
      this.courseservice.getReplysBlock(this.blockid).subscribe(data=>{
        this.replys = data.message;
      },error=>{
        console.log(error);
      });
    },error=>{
      console.log(error);
    });
  }

  /*
  funcion para agregar comentarios desde la vista de notificaciones
  */
  setComment(descr, course, group, discussionId, root, userId, text, block){
    this.comment = new Comment(course,group,'comment',root,discussionId,descr,block);
    this.courseservice.setDiscusion(this.comment).subscribe(data=>{
      //let message = "Agrego un comentario sobre tu duda: '"+this.doubTitle+"'";
      //this.setNotification(this.userid, message,this.rootcomment);
      this.courseservice.getCommentsBlock(this.blockid).subscribe(data=>{
        this.comments = data.message;
      },error=>{
        console.log(error);
      });
    },error=>{
      console.log(error);
    });
  }
}
