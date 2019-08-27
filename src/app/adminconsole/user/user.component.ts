import { Component, OnInit } from '@angular/core';
import { ServiceisorgService } from '../../shared/sharedservices/serviceisorg.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
	providers: [ServiceisorgService]
})
export class UserComponent implements OnInit {

	userAccount:{};
	loading: boolean;
	loadingData: boolean;
	messageError: string;
	isFindOk:boolean;

	constructor(private serviceorg:ServiceisorgService) {}

	ngOnInit() {
		this.loading = false;
		this.messageError = 'Coloca una dirección de correo para iniciar la búsqueda';
	}

	searchUser(wordcode:string){
    this.loadingData = true;
    // this.userAccount = {};
		this.messageError = 'Buscando...';
		this.isFindOk = false;
    this.serviceorg.getUserBySupervisor(wordcode).subscribe(data=>{
			let messageNotFound = 'Error: User -'+ wordcode +'- does not exist'
      if(data.message!=messageNotFound){
				this.messageError = 'Usuario ' + wordcode;
				let temp = data.person;
				temp.email = wordcode;
        this.userAccount=temp;
        this.loadingData = false;
        this.isFindOk = true;
      } else {
        this.messageError = "El usuario ingresado no existe en plataforma"
        this.loadingData = false;
        this.isFindOk = false;
      }
    },error=>{
      console.log(error);
      this.isFindOk = false;
      this.loadingData = false;
    });
  }

	setUser(username:string, name:string,fatherName:string,motherName:string) {
		this.loading = true;
		let user = {
			name: username,
			person: {
				name: name,
				fatherName: fatherName,
				motherName: motherName
			}
		};
		this.userAccount = user.person;
		this.serviceorg.updateuserBySupervisor(user).subscribe(data =>{
			if(data && data.message) {
				window.alert('Usuario ' + username + ' fue modificado');
				this.loading = false;
			} else {
				window.alert('Hubo un error');
				console.log(data);
				this.loading = false;
			}
		}, error => {
			console.log(error);
      this.loading = false;
		});
	}

}
