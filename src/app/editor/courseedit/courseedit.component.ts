import { ActivatedRoute, Router } from '@angular/router';
import {
  Block,
  BlockCode,
  BlockMedia,
  BlockStatus,
  BlockTitle,
  BlockVisible,
  BlockWb,
  BlockWq,
  BlockWt
  } from './../../models/temp/block';
import { Component, OnInit } from '@angular/core';
import { ModifyBlock } from './../../models/course/modifyblock';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ServiceisorgService } from './../../shared/sharedservices/serviceisorg.service';
import { UserService } from './../../shared/sharedservices/user.service';



@Component({
  selector: 'app-courseedit',
  templateUrl: './courseedit.component.html',
  providers:[ServiceisorgService, UserService]
})
export class CourseeditComponent implements OnInit {

  blockid;
  courseid;
  identiti;

  block:Block;
  blockcode:BlockCode;
  blockisV:BlockVisible;
  blockStatus:BlockStatus;
  blockTitle:BlockTitle;
  blockMedia:BlockMedia;
  mfBlock:ModifyBlock;
  wb:BlockWb;
  wq:BlockWq;
  wt:BlockWt;

  code:string;
  isVisible:boolean;
  status:any;
  title:any;
  media:any;
  blockw:number;
  blockwq:number;
  blockwt:number;

  editC:boolean = false;
  editQ:boolean = false;
  editT:boolean = false;

  editblockIsVisible:boolean=false;
  editblockCode:boolean=false;
  editbblockStatus:boolean=false;
  editblockTitle:boolean=false;
  editblockMedia:boolean=false;
  editblockWb:boolean=false;
  editblockWq:boolean=false;
  editblockWt:boolean=false;
  contentblock:any []=[];
  textprevView:any;
  textprevViewQuestion:any;
  textprevViewTask:any;

  editorConfig={
    "editable": true,
    "spellcheck": true,
    "height": "0",
    "minHeight": "0",
    "width": "auto",
    "minWidth": "0",
    "translate": "yes",
    "enableToolbar": true,
    "showToolbar": true,
    "placeholder": "",
    "imageEndPoint": "",
    "toolbar": [
        ["bold", "italic", "underline", "strikeThrough", "superscript", "subscript"],
        ["fontName", "fontSize", "color"],
        ["justifyLeft", "justifyCenter", "justifyRight", "justifyFull", "indent", "outdent"],
        ["cut", "copy", "delete", "removeFormat", "undo", "redo"],
        ["paragraph", "blockquote", "removeBlockquote", "horizontalLine", "orderedList", "unorderedList"]
    ]
  };

  public closemodal:NgbModalRef;

  constructor(private router:Router, private activatedRoute:ActivatedRoute, private user:UserService, private serviceorg:ServiceisorgService, private modalService:NgbModal) {
    this.activatedRoute.params.subscribe(params=>{
      if(params['courseid']){
        this.courseid = params['courseid'];
      }
      if(params['blockid']){
        this.blockid = params['blockid'];
      }
    });
  }

  ngOnInit() {
    this.identiti = this.user.getIdentiti();
    this.getBlock();
  }

  /*
  Meotodo para obtener el listado de los cursos
  */
  public getBlock(){
    this.serviceorg.getContent(this.blockid).subscribe(data=>{
    this.contentblock = data.message;
    this.textprevView = data.message.blockContent;
    },error=>{
      console.log(error);
    });

  }

  /*
  mostrar el editor de texto para el componente
  */
  showEditorContent(content){
    this.closemodal = this.modalService.open(content, {size: 'lg'});
  }

  /*
  Cerrar el modal del editor del componente
  */
  closeEditor(){
    this.closemodal.dismiss();
  }

  /*
  metodo para obtener el texto html editado de la tarea
  */
  getTexthtmlTask(textEditTask,id){
    this.textprevViewTask = textEditTask;
  }
  /*
  metodo para obtener el texto html editado
  */
  getTexthtmlQuestion(textEditquestion, id){
    this.textprevViewQuestion = textEditquestion;
  }

  /*
  metodo para obtener el texto html editado
  */
  getTexthtml(texthtml){
    this.textprevView = texthtml;
  }

  /*
  metodo para habilitar el editor del contenido
  */
  editContent(){
    this.editC = true;
  }

  /*
  metodo para guardar los cambios del contenido
  */
  saveContent(blockid:any){
    this.block = new Block(this.textprevView);
    this.mfBlock = new ModifyBlock(blockid,this.block);
    this.serviceorg.updateContent(this.mfBlock).subscribe(data=>{
      this.getBlock();
      this.editC = false;
    },error=>{
      console.log(error);
      this.editC = false;
    });
  }

  /*
  metodo para editar la pregunta
  */
  editQuestion(){
    this.editQ = true;
  }

  /*
  metodo para guardar los cambios en la pregunta
  */
  saveQuestion(){
    this.editQ = false;
  }

  /*
  metodo para editar la tarea
  */
  editTask(){
    this.editT = true;
  }

  /*
  metodo para guardar los cambios en la tarea
  */
  saveTask(){
    this.editT = false;
  }

  /*
  habilitar la edicion del campo isVisible del bloque
  */
  editVisible(){
    this.editblockIsVisible = true;
  }

  /*
  guardar los cambios del campo isVisible del bloque
  */
  saveVisible(blockid){
    this.blockisV = new BlockVisible(this.isVisible);
    this.mfBlock = new ModifyBlock(blockid,this.blockisV);
    this.serviceorg.updateContent(this.mfBlock).subscribe(data=>{
      this.getBlock();
      this.editblockIsVisible = false;
    },error=>{
      console.log(error);
      this.editblockIsVisible = false;
    });
  }

  /*
  habilitar la edición del estatus del bloque
  */
  editStatus(){
    this.editbblockStatus = true;
  }

  /*
  guardar los cambios del estatus del bloque
  */
  saveStatus(blockid){
    this.blockStatus = new BlockStatus(this.status);
    this.mfBlock = new ModifyBlock(blockid,this.blockStatus);
    this.serviceorg.updateContent(this.mfBlock).subscribe(data=>{
      this.getBlock();
      this.editbblockStatus = false;
    },error=>{
      console.log(error);
      this.editbblockStatus = false;
    });
  }

  /*
  editar el titulo del bloque
  */
  editTitle(){
    this.editblockTitle = true;
  }

  /*
  salvar los cambios al titulo del bloque
  */
  saveTitle(blockid){
    this.blockTitle = new BlockTitle(this.title);
    this.mfBlock = new ModifyBlock(blockid,this.blockTitle);
    this.serviceorg.updateContent(this.mfBlock).subscribe(data=>{
      this.getBlock()
      this.editblockTitle = false;
    },error=>{
      this.editblockTitle = false;
    });

  }

  /*
  editar el contenido multimedia del curso
  */
  editMedia(){
    this.editblockMedia = true;
  }

  /*
  salvar los cambios que se le hacen al contenido multimedia
  */
  saveMedia(blockid){
    this.blockMedia = new BlockMedia(this.media);
    this.mfBlock = new ModifyBlock(blockid,this.blockMedia);
    this.serviceorg.updateContent(this.mfBlock).subscribe(data=>{
      this.getBlock();
      this.editblockMedia = false;
      console.log(data);
    },error=>{
      this.editblockMedia = false;
      console.log(error)
    });

  }

  /*
  editar el contenido del ponderador del bloque
  */
  editBlockW(){
    this.editblockWb = true;
  }

  /*
  guardar el porcentaje del bloque
  */
  saveBlockW(blockid){
    this.wb = new BlockWb(this.blockw);
    this.mfBlock = new ModifyBlock(blockid, this.wb);
    this.serviceorg.updateContent(this.mfBlock).subscribe(data=>{
      this.getBlock();
      this.editblockWb = false;
      console.log(data);
    },error=>{
      this.editblockWb = false;
      console.log(error)
    });
  }

  /*
  editar el contenido del ponderador del bloque
  */
  editBlockWQ(){
    this.editblockWq = true;
  }

  /*
  guardar el porcentaje del bloque
  */
  saveBlockWQ(blockid){
    this.wq = new BlockWq(this.blockwq);
    this.mfBlock = new ModifyBlock(blockid, this.wq);
    this.serviceorg.updateContent(this.mfBlock).subscribe(data=>{
      this.getBlock();
      this.editblockWq = false;
      console.log(data);
    },error=>{
      this.editblockWq = false;
      console.log(error)
    });
  }

  /*
  editar el contenido del ponderador del bloque
  */
  editBlockWT(){
    this.editblockWt = true;
  }

  /*
  guardar el porcentaje del bloque
  */
  saveBlockWT(blockid){
    this.wt = new BlockWt(this.blockwt);
    this.mfBlock = new ModifyBlock(blockid, this.wt);
    this.serviceorg.updateContent(this.mfBlock).subscribe(data=>{
      this.getBlock();
      this.editblockWt = false;
      console.log(data);
    },error=>{
      this.editblockWt = false;
      console.log(error)
    });
  }

  /*
  editar el contenido del ponderador del bloque
  */
  editBlockCode(){
    this.editblockCode = true;
  }

  /*
  guardar el porcentaje del bloque
  */
  saveBlockCode(blockid){
    this.blockcode = new BlockCode(this.code.toUpperCase());
    this.mfBlock = new ModifyBlock(blockid, this.blockcode);
    this.serviceorg.updateContent(this.mfBlock).subscribe(data=>{
      this.getBlock();
      this.editblockCode = false;
      console.log(data);
    },error=>{
      this.editblockCode = false;
      console.log(error)
    });
  }

  /*
  Metodo para regresar al temario del curso
  */
  returnCourse(){
    this.router.navigate(['/courselessons',this.courseid]);
  }
}
