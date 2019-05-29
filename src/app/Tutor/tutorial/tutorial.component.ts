import { Component, OnInit } from '@angular/core';
import { CourseModel } from './../models/course';
import { Router } from '@angular/router';
import { ServiceisorgService } from './../../shared/sharedservices/serviceisorg.service';

@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.component.html',
  providers:[ServiceisorgService]
})
export class TutorialComponent implements OnInit {

  loading:boolean = false;
  public mygrouplist:any[]=[];
  public courseTitle:CourseModel[]=[];

  constructor(public serviceorg:ServiceisorgService, private router:Router) { }

  ngOnInit() {
    this.getList();
  }

  /*
  Metodo para obtener la lista de los grupos asignados
  */
  public getList(){
    this.loading = true;
    this.courseTitle = [];
    this.serviceorg.mylistgroup().subscribe(data=>{
      this.mygrouplist = data.message;
      for(let id of this.mygrouplist){
        this.filterCourses(id.courseTitle);
      }
      this.loading = false;
    },error=>{
      console.log(error);
      this.loading = false;
    });
  }

  /*
  Metodo para filtrar los cursos
  */
  filterCourses(coursetitle){
    if(this.courseTitle.length > 0){
      if(!this.courseTitle.includes(coursetitle)){
        this.courseTitle.push(coursetitle);
      }
    }else{
      this.courseTitle.push(coursetitle);
    }
  }

  /*
  Metodo para ir al listado de alumnos del grupo
  */
  public getTasksReview(groupCode){
    this.router.navigate(['/taskreview',groupCode]);
  }
}
