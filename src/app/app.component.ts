import { Component, OnInit } from '@angular/core';
import { ConnectionService } from 'ng-connection-service';
import { Meta } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { UserService } from './shared/sharedservices/user.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers:[UserService]
})
export class AppComponent implements OnInit{
  title = 'libreta';
  status = 'ONLINE'
  isConnect = true;
  identity: any;
  token: any;


  constructor(private connection: ConnectionService, private userservice: UserService, private route: Router){

  }

  ngOnInit() {
    this.identity = this.userservice.getidentity();
    this.token = this.userservice.getToken();
    this.checkconnection();
  }

  /*
  función de cambios en el componente
  */
// tslint:disable-next-line: use-life-cycle-interface
  ngDoCheck() {
    this.identity = this.userservice.getidentity();
    this.token = this.userservice.getToken();
    this.checkconnection();
    this.checkSesion();
  }

  checkSesion() {
    /*
    this.userservice.getRoles().subscribe(data=>{
      console.log(data);
    },error=>{
      if(error._body == '{"status":401,"message":"Error 204: Token expired"}'){
        this.route.navigate(['/error','sesionexpired']);
      }else{
        this.route.navigate(['/error',error]);
      }
    });
    */
  }

  checkconnection() {
    this.connection.monitor().subscribe(connect => {
      this.isConnect = connect;
      if (!this.isConnect) {
        this.route.navigate(['/error','Offline']);
      } else {
        if (this.identity != null) {
          this.route.navigate(['/consoleuser']);
        } else {
          this.route.navigate(['/home']);
        }
      }
    })
  }
}
