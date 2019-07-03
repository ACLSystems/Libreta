import { Component, OnInit } from '@angular/core';
import { ServiceisorgService } from '../../shared/sharedservices/serviceisorg.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
	providers: [ServiceisorgService]
})
export class UserComponent implements OnInit {

	userAccount:{};
	loading: boolean;
	loadingData: boolean;
	messageError: string;
	isFindOk:boolean;


	constructor(private serviceorg:ServiceisorgService) { }

	ngOnInit() {
		this.loading = false;
		this.messageError = 'Coloca una dirección de correo para iniciar la búsqueda';
	}

	searchUser(wordcode:string){
    this.loadingData = true;
    this.userAccount = {};
		this.messageError = 'Buscando...';
		this.isFindOk = false;
    this.serviceorg.getUserBySupervisor(wordcode).subscribe(data=>{
			let messageNotFound = 'Error: User -'+ wordcode +'- does not exist'
      if(data.message!=messageNotFound){
				this.messageError = 'Usuario ' + wordcode;
        this.userAccount=data;
        this.loadingData = false;
        this.isFindOk = true;
				console.log(data)
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

	setUser() {
		this.loading = true;

	}

}
