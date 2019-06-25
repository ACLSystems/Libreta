import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from './../../shared/sharedservices/user.service';
import { ServiceisorgService } from './../../shared/sharedservices/serviceisorg.service';

import { NewCourse } from './../../models/course/newCourse';
@Component({
  selector: 'app-newcourse',
  templateUrl: './newcourse.component.html',
  providers:[UserService, ServiceisorgService]
})
export class NewcourseComponent implements OnInit {
  identiti;
  newcourse:NewCourse;
  categories:string[]=[];
  keywords:string[]=[];
  messageSuccess:any;
  messageError:any;
  messageSuccessKW:any;
  messageErrorKW:any;
  messageSuccessNC:any;

  constructor(private user:UserService, private serviceorg:ServiceisorgService, private router:Router) {
    this.identiti = this.user.getIdentiti();
    this.newcourse = new NewCourse('','','',null,false,null,'','','','','',0,'','');
  }

  ngOnInit() {
  }

  /*
  guarda el nuevo curso
  */
  saveNewCourse(code,title,type,categories,isVisible,keywords,description,details,price,cost,status,duration,durationUnits,image){
    let clave = code.toUpperCase();
    this.newcourse = new NewCourse(clave,title,type,this.categories,isVisible,this.keywords,description,details,price,cost,status,duration,durationUnits,image);
    this.serviceorg.setNewCourse(this.newcourse).subscribe(data=>{
      this.messageSuccessNC = "Se genero el curso con clave: "+clave;
      this.categories=[];
      this.keywords=[];
    },error=>{
      console.log(error);
    });
    this.newcourse = new NewCourse('','','',null,false,null,'','','','','',0,'','');
  }

  /*
  agrega una categoria al arreglo
  */
  addCat(categoria){
    if(this.categories.length > 0){
      if(this.categories.find(id => id == categoria)){
        this.messageError = "Esta categoria ya esta agregada";
      }else{
        this.categories.push(categoria);
        this.messageSuccess = "Se agrego la categoría: "+categoria
      }
    }else{
      this.categories.push(categoria);
      this.messageSuccess = "Se agrego la categoría: "+categoria
    }
  }

  /*
  agrega una keywords al arreglo
  */
  addKw(keyword){
    if(this.keywords.length >0){
      if(this.keywords.find(id => id == keyword)){
        this.messageErrorKW = "Esta palabra clave ya esta agregada";
      }else{
        this.keywords.push(keyword);
        this.messageSuccessKW = "Se agrego la palabra clave: "+keyword
      }
    }else{
      this.keywords.push(keyword);
      this.messageSuccessKW = "Se agrego la palabra clave: "+keyword
    }
  }
  /*
  regreso a la vista del edit mananger
  */
  returnManagerEdit(){
    this.router.navigate(['/editor/editmanager']);
  }
}
