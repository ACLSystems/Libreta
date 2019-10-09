import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

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
	redirectRecover=false;

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
				//console.log(dataRec);
        //this.messageSuccess = 'Se actualizo la contraseña correctamente';
				Swal.fire({
					text: "Se actualizó la contraseña correctamente",
					confirmButtonText: "Ok"
				}).then((result) => {
					if(result.value) {
						this.router.navigate(['/login']);
					}
				});
        // this.login = new Login(this.emailuser, this.password);
        // this.user.signIn(this.login).subscribe( data => {
        //   this.token = data.token;
        //   localStorage.setItem('token', this.token);
        //   this.user.getUser(this.login.username).subscribe( resdata => {
        //     const identity = resdata;
        //     localStorage.setItem('identity', JSON.stringify(identity));
				//
        //   });
        // });
      }, error => {
				if(error.error && error.error.message && error.error.message == 'Token ID is not valid and we cannot proceed with password recovery. Please try again.') {
					this.messageError = 'Debes comenzar nuevamente el proceso de recuperación de contraseña, ya que esta liga ha expirado.'
					this.redirectRecover = true;
				} else {
					this.messageError = error.error.message;
				}
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

	goRecover() {
		this.router.navigate(['/recoverpassword']);
	}
}
