import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ServiceisorgService } from './../../shared/sharedservices/serviceisorg.service';
import { UserService } from './../../shared/sharedservices/user.service';


@Component({
  selector: 'app-editcourses',
  templateUrl: './editcourses.component.html',
  providers:[UserService, ServiceisorgService]
})
export class EditcoursesComponent implements OnInit {
  loading: boolean;
  identiti: any;
  public cursoslist: any[] = [];

  constructor(public serviceorg:ServiceisorgService, private _router:Router, private _activeRouter:ActivatedRoute, private user:UserService) {
    this.identiti = this.user.getIdentiti();
  }

  ngOnInit() {
    this.getCourses();
  }

  /*
  funcion para obtener los cursos y los vea el autor
  */
  public getCourses(){
    this.loading = true;
    this.serviceorg.getCoursesAuth().subscribe(data=>{
      this.cursoslist = data.message.courses;
      this.loading = false;
    },error=>{
      console.log(error);
    });
  }

  /*
  metodo para mostrar el temario del curso que seleccione el autor
  */
  public getCourse(courseid){
    this._router.navigate(['/editor/courselessons',courseid]);
  }

  /*
  Metodo para regresar al administrador de edicion de cursos
  */
  public getEditManager(){
    this._router.navigate(['/editor/editmanager']);
  }

}
