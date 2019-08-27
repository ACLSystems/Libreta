import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ServiceisorgService } from './../../shared/sharedservices/serviceisorg.service';
import { UserService } from './../../shared/sharedservices/user.service';

@Component({
  selector: 'app-courselessons',
  templateUrl: './courselessons.component.html',
  providers:[ServiceisorgService, UserService]
})
export class CourselessonsComponent implements OnInit {

loading:boolean;
courseid;
identity;
listblock:any []=[];

constructor(private router:Router, private activatedRoute:ActivatedRoute, private user:UserService, private serviceorg:ServiceisorgService) {
  this.activatedRoute.params.subscribe(params=>{
    this.courseid = params['id'];
  });
}

ngOnInit() {
  this.identity = this.user.getidentity();
  this.getListBlock();
}

/*
Meotodo para obtener el listado de los cursos
*/
public getListBlock(){
  this.loading = true
  this.serviceorg.getlistBlock(this.courseid).subscribe(data=>{
    this.loading = false
    this.listblock = data.message.blocks;
  },error=>{
    console.log(error);
  });
}

/*
Metodo para mostrar el contenido de la lección que selecciona el autor
*/
public getBlock(id){
  this.router.navigate(['/editor/courseedit',this.courseid,id]);
}

/*
Metodo para regresar a la vista de cursos al autor
*/
public returnCourses(){
  this.router.navigate(['/editor/editcourses']);
}

}
