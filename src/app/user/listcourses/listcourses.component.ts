import { Component, OnInit, DoCheck } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';

import { UserService } from './../../shared/sharedservices/user.service';

@Component({
  selector: 'app-listcourses',
  templateUrl: './listcourses.component.html',
  providers:[UserService]
})
export class ListcoursesComponent implements OnInit, DoCheck {

  public identiti;
  public token;

  public rolOrg : boolean;
  public rolUser  : boolean;
  public rolSup : boolean;
  public rolAdmin : boolean;
  public rolAutho : boolean;
  public rolInstructor : boolean;

  /*
  Constructor de la clase
  */
  constructor(private _router:Router, private _activeRouter:ActivatedRoute, private _user:UserService) {
    this.identiti = this._user.getIdentiti();
    this.token = this._user.getToken();
  }

  /*
  función de arranque del componente
  */
  ngOnInit() {
    this.identiti = this._user.getIdentiti();
    this._user.getRoles().subscribe(data=>{
      this.rolSup = data.message.isSupervisor;
      this.rolUser = data.message.isUser;
      this.rolAdmin = data.message.isAdmin;
      this.rolAutho = data.message.isAuthor;
      this.rolInstructor = data.message.isInstructor;
      this.rolOrg = data.message.isOrg;
    },error=>{
      console.log(error);
    });
  }

  /*
  función de cambios en el componente
  */
  ngDoCheck(){
    this.identiti = this._user.getIdentiti();
    //this.getReports();
  }
}
