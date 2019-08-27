import { Component, OnInit } from '@angular/core';
import { UserService } from './../sharedservices/user.service';
import { ServiceisorgService } from './../sharedservices/serviceisorg.service';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  providers:[ UserService, ServiceisorgService ]
})
export class ResetpasswordComponent implements OnInit {

  identity;
  rolOrg;
  messageError: string;
  messageSuccess: string;
  csvContent:string[]=[];
  csvResult:string[]=[];

  constructor(private user:UserService, private serviceorg:ServiceisorgService) {

  }

  ngOnInit() {
    this.identity = this.user.getidentity();
    this.user.getRoles().subscribe(data=>{
      console.log(data);
      //this.rolOrg = data.message.isOrg;
    },error=>{
      console.log(error);
    });
    this.csvResult = [];
  }

  /*
  Metodo para subir el formato de excel con los correos
  */
  public loadFile(files:FileList){
    /*
    if(files && files.length > 0) {
    this.messageSuccess = "Se cargo correctamente el archivo";
    let file : File = files.item(0);
      let reader: FileReader = new FileReader();
      reader.readAsText(file);
      reader.onload = (e) => {
        let csv: string = reader.result;
        //csv.split("\n");
        let csvn = csv.split('\n');
        this.csvContent = csvn;
      }
    }
    */
  }

  public testParser(){
    let indice = 0;
    this.csvResult = [];
    for(let id of this.csvContent){
      if(indice!=0){
        this.serviceorg.resetpassisorg(id).subscribe(data=>{
          console.log(data);
          //if(data.message == "User not found"){
            //this.csvResult.push(id+": Usuario no encontrado")
          //}else{
            //this.csvResult.push(id+": Se actualizó la contraseña correctamente");
          //}
        },error=>{
          console.log(error);
        });
      }
      indice++
    }
    console.log(this.csvResult);
  }


  /*
  Reseteo de contraseña de usuario
  */
  public resetpass(emailuser){
    this.serviceorg.resetpassisorg(emailuser).subscribe(data=>{
      console.log(data);
      /*
      if(data.message == "User not found"){
        this.messageError = "Usuario no encontrado";
        this.messageSuccess = null;
      }else{
        this.messageSuccess = "Se actualizó la contraseña correctamente";
        this.messageError = null;
      }
      */
    },error=>{
      console.log(error);
    });
  }

}
