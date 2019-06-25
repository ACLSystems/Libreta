import { Component, OnInit } from '@angular/core';
import { ServiceisorgService } from './../../shared/sharedservices/serviceisorg.service';
import { UserService } from './../../shared/sharedservices/user.service';
import { NgbModule, NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-searchconsole',
  templateUrl: './searchconsole.component.html',
  providers: [ServiceisorgService, UserService]
})
export class SearchconsoleComponent implements OnInit {

  userAccount:any;
  groupsmanager:any[];
  groupmanager:any[];
  loading:boolean;
  isFindOk:boolean = true;
  isFindGroupOk:boolean;
  initialPassword:boolean;
  passinitialtemp:boolean;
  emailnewOk:boolean;
  messageSuccess:any;
  messageError:any;

  messageSuccessProcess:any;
  messageErrorProcess:any;

  closemodal:NgbModalRef;
  public emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

  identiti;
  username;

  constructor(private serviceorg:ServiceisorgService, private userservice:UserService,private modalService:NgbModal) { }

  ngOnInit() {
    this.identiti = this.userservice.getIdentiti();
    this.getgroups();
  }

  /*
  Metodo para consultar la información del usuario
  */
  searchUser(wordcode){
    this.loading = true;
    this.userAccount = [];
		this.messageError = 'Buscando usuario...';
    this.serviceorg.getUserAccount(wordcode).subscribe(data=>{
      if(data.message!='User not found'){
        if(data.message.groups){
          this.userAccount=data.message;
          this.loading = false;
          this.isFindOk = true;
        }else{
          this.messageError = "El usuario no tiene grupos asignados"
          this.loading = false;
          this.isFindOk = false;
        }
      }else{
        this.messageError = "El usuario ingresado no existe en plataforma"
        this.loading = false;
        this.isFindOk = false;
      }
    },error=>{
      console.log(error);
      this.isFindOk = false;
      this.loading = false;
    });
  }

  /*
  funcion para obtener el listado del grupo del supervisor
  */
  public getgroups(){
    this.groupsmanager = [];
    this.loading = true;
    this.serviceorg.getGroupsManager(this.identiti.ouid).subscribe(data=>{
      if(data.message!='No groups found'){
        this.groupsmanager = data.message
      }
      this.loading = false;
    },error=>{
      console.log(error);
      this.loading = false;
    });
  }

  /*
  metodo para buscar un grupo en especifico
  */
  public findgroup(value){
    this.isFindGroupOk = false;
    this.serviceorg.getlistrostersuper(value).subscribe(
      data=>{
        this.groupmanager = data.message;
        //console.log(this.groupmanager)
        this.isFindGroupOk = true;
      },error=>{
        this.isFindGroupOk = false;
      }
    );
  }

  /*
  metodo para mostrar el modal
  */
  showmodal(content, username, process){
    this.messageErrorProcess = null;
    this.messageSuccessProcess = null;
    this.emailnewOk = false;
    this.username = username;
    if(process=='reset'){
      this.serviceorg.getUserBySupervisor(username).subscribe(data=>{
        if(data.initialPassword == "No initial Password set for user"){
          this.initialPassword = false
          this.closemodal = this.modalService.open(content);
        }else{
          this.initialPassword = true;
          this.closemodal = this.modalService.open(content);
        }
      },error=>{
        console.log(error);
      });
    }else{
      this.closemodal = this.modalService.open(content);
    }
  }

  /*
  metodo para cerrar el modal
  */
  closeModal(){
    this.closemodal.dismiss();
  }

  /*
  metodo de reseteo de contraseña
  */
  public resPass(password?){
    if(password){
      let bodypass={
        "username":this.username,
        "password":password
      }
      this.serviceorg.resetpassBySupervisor(bodypass).subscribe(
        //(data)=>{
				()=>{
          //console.log(data);
          this.messageSuccessProcess = "Se reseteó la contraseña correctamente"
        },error=>{
          console.log(error);
          this.messageErrorProcess = "Ocurrio un erro en la operacióm";
        }
      );
    }else{
      let bodypass={
        "username":this.username
      }
      this.serviceorg.resetpassBySupervisor(bodypass).subscribe(
        //data=>{
				()=>{
          //console.log(data);
          this.messageSuccessProcess = "Se reseteo la contraseña correctamente"
        },error=>{
          console.log(error);
          this.messageErrorProcess = "Ocurrio un erro en la operación";
        }
      );
    }
  }

  /*
  funcion para actualizar el email del nuevo usuario
  */
  updateemail(email){
    this.messageSuccessProcess=null;
    this.messageErrorProcess=null;
    let newuser={
      "username":this.username,
      "newname":email
    }
    this.serviceorg.getUserAccount(email).subscribe(data=>{
      if(data.message=='User not found'){
        this.serviceorg.updateuserBySupervisor(newuser).subscribe(
          data=>{
            this.messageSuccessProcess = "Se actualizó el usuario con exito"
          },error=>{
            this.messageErrorProcess = error;
          }
        );
      }else{
        this.messageErrorProcess="Este usuario ya existe"
      }
    },error=>{
      console.log(error);
    });

  }

  /*
  validar password
  */
  validatePass(value:any){
    this.passinitialtemp = value.length>=3;
  }

  /*
  funcion para vaidar la direccion de correo electronico
  */
  validateEmail(useremail){
    this.emailnewOk = this.emailRegex.test(useremail);
  }
}
