import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


import { ServiceisorgService } from './../../shared/sharedservices/serviceisorg.service';

@Component({
  selector: 'app-consolereports',
  templateUrl: './consolereports.component.html',
  providers:[ServiceisorgService]
})
export class ConsolereportsComponent implements OnInit {

  loading:boolean;
  userRol:string;
  ous:any[]=[];
  orgTree:any;
  constructor(public orgservice:ServiceisorgService, public router:Router) {

  }

  ngOnInit() {
    this.loading = true;
    this.orgservice.getOrgTree().subscribe(data=>{
      this.orgTree = data.tree
      this.loading = false;
    },error=>{
      console.log(error);
      this.loading = false;
    });
  }

  public getRol(rol):string{
    if(rol != null || rol != ''){
      this.userRol = rol
    }
    return this.userRol
  }

  public getPercentil(query:any[], ouType:string){
    if(ouType=='campus' ||  ouType=='cast'){
      this.router.navigate(['/charts',query, ouType])
    }else{
      var queryString = Object.keys(query).map(key => key + '=' + query[key]).join('&');
      this.router.navigate(['/charts',queryString, ouType])
    }
  }

  /*
  Metodo para obtener las calificaciones por grupo
  */
  getGradesforgroup(idgroup:any, query:any, ouType:any){
    this.router.navigate(['/gradesbygroup',idgroup, query, ouType]);
  }

}
