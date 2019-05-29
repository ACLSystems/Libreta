import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { HomeService } from './../homeservices/home.service';
import { Areas } from './../../models/temp/areas';

@Component({
  selector: 'app-cursos',
  templateUrl: './cursos.component.html',
  providers:[ HomeService ]
})
export class CursosComponent implements OnInit {

  public loading:boolean;
  public isFindOk:boolean;
  public org:string;
  public query1:any;
  public ar:Areas;
  public messageNotFound:string;

  public typesdata:any[]=[];
  public carrerasList:any[]=[];
  public areadata:any[]=[];
  public cursoslist//:any[]=[];
  public course:any[]=[];
  public keywords:any[]=[];

  constructor(private homeService:HomeService, private _router:Router) {
    this.org='conalep';
    this.ar = new Areas('');
    this.getAreas();
    this.verGrados();
    this.getCourseList();
  }

  ngOnInit() {

  }

  public getCourseList(){
    this.loading = true;
    this.homeService.getCoursesOrg().subscribe(data =>{
      this.cursoslist = data.body.message.courses;
      this.loading = false;
    },error=>{
      console.log(error.message);
      this.loading = false;
    });
  }
  //
  public getAreas(){
    this.homeService.getAreas(this.org).subscribe(data=>{
      this.areadata = data.body.message.details;
    },error=>{
      console.log(error);
    });
  }
  //
  public verCarrera(){
    this.query1={
      area:this.ar.area
    };
    this.homeService.getCarreras(this.org, this.query1).subscribe(data=>{
      this.carrerasList = data.body.message.results;
    },error=>{
      console.log(error);
    });
  }
  //
  public verGrados(){
    var type = "semester"
    this.query1={
      type:type
    };
    this.homeService.getTerms(this.org,this.query1).subscribe(data=>{
      this.typesdata = data.body.message.results;;
    },error=>{
      console.log(error);
    });
  }

  public verCurso(curso){
    this._router.navigate(['/curso',curso]);
  }

  /*
  metodo de busqueda para los cursos
  */
  findCourse(wordcode:string){
    this.loading = true;
    this.course=[]
    if(wordcode!=''){
      for(let id of this.cursoslist){
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
}
