import { Component, OnInit } from '@angular/core';
import { Login } from './login';
import { Router } from '@angular/router';
import { UserService } from './../sharedservices/user.service';

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
  identiti: any;
  show = false;

  constructor(private userService: UserService, private router: Router) {
    this.login = new Login('', '');
  }

  ngOnInit() {
    this.token = this.userService.getToken();
    this.identiti = this.userService.getIdentiti();
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
    this.userService.singUp(this.login).subscribe(data => {
      this.token = data.token;
      localStorage.setItem('token', this.token);
      this.userService.getUser(this.login.username).subscribe( resdata => {
        const identiti = resdata;
        localStorage.setItem('identiti', JSON.stringify(identiti));
        this.router.navigate(['/consoleuser']);
        this.loading = false;
      }, error => {
        this.messageErrorAPI = 'Ocurrió un erro interno de sistema, favor de reportarlo a la mesa de ayuda: ' + error.status;
        this.loading = false;
      });
    }, error => {
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
}
