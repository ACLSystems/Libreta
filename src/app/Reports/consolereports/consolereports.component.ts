import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, interval, Subscription } from 'rxjs';


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
	percentil:any;
	evals:any[]=[];
	projects:any[]=[];
	projectid:string;
	select:string;
	checkSelected:boolean;
	loadingData: boolean;
	processingData: boolean;
	processMessage: string;
	seconds: number;
	progressTrack: number;
	progressUnTrack: number;
	progressPass: number;
	level: number;
	updateTime: Date;
	displayEvals: boolean;
	private updateSubscription: Subscription;
  constructor(public orgservice:ServiceisorgService, public router:Router) {

  }

  ngOnInit() {
		this.loading = true;
		this.updateTime = new Date();
		this.processMessage = 'Procesando listados.';
		this.seconds = 600000;
		this.launchLevel1();
    this.updateSubscription = interval(this.seconds).subscribe(() => {
			console.log('Refrescando cada 10 minutos');
			this.updateTime = new Date();
			this.launchLevel1();
		});
  }

	ngOnDestroy() {
		this.updateSubscription.unsubscribe();
	}

  public getRol(rol):string{
    if(rol != null || rol != ''){
      this.userRol = rol
    }
    return this.userRol
  }

  // public getPercentil(query:any[], ouType:string){
  //   if(ouType=='campus' ||  ouType=='cast' || ouType=='institute'){
  //     this.router.navigate(['/reports/charts',query, ouType])
  //   }else{
  //     var queryString = Object.keys(query).map(key => key + '=' + query[key]).join('&');
  //     this.router.navigate(['/reports/charts',queryString, ouType])
  //   }
  // }

	public launchLevel1() {
		this.loadingData = true;
		this.processingData = true;
		this.projects = [];
		this.evals = [];
		this.projectid = null;
		this.orgservice.projects().subscribe(data => {
			if(Array.isArray(data) && data.length > 0) { // Esto es para sacar el proyecto y sí hay proyecto
				data.forEach(dato => {
					this.projects.push(dato.name);
					if(dato.name == dato.currentProject) {
						this.select = dato.currentProject;
						this.projectid = dato._id;
					}
				});
				if(!this.projectid) {
					this.projectid = data[0]._id;
				}
				//console.log(this.projectid)
			}
			this.loading = false;
			let project = this.projectid || null;
			this.getOrgTree(project);
		}, error => { // No hay proyectos
			//console.log('Este es el error')
			//console.log(error.error.message)
			if(error.error.message == 'No tengo proyectos') {
				this.getOrgTree(null);
			} else {
				//console.log(error);
	      this.loading = false;
				this.loadingData = false;
			}
		});
	}

	getOrgTree(project: any) {
		this.orgservice.getOrgTree(project).subscribe(data=>{
			this.orgTree = data.tree;
			this.displayEvals = data.displayEvals || false;
			//console.log(this.displayEvals);
			//console.log(this.orgTree);
			if(this.orgTree.groups && Array.isArray(this.orgTree.groups) && this.orgTree.groups.length > 0) {
				this.orgTree.groups.forEach((group: any) => {
					group.totalUsers = group.totalUsers || 0;
					group.usersOnTrack = group.usersOnTrack || 0;
					group.usersPassed = group.usersPassed || 0;
				});
			}
			let query  = this.orgTree.ouId ;
			if(this.projectid){
				query += '&project=' + this.projectid;
			}
			//console.log(query);
			this.getPercentil(query);
		},error=>{
			console.log(error);
			this.loading = false;
			this.loadingData = false;
		}); // Obtener orgTree
	}

	getPercentil(query: any){
		this.orgservice.getCharts(query).subscribe(data => {
			this.percentil = data;
			this.progressTrack = this.percentil.usersOnTrack / this.percentil.totalUsers * 100;
			this.progressUnTrack = (this.percentil.totalUsers - this.percentil.usersOnTrack) / this.percentil.totalUsers * 100;
			this.progressPass = this.percentil.usersPassed / this.percentil.totalUsers * 100;
			let results = this.percentil.results;
			//console.log(this.percentil.results);
			if(Array.isArray(results) && results.length > 0) {
				let findOU = results.findIndex(ou => ou.ouId === this.orgTree.ouId);
				this.ous = Array.from(results[findOU].ous);
				//console.log(this.ous);
				this.orgTree.groups.forEach(grp => {
					let findGrp = this.ous.findIndex(per => grp.groupId === per.groupId);
					if(findGrp > -1) {
						grp.totalUsers 		= this.ous[findGrp].totalUsers || 0;
						grp.usersOnTrack 	= this.ous[findGrp].usersOnTrack || 0;
						grp.usersPassed 	= this.ous[findGrp].usersPassed || 0;
					}
				});
				if(this.displayEvals) {
					this.processMessage = 'Actualizando información.';
					this.getEvals();
				} else {
					this.processingData = false;
					this.loading = false;
					this.loadingData = false;
				}

			}
		}, error => {
			console.log(error);
			this.loading = false;
			this.loadingData = false;
		});
	}

	getEvals() {
		this.orgservice.getEval(this.orgTree.ouId,this.projectid)
			.subscribe(data => {
				this.evals = Array.from(data.message);
				//console.log(this.evals);
				this.loadingData = false;
				this.processingData = false;
			}, error => {
				console.log(error);
				this.processingData = false;
				this.loading = false;
				this.loadingData = false;
			});
	}

  /*
  Metodo para obtener las calificaciones por grupo
  */
  // getGradesforgroup(idgroup:any, query:any, ouType:any){
  //   this.router.navigate(['/reports/gradesbygroup',idgroup, query, ouType]);
  // }
	getGradesforgroup(idgroup:string) {
		//console.log(idgroup);
		this.router.navigate(['/reports/gradesbygroup', idgroup]);
	}

}
