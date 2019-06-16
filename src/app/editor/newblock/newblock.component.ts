import { ActivatedRoute, Router } from '@angular/router';
import {
  Answer,
  Option,
  Question,
  Questionnarie
  } from './../../models/temp/questionnarie';
import { Component, OnInit } from '@angular/core';
import {
  ContentCourse,
  Coursecode,
  NewBlock,
  Questionn
  } from './../../models/course/newBlock';
import {
  ModalDismissReasons,
  NgbModal,
  NgbModalRef,
  NgbModule
  } from '@ng-bootstrap/ng-bootstrap';
import { ServiceisorgService } from './../../shared/sharedservices/serviceisorg.service';
import { UserService } from './../../shared/sharedservices/user.service';



@Component({
  selector: 'app-newblock',
  templateUrl: './newblock.component.html',
  providers:[UserService,ServiceisorgService]
})
export class NewblockComponent implements OnInit {

  identiti;
  messageCode;

  coursecode:Coursecode;
  newblock:NewBlock;
  questionnarie:Questionnarie;
  questions:Question[]=[];
  question:Question;

  options:Option[]=[];
  answers:Answer[]=[];

  option:Option;
  answer:Answer;

  messageSuccess:any;
  messageWarning:any;
  messageErrorOpt:any;
  messageSuccessOpt:any;
  messageErrorAns:any;
  messageSuccessAns:any;
  messageErrorQues:any;
  messageSuccessQues:any;
  codescourse:any[]=[];
  editVisible:string;
  editContentText:string;


  closemodal:NgbModalRef;

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

  constructor(private user:UserService, private router:Router,private serviceorg:ServiceisorgService, private modalService:NgbModal) {
    this.identiti = this.user.getIdentiti();
    this.newblock = new NewBlock('','','','', 0, 0, 0,'',null);
    this.questionnarie = new Questionnarie(null,0,0,null);
    this.question = new Question( [], [],'','',1,'',[],'','');
    this.coursecode = new Coursecode('');
    this.option= new Option('','');
    this.answer= new Answer('',0);
  }

  ngOnInit() {
    this.findCourses();
  }

  /*
  metodo para regresar al edit manager
  */
  returnManagerEdit(){
    this.router.navigate(['/editmanager']);
  }

  /*
  metodo para obtener los codigos de los cursos
  */
  public findCourses(){
    this.codescourse =[];
    this.serviceorg.getCoursesAuth().subscribe(data=>{
      this.codescourse = data.message.courses;
    },error=>{
      console.log(error);
    });
  }

  /*
  agregar seleccion
  */
  addSection(codecourse:string){
    if(codecourse.length>0){
      this.coursecode= new Coursecode(codecourse);
      this.serviceorg.setSection(this.coursecode).subscribe(data=>{
        this.messageSuccess = "Se agrego una nueva sección al curso: "+codecourse
      },error=>{
        console.log(error);
      });
    }else{
      this.messageWarning = "Selecciona primero un curso";
    }
  }
  /*
  metodo para obtener el nombre del curso
  */
  getCourseTitle(){
    this.messageCode = this.codescourse.find(id => id.code == this.newblock.coursecode);
  }

  /*
  Metodo para guardat el bloque
  */
  saveBlock(coursecode,code,title,type){
    this.newblock.code = this.newblock.code.toUpperCase();
    if(type ==='text'){
      this.newblock = new NewBlock(this.newblock.coursecode, this.newblock.code, this.newblock.title, this.newblock.type,0,0,0,this.newblock.content);
      //console.log(this.newblock);
      this.serviceorg.setNewBlock(this.newblock).subscribe(data=>{
        //console.log(data);
        this.messageSuccess = "Se agregó correctamente el bloque: "+code.toUpperCase();
      },error=>{
        console.log(error)
      });
    }else if(this.newblock.type =='questionnarie'){
      this.newblock.code = this.newblock.code.toUpperCase();
      this.questionnarie = new Questionnarie(false, this.questionnarie.maxAttemps, this.questionnarie.minimum, this.questions);
      this.newblock.questionnarie = this.questionnarie;
      this.newblock = new NewBlock(this.newblock.coursecode, this.newblock.code, this.newblock.title, this.newblock.type,1,1,0,"", this.newblock.questionnarie)
      this.serviceorg.setNewBlock(this.newblock).subscribe(data=>{
        this.messageSuccess = "Se agregó correctamente el bloque: "+code.toUpperCase();
      },error=>{
        console.log(error)
      });
    }
    /*
    this.serviceorg.setNewBlock(this.newblock);/*.subscribe(data=>{
      this.messageSuccess = "Se agregó correctamente el bloque: "+code.toUpperCase();
    },error=>{
      console.log(error)
    });
    */
    this.newblock = new NewBlock('','','','',0,0,0,'',null);
  }

  /*
  metodo para mostrar el codigo html del editor
  */
  getTexthtml(){
    this.newblock.content;
  }

  /*
  mostrar el editor de texto para el componente
  */
  showEditorContent(content){
    this.closemodal = this.modalService.open(content, {size: 'lg'});
  }

  /*
  Metodo para agregar la opcion al arreglo de opciones de respuesta
  */
  addOption(name:string, option:string){
    if(option.length<=0 && name.length <=0){
      this.messageErrorOpt = "Ingresa una opción valida";
    }else{
      this.option = new Option(name,option)
      this.options.push(this.option);
      this.messageSuccessOpt = "Se agrego: "+name+" : "+option+" como opción"
    }
  }

  /*
  Agregar la respuesta correcta del cuestionario tipo opciósn
  */
  addAnswer(id:number){
    if(id!=null){
      this.answer = new Answer("index",id);
      if(this.answers.length >0){
        this.answers.splice(0,1,this.answer);
        this.messageSuccessAns = "Se reemplaza la respuesta de la pregunta";
      }else{
        this.answers.push(this.answer);
        this.messageSuccessAns = "Se agrego la respuesta a la pregunta"
      }
    }
  }

  /*
  Guardar pregunta de tipo opcion
  */
  saveQuestionOpt(){
    if(this.answers.length==0 || this.options.length==0 ||this.question.text.length==0 || this.question.type.length==0 || this.question.help.length==0){

      this.messageErrorQues="Los campos marcados con asterisco son obligatorios"

    }else{

      this.question = new Question( this.answers, this.options, this.question.text, this.question.type, 1, this.question.help,[], this.question.header, this.question.footer);
      this.questions.push(this.question);
      this.messageSuccessQues = "Se agregó la pregunta correctamente, puede revisarla con el boton de vista previa"

      this.question = new Question( [], [],'','',1,'',[],'','');
      this.answers=[];
      this.options=[];

    }
  }
  /*
  metodo para cerrar el modal
  */
  closeEditor(){
    this.closemodal.dismiss();
  }
}
