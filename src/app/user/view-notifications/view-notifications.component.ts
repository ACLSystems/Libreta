import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { CourseService } from './../../shared/sharedservices/course.service';
import { UserService } from './../../shared/sharedservices/user.service';

import { Reply } from './../../models/course/reply';
import { Comment } from './../../models/course/comment';
import { Objects } from './../models/Objects';
import { Notification } from './../models/notification';


@Component({
  selector: 'app-view-notifications',
  templateUrl: './view-notifications.component.html',
  providers:[CourseService, UserService]
})
export class ViewNotificationsComponent implements OnInit {

  objectCourse:Objects;
  objectComment:Objects;
  objectReply:Objects;
  objectGroup:Objects;
  objects:Objects[]=[];
  notification:Notification;


  courseid:any;
  groupid:any;
  itemid:any;
  type:any;
  studentid:any;

  discussions:any[]=[];
  comments:any[]=[];
  replys:any[]=[];

  taskBlock:any[]=[];
  taskGrade:any[]=[];

  loading:boolean = false;

  reply:Reply;
  comment:Comment;

  constructor(private courseservice:CourseService, private userservice:UserService, private activatedroute:ActivatedRoute) {
    this.activatedroute.params.subscribe( params =>{
      if(params['courseid']!=null){
        this.courseid = params['courseid'];
      }
      if(params['groupid']!=null){
        this.groupid = params['groupid'];
      }
      if(params['id']!=null){
        this.itemid = params['id'];
      }
      if(params['type']!=null){
        this.type = params['type'];
      }
      if(params['studentid']!=null){
        this.studentid = params['studentid'];
      }
    });

  }
  ngOnInit() {
    this.getView();
  }

  getView(){
    this.loading = true;
    switch(this.type){
      case 'instructor':
        this.courseservice.getBlock(this.groupid, this.courseid, this.itemid).subscribe(data=>{
          this.taskBlock=data.message.tasks;
        },error=>{
          console.log(error);
        });
        this.courseservice.getMyGradesTask(this.groupid, this.itemid).subscribe(data=>{
          this.taskGrade=data.myGrade.task;
          this.loading = false;
        },error=>{
          this.loading = false;
        });
      break;

      case 'user':
        this.courseservice.getDiscussionCourse(this.courseid, this.groupid).subscribe(data=>{
          this.discussions = data.message;
        },error=>{
          console.log(error);
        });
        this.courseservice.getCommentsCourses(this.courseid, this.groupid).subscribe(data=>{
          this.comments = data.message;
        },error=>{
          console.log(error);
        });
        this.courseservice.getReplysCourses(this.courseid, this.groupid).subscribe(data=>{
          this.replys = data.message;
          this.loading = false;
        },error=>{
          console.log(error);
          this.loading = false;
        });
      break;
    }

  }

  /*
  función para enviar una respuesta a un comentario
  */
  setReply(replyComment, discussionId, root, userId, title){
    this.reply = new Reply(this.courseid, this.groupid,'reply',root,discussionId,discussionId,replyComment);
    this.courseservice.setReplytto(this.reply).subscribe(data=>{
      let message ="Respondio a tu comentario: '"+title+"'";
      this.setNotification(userId, message, discussionId);
      this.courseservice.getCommentsCourses(this.courseid, this.groupid).subscribe(data=>{
        this.comments = data.message;
      },error=>{
        console.log(error);
      });
      this.courseservice.getReplysCourses(this.courseid, this.groupid).subscribe(data=>{
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
  setComment(descr, discussionId, root, userId, title){
    this.comment = new Comment(this.courseid, this.groupid,'comment', root, discussionId, descr);
    this.courseservice.setDiscusion(this.comment).subscribe(data=>{
      let message = "Agrego un comentario sobre tu duda: '"+title+"'";
      this.setNotification(userId, descr, root);
      this.courseservice.getDiscussionCourse(this.courseid, this.groupid).subscribe(data=>{
        this.discussions = data.message;
      },error=>{
        console.log(error);
      });
      this.courseservice.getCommentsCourses(this.courseid, this.groupid).subscribe(data=>{
        this.comments = data.message;
      },error=>{
        console.log(error);
      });
    },error=>{
      console.log(error);
    });
  }

  /*
  metodo para crear la notificacion
  */
  setNotification(destination:any, message:string, rootcomment:any){

    this.objectCourse = new Objects ('courses',this.courseid);
    this.objects.push(this.objectCourse);

    this.objectGroup = new Objects('groups',this.groupid);
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
}
