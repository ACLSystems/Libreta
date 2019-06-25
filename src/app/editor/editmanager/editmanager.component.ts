import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from './../../shared/sharedservices/user.service';

@Component({
  selector: 'app-editmanager',
  templateUrl: './editmanager.component.html',
  providers:[UserService]
})
export class EditmanagerComponent implements OnInit {
  identiti;
  constructor(private user:UserService, private _router:Router) {
    this.identiti = this.user.getIdentiti();
  }

  ngOnInit() {
  }

  /*
  metodo para redireccionar a la vista de edicion de cursos
  */
  getEditCourses(){
    this._router.navigate(['/editor/editcourses']);
  }

  /*
  metodo para redireccionar a la vista de edicion de cursos
  */
  getnewCourses(){
    this._router.navigate(['/editor/newcourse']);
  }

  /*
  metodo para redireccionar a la vista de edicion de cursos
  */
  getnewBlocks(){
    this._router.navigate(['/editor/newblock']);
  }

}
