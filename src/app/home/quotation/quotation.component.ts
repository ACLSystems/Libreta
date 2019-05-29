import { Component, OnInit, DoCheck } from '@angular/core';
import { HomeService } from './../homeservices/home.service';

@Component({
  selector: 'app-quotation',
  templateUrl: './quotation.component.html'
})
export class QuotationComponent implements OnInit, DoCheck {
  states:any[]=[];
  campus:any[]=[];
  courses:any[]=[];
  coursesqoutes:any[]=[];
  course:any[]=[];


  campusdetails:any;
  messageNotFound:string;
  messageCoursOut:any;
  messageCoursOutError:any;

  isFindOk:boolean;
  loading:boolean;
  firstForm:boolean;

  tipo:any;
  sta:any;

  querystates:any = {
    type:"state",
    parent:"conalep"
  }

  constructor(private homeservice:HomeService) { }

  ngOnInit() {
    this.loading = true;
    this.homeservice.getStates("conalep",this.querystates).subscribe(data=>{
      this.states = data.message.ous;
    });

    this.homeservice.getCoursesOrg().subscribe(data=>{
      this.courses = data.body.message.courses;
      this.loading = false;
    })
  }

  ngDoCheck(){
    this.validateFirstForm();
  }

  getType(tipe){
    this.tipo = tipe;
  }

  getCampus(state){
    this.sta = state;
    this.campusdetails=null;
    let querycampus={
      type:'campus',
      parent:this.sta
    };
    this.homeservice.getStates("conalep",querycampus).subscribe(data=>{
      this.campus = data.message.ous;
    });
  }

  showCampus(idCampus){
    this.campusdetails = this.campus.find(campus => campus.id == idCampus);

  }

  /*
  metodo de busqueda para los cursos
  */
  findCourse(wordcode:string){
    this.messageCoursOutError=null;
    this.messageCoursOut=null;
    this.course = [];
    if(wordcode!=''){
      for(let id of this.courses){
        if(id.title.toLowerCase().includes(wordcode.toLowerCase())){
          this.course.push(id);
        }
      }
      if(this.course.length!=0){
        this.loading = false;
        this.isFindOk = true;
      }else{
        this.isFindOk = false;
        this.loading = false;
        this.messageNotFound = "No se encontraron resultados para la busqueda de: "+wordcode
      }
    }else{
      this.isFindOk = false;
      this.loading = false;
      this.messageNotFound = null
    }
  }

  setCourseQuot(course:any){
    this.messageCoursOutError=null;
    this.messageCoursOut=null;
    if(this.coursesqoutes.find(idc=> idc.id == course.id)){
      this.messageCoursOutError = "Ya has agregado este curso a tu lista";
    }else{
      this.coursesqoutes.push(course);
      this.messageCoursOut = "Se agrego el curso: " +course.title +" a tu lista"
    }

  }

  /*
  funcion para validar los campos del formulario
  */
  validateFirstForm(){
    this.firstForm = this.tipo!=null && this.sta!=null && this.campusdetails!=null && this.coursesqoutes.length > 0;
  }

}
