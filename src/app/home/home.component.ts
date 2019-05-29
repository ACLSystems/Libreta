import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { FormControl } from '@angular/forms';
import { HomeService } from './homeservices/home.service';
import { Meta } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  p:number = 1;
  public token;
  public identiti;
  public loading:boolean = false;
  public cursos:any;
  public environment: any;
  /*
  Constructor de la clase
  */
  constructor(private homeservice:HomeService, private _router:Router, private Meta:Meta) {
    this.Meta.addTag({name:'description', content:'Supérate Mexico es una iniciativa de capacitación en línea que te ayuda en tu desarrollo profesional, adquiriendo nuevas competencias y dándole valor a tus conocimientos'});
  }

  ngOnInit() {
    this.environment = environment.production;
    this.identiti = this.homeservice.getIdentiti();
    this.token = this.homeservice.getToken();
    if(this.token){
      this._router.navigate(['/consoleuser']);
    }else{
      this._router.navigate(['/home']);
    }
    this.getCourseList();
  }

  public getCourseList(){
    this.loading = true;
    this.homeservice.getCoursesOrg().subscribe(data =>{
      this.cursos = data.body.message.courses;
      this.loading = false;
    },error=>{
      console.log(error.message);
    });
  }

  public verCurso(curso){
    this._router.navigate(['/curso',curso]);
  }
}
