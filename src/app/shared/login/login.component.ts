import { Component, OnInit } from '@angular/core';
import { Login } from './login';
import { Router } from '@angular/router';
import { UserService } from './../sharedservices/user.service';
import * as jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  providers:[UserService]
})
export class LoginComponent implements OnInit {
  emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  type = 'password';
  dataIsOk = false;
  loading = false;
  messageSuccess: string;
  messageErrorUser: any;
  messageErrorAPI: any;
  messageErroremail: string;
  login: Login;
  token: any;
  identity: any;
  show = false;

  constructor(private userService: UserService, private router: Router) {
    this.login = new Login('', '');
  }

  ngOnInit() {
    this.token = this.userService.getToken();
    this.identity = this.userService.getidentity();
  }

  getCredentials(){
    //Se muestra un texto a modo de ejemplo, luego va a ser un icono
    if (this.emailRegex.test(this.login.username)) {
      this.messageErroremail = null;
    } else {
      this.messageErroremail = 'Debes de proporcionar una dirección de correo'
    }
    if (this.login.username !== '' && this.login.password !== '' && this.emailRegex.test(this.login.username)) {
      this.dataIsOk = true;
    } else {
      this.dataIsOk = false;
    }
  }

  getlogin() {
    this.loading = true;
    this.messageErrorUser = null;
    this.messageErrorAPI = null;
    this.userService.signIn(this.login).subscribe(data => {
      this.token = data.token;
      localStorage.setItem('token', this.token);
			let decodedToken = this.getDecodedAccessToken(this.token);
			localStorage.setItem('identity', JSON.stringify({
				admin: decodedToken.admin,
				attachedToWShift: decodedToken.attachedToWShift,
				name: decodedToken.sub,
				org: decodedToken.org.name,
				orgUnit: decodedToken.orgUnit.name,
				orgid: decodedToken.org._id,
				ouid: decodedToken.orgUnit._id,
				person: decodedToken.person,
				preferences: decodedToken.preferences,
				userid: decodedToken.userid
			}));
			this.router.navigate(['/consoleuser']);
      this.loading = false;
      // this.userService.getUser(this.login.username).subscribe( resdata => {
      //   const identity = resdata;
      //   localStorage.setItem('identity', JSON.stringify(identity));
      //   this.router.navigate(['/consoleuser']);
      //   this.loading = false;
      // }, error => {
      //   this.messageErrorAPI = 'Ocurrió un errof interno de sistema, favor de reportarlo a la mesa de ayuda: ' + error.status;
      //   this.loading = false;
      // });
    }, error => {
			console.log('hola')
      if ( error.status > 399 && error.status < 500) {
// tslint:disable-next-line: max-line-length
        this.messageErrorUser = 'Usuario o contraseña invalidos, en caso de que no recuerdes tu contraseña selecciona la opción de Recuperar Contraseña';
      } else {
        this.messageErrorAPI = 'Ocurrió un error interno de sistema, favor de reportarlo a la mesa de ayuda, estatus:' + error.status;
      }
      this.loading = false;
    });
  }

  showPass() {
    this.show = !this.show;
    if (this.show) {
      this.type = 'text';
    } else {
      this.type = 'password';
    }
  }

	getDecodedAccessToken(token: string): any {
		try {
			return jwt_decode(token);
		} catch (err)  {
			return null;
		}
	}
}
