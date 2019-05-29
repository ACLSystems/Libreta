import { Component, OnInit, OnDestroy, DoCheck } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModule, NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { CourseService } from './../../shared/sharedservices/course.service';
import { UserService } from './../../shared/sharedservices/user.service';


declare var $:any;

@Component({

  selector: 'app-blocks',
  templateUrl: './blocks.component.html',
  providers:[CourseService, UserService]

})
export class BlocksComponent implements OnInit{

  public token;
  public identiti;

  loading:boolean;

  public block:string;
  public groupid:string;
  public courseid:string;
  public blockid:string;
  public newBlock:any;
  public blockprev:any;
  public blocknext:any;

  public blockList:any=[];
  public temary:boolean = false;
  public blockResources:any[]=[];

  message_error:any;

  public closemodal:NgbModalRef;



  constructor(private _router:Router, private _activeRouter:ActivatedRoute, public _course:CourseService, private _user:UserService, private modalService:NgbModal, private domnsanitizer:DomSanitizer) {
    this._activeRouter.params.subscribe( params =>{
      if(params['curso']!=null){
        this.block=params['curso'];
      }
      if(params['groupid']!=null){
        this.groupid=params['groupid'];
      }
      if(params['courseid']!=null){
        this.courseid=params['courseid'];
      }
      if(params['blockid']!=null){
        this.blockid=params['blockid'];
      }
    });
  }

  ngOnInit() {
    this.token = this._user.getToken();
    this.identiti = this._user.getIdentiti();
    this.getBlock(this.blockid,true);
    this.isBlockTrack();
    this.getResources();
  }

  /*
  Metodo para ir al temario del curso
  */
  public goModules(){
    this._router.navigate(['/modules',this.block,this.groupid,this.courseid]);
  }

  /*
  funcion para mostrar el contenido de los recursos
  */
  public showResources(content){
    this.closemodal = this.modalService.open(content, {size: 'lg'});
  }


  /*
  Funcion que muestra el modal del temario
  */
  public showTemary(content){
    this.closemodal = this.modalService.open(content);
    this.temary = true;
  }

  /*
  Metodo para cerrar el modal del cuestionario
  */
  closeDialog(){
    this.closemodal.dismiss();
  }

  /*
  Metodo para ir a un bloque desde el temario
  */
  getBlock(id:string, prev:boolean){
    this.loading = true;
    this.token = this._user.getToken();
    this.identiti = this._user.getIdentiti();
    this._course.getBlock(this.groupid, this.courseid, id, prev).subscribe(data=>{
      if(data.messageUser!=null){
        this.message_error = data.messageUser;
        this.blockprev = null;
        this.blocknext = null;
      }else{
        this.message_error = null;
        this.newBlock = {
          data:data.message,
          groupid:this.groupid,
          courseid:this.courseid
        };
        this.blockprev = this.newBlock.data.blockPrevId;
        this.blocknext = this.newBlock.data.blockNextId;
        this._course.getResources(this.groupid, this.token).subscribe(data=>{
          this.blockResources = data.message;
        },error=>{
          console.log(error);
        });
        this._course.showBlocksTrack(this.groupid, this.token).subscribe(data=>{
            let objr = data.message.blocks;
            this.blockList = objr;
        },error=>{
          console.log(error)
        });
      }
      this.loading=false;
    },error=>{
      console.log(error);
      let message_error = error._body
      if(message_error.includes("messageUser")){
        let beginm = message_error.indexOf('"messageUser":"');
        let endmm = message_error.indexOf('"}');
        let finalmsn = message_error.substring(beginm+15,endmm);
        this.message_error = finalmsn;
      }
    });

    if(this.temary){
      this.closeDialog();
    }
  }

  /*
  Funcion para retornar al curso en seguimiento
  */
  public returnCourse(){
    this._router.navigate(['/mycourses',this.block,this.groupid,this.courseid,this.blockid]);
  }

  /*
  Funcion para imprimir errores en la lectura de cursos
  */
  public catchError(err){
    console.log(err);
  }

  /*

  */
  isBlockTrack(){
    this._course.showBlocksTrack(this.groupid, this.token).subscribe(data=>{
      let objr = data.message.blocks;
      this.blockList = objr;
    },error=>{
      console.log(error)
    });
  }

  /*

  */
  getResources(){
    this._course.getResources(this.groupid, this.token).subscribe(data=>{
      this.blockResources = data.message;
    },error=>{
      console.log(error);
    });
  }
}
