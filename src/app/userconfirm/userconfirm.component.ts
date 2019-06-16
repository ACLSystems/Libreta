import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Login } from './../shared/login/login';
import { Confirm } from './../models/confirm/confirm';

import { UserService } from './../shared/sharedservices/user.service';
import { environment } from './../../environments/environment';

declare var $:any;
@Component({
  selector: 'app-userconfirm',
  templateUrl: './userconfirm.component.html',
  styles: []
})
export class UserconfirmComponent implements OnInit {

  public login:Login;
  public confirm:Confirm;

  public isDataOk:boolean = false;
  public isPassOk:boolean = false;

  public name:string;
  public fathername:string;
  public mothername:string;
  public emailuser:any;
  public password:string;
	public validated:boolean;

  public datosOkInfo : boolean =false;

  public messageSuccess:string;
  public messageError:string;
  public urlConalep:any

  public token;

  constructor(private user:UserService, private router:Router, private activeRouter:ActivatedRoute) {
    this.urlConalep = environment.urlconalep;
    this.activeRouter.params.subscribe( params=> {
      if(params['tokentemp']!=null){
        this.token = params['tokentemp'];
      }
      if(params['username']!=null){ //:tokentemp/:username/:name/:fathername/:mothername
        this.emailuser = params['username'];
      }
    });
  }

  ngOnInit() {
    this.getDetails();
  }

  public getDetails(){
    this.user.getUserDetails(this.emailuser).subscribe(
      data=>{
        //console.log(data);
        this.name = data.user.person.name;
        this.fathername = data.user.person.fatherName;
        this.mothername = data.user.person.motherName;
				this.validated = data.validated;
      },
      error=>{
        console.log(error);
      }
    );
  }

  /*
  Metodo de validación de datos personales del usuario
  */
  public getData($event,namecheck:string, fname:string, mname:string){
    if($event.target.checked){
      this.isDataOk = true;
      this.name = namecheck;
      this.fathername = fname;
      this.mothername = mname;
    }
    if(!$event.target.checked){
      this.isDataOk = false;
    }
  }

  /*
  Metodo de validacion para las contraseñas del usuario
  */
  public getPassword(passOne:string, passTwo:string){
    if(passOne==passTwo && this.isDataOk){
      this.password = passOne;
      this.isPassOk = true;
    }else{
      this.isPassOk = false;
    }
  }

  /*
  funcion para la confirmacion de usuario y contraseña
  */
  public sendData(){
    this.confirm = new Confirm(this.emailuser, this.token, this.password, this.name, this.fathername, this.mothername);
    this.user.userConfirm(this.confirm).subscribe(data=>{
      this.messageSuccess = "Se han guardado los datos exitosamente. Usarás tus credenciales para entrar en la siguiente pantalla."
      location.reload(true);
      location.replace(this.urlConalep + '#/login');
    },error=>{
			if(error.message === 'Token is not valid. Please verify') {
				this.messageError = 'Los datos ya fueron validados. Favor de no utilizar esta página para volver a ingresar. Ve directamente a: ' + this.urlConalep;
			}
      console.log(error);
      this.messageError = error;
    });
  }

}
