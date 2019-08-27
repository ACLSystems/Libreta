import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Login } from '../shared/login/login';
import { RecoverPass } from './../models/temp/recoverpass';
import { UserService } from './../shared/sharedservices/user.service';


@Component({
  selector: 'app-recover',
  templateUrl: './recover.component.html'
})
export class RecoverComponent implements OnInit {

  passwordRecover: RecoverPass;
  login: Login;
  password: any;
  tokentemp: any;
  token: any;
  emailuser: any;
  isPassOk = false;
  type = 'password';
  show = false;

  public messageSuccess: string;
  public messageError: string;

  constructor(private router: Router, private route: ActivatedRoute, private user: UserService) {
    this.route.params.subscribe(params => {
      if (params.tokentemp !== null) {
        this.tokentemp = params.tokentemp;
      }
      if ( params.username !== null) {
        this.emailuser = params.username;
      }
    });
  }

  ngOnInit() {
  }

  /*
  Metodo de validacion para las contraseñas del usuario
  */
  public getPassword(passOne: string, passTwo: string) {
    if (passOne === passTwo) {
      this.password = passOne;
      this.isPassOk = true;
    } else {
      this.isPassOk = false;
    }
  }

  /*
  funcion para hacer el cambio de contraseña desde el landignpage
  */
  public recoverPass() {
    if (this.isPassOk) {
      this.passwordRecover = new RecoverPass(this.emailuser, this.tokentemp, this.password);
      this.user.recoverPass(this.passwordRecover).subscribe( () => {
        this.messageSuccess = 'Se actualizo la contraseña correctamente';
        this.login = new Login(this.emailuser, this.password);
        this.user.signIn(this.login).subscribe( data => {
          this.token = data.token;
          localStorage.setItem('token', this.token);
          this.user.getUser(this.login.username).subscribe( resdata => {
            const identity = resdata;
            localStorage.setItem('identity', JSON.stringify(identity));
            this.router.navigate(['/consoleuser']);
          });
        });
      }, error => {
        this.messageError = error;
      });
    }
  }

  /**
   * Metodo para mostrar las contraseñas al usuario
   */
  showPass() {
    this.show = !this.show;
    if (this.show) {
      this.type = 'text';
    } else {
      this.type = 'password';
    }
  }
}
