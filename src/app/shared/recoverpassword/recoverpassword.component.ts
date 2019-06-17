import { Component, OnInit } from '@angular/core';
import { SharedService } from './../sharedservices/shared.service';
import { UserService } from './../sharedservices/user.service';

@Component({
  selector: 'app-recoverpassword',
  templateUrl: './recoverpassword.component.html',
  providers: [UserService, SharedService]
})
export class RecoverpasswordComponent implements OnInit {
  messageSuccess: string;
  messageError: string;
  dataIsOk = false;
	pushed = false;
  emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  constructor(private sharedservices: SharedService, private userService: UserService) {

  }

  ngOnInit() {

  }

  /*
  función para validar el correo electronico
  */
  getusername(username: string) {
    if (username !== '' && this.emailRegex.test(username)) {
      this.dataIsOk = true;
    } else {
      this.dataIsOk = false;
    }
  }



  /*
  funcion de envio de correo para la recuperacion de contraseña
  */
  getPassword(username: any) {
    this.userService.getUserDetails(username).subscribe(data => {
      if (data.status >= 400 && data.status <= 500) {
        this.messageError = 'El usuario no existe, favor de validar el correo electronico';
      } else {
        this.sharedservices.recoverPassword(username).subscribe( () => {
          this.messageSuccess = 'Se envió un mensaje a tu correo electrónico con instrucciones para recuperar tu contraseña.';
					this.pushed = true;
        })
      }
    });
  }
}
