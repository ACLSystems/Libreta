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
	courses:any[]=[];
	evals:any[]=[];
	projects:any[]=[];
	projectid:string;
	select:string;
	checkSelected:boolean;
	loadingData: boolean;
	processingData: boolean;
	processingEvals: boolean;
	processMessage: string;
	seconds: number;
	secondsDisable: number;
	progressTrack: number;
	progressUnTrack: number;
	progressPass: number;
	level: number;
	updateTime: Date;
	updateDisable: boolean;
	displayEvals: boolean;
	optionsLevel2:any[]=[];
	private updateDisableSubscription: Subscription;
	private updateSubscription: Subscription;
  constructor(public orgservice:ServiceisorgService, public router:Router) {

  }

  ngOnInit() {
		this.loading = true;
		this.updateTime = new Date();
		this.updateDisable = false;
		this.processingEvals = true;
		this.processMessage = 'Procesando listados.';
		this.seconds = 600000;
		this.getProject();
    this.updateSubscription = interval(this.seconds).subscribe(() => {
			console.log('Refrescando cada 10 minutos');
			this.updateTime = new Date();
			this.getProject();
		});
  }

	refresh() {
		this.loading = true;
		this.updateTime = new Date();
		this.processMessage = 'Procesando listados.';
		this.seconds = 600000;
		this.updateDisable = true;
		this.secondsDisable = 60000;
		this.processingEvals = true;
		this.updateSubscription.unsubscribe();
		this.updateSubscription = interval(this.seconds).subscribe(() => {
			console.log('Refrescando cada 10 minutos');
			this.updateTime = new Date();
			this.getProject();
		});
		this.updateDisableSubscription = interval(this.secondsDisable).subscribe(() => {
			console.log('Activando refresco')
			this.updateDisable = false;
			this.updateDisableSubscription.unsubscribe();
		})
		this.getProject();
	}

	ngOnDestroy() {
		this.updateSubscription.unsubscribe();
	}

  // public getRol(rol):string{
  //   if(rol != null || rol != ''){
  //     this.userRol = rol
  //   }
  //   return this.userRol
  // }

  // public getPercentil(query:any[], ouType:string){
  //   if(ouType=='campus' ||  ouType=='cast' || ouType=='institute'){
  //     this.router.navigate(['/reports/charts',query, ouType])
  //   }else{
  //     var queryString = Object.keys(query).map(key => key + '=' + query[key]).join('&');
  //     this.router.navigate(['/reports/charts',queryString, ouType])
  //   }
  // }

	public getProject() {
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
			//console.log(data)
			this.orgTree = data.tree;
			this.displayEvals = data.displayEvals || false;
			//console.log(this.displayEvals);
			//console.log('orgTree')
			//console.log(this.orgTree);
			var query = '';
			this.level = this.orgTree.ouLevel;
			if(this.level === 3) {
				//console.log('Somos nivel 3');
				if(this.orgTree.groups && Array.isArray(this.orgTree.groups) && this.orgTree.groups.length > 0) {
					this.orgTree.groups.forEach((group: any) => {
						group.totalUsers = group.totalUsers || 0;
						group.usersOnTrack = group.usersOnTrack || 0;
						group.usersPassed = group.usersPassed || 0;
					});
				}
				query  = this.orgTree.ouId;
				if(this.projectid){
					query += '&project=' + this.projectid;
				}
			} else if(this.level  === 2) {
				// console.log('Somos nivel 2')
				// Sacamos el options del nivel 2
				if(this.orgTree.ous && Array.isArray(this.orgTree.ous) && this.orgTree.groups.length > 0) {
					this.optionsLevel2 = Array.from(this.orgTree.ous);
				}
				query = this.orgTree.query[0];
				if(this.projectid){
					query += '&project=' + this.projectid;
				}
			}else if(this.level  === 1) {
				console.log('Somos nivel 1')
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
			this.courses = [];
			this.percentil = data;
			// console.log('Percentil')
			//console.log(this.percentil);
			this.progressTrack = this.percentil.usersOnTrack / this.percentil.totalUsers * 100;
			this.progressUnTrack = (this.percentil.totalUsers - this.percentil.usersOnTrack) / this.percentil.totalUsers * 100;
			this.progressPass = this.percentil.usersPassed / this.percentil.totalUsers * 100;
			var results = this.percentil.results;
			// console.log(this.progressTrack)
			// console.log(this.progressUnTrack)
			// console.log(this.progressPass)
			// console.log('Percentil results')
			// console.log(results);
			// console.log(this.level)
			if(Array.isArray(results) && results.length > 0) {
				if(this.level === 3) { // si estamos en nivel 3
					//console.log('Somos percentil nivel 3')
					let findOU = results.findIndex(ou => ou.ouId === this.orgTree.ouId);
					this.ous = Array.from(results[findOU].ous);
					//console.log(this.ous);
					this.orgTree.groups.forEach((grp:any) => {
						let findGrp = this.ous.findIndex(per => grp.groupId === per.groupId);
						if(findGrp > -1) {
							grp.totalUsers 		= this.ous[findGrp].totalUsers || 0;
							grp.usersOnTrack 	= this.ous[findGrp].usersOnTrack || 0;
							grp.usersPassed 	= this.ous[findGrp].usersPassed || 0;
						}
					});
				} else if(this.level === 2) { // si estamos en nivel 2
					this.orgTree.groups = [];
					this.orgTree.ous.forEach((ou:any) => {
						var findOU = results.findIndex((orgu:any) => orgu.ouId === ou.ouId);
						//console.log('findOU : ' + findOU)
						ou.groups.forEach((grp:any) => {
							var findGrp = results[findOU].ous.findIndex((resOusGrp:any) => resOusGrp.groupId === grp.groupId);
							//console.log('findGrp: ' + findGrp)
							if(findGrp >= 0) {
								grp.totalUsers 		= results[findOU].ous[findGrp].totalUsers || 0;
								grp.usersOnTrack 	= results[findOU].ous[findGrp].usersOnTrack || 0;
								grp.usersPassed 	= results[findOU].ous[findGrp].usersPassed || 0;
							} else { //por si hay grupos vacíos
								grp.totalUsers 		= 0;
								grp.usersOnTrack 	= 0;
								grp.usersPassed 	= 0;
							}
							this.orgTree.groups.push(grp);
						})
					})
					//console.log('Somos percentil nivel 2')

				} else if(this.level ===1){ // si estamos en nivel 1
					//console.log('Somos percentil nivel 1')

				}
				if(this.displayEvals) {
					this.processMessage = 'Actualizando información.';
					this.getEvals();
				}
				results.forEach((res:any) => { //construir el resultado por cursos
					if(res.ous && Array.isArray(res.ous) && res.ous.length > 0) {
						res.ous.forEach((ou:any) => {
						    let findCourse = this.courses.findIndex((course:any) => course.code === ou.courseCode);
								if(findCourse < 0 ) {
									let course = {
										title: ou.course,
										code: ou.courseCode,
										totalUsers: ou.totalUsers || 0,
										usersOnTrack: ou.usersOnTrack || 0,
										usersPassed: ou.usersPassed || 0
									}
									this.courses.push(course);
								} else {
									if(ou.totalUsers	) {this.courses[findCourse].totalUsers 		+= ou.totalUsers;		}
									if(ou.usersOnTrack) {this.courses[findCourse].usersOnTrack 	+= ou.usersOnTrack;	}
									if(ou.usersPassed	) {this.courses[findCourse].usersPassed 	+= ou.usersPassed;	}
								}
						});
					}
				});
				this.courses.sort((a,b) => (a.totalUsers > b.totalUsers) ? -1 : 1); // ordenar por volumen de mayor a menor
				this.courses.forEach((course:any) => {
					course.percentage = course.totalUsers / this.percentil.totalUsers * 100;
				})
				//console.log(this.courses);
				this.processingData = false;
				this.loading = false;
				this.loadingData = false;
			} else {
				this.processingData = false;
				this.loading = false;
				this.loadingData = false;
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
				this.evals.forEach((ev:any) => {
					ev.percentage = ev.total / this.percentil.totalUsers * 100;
				});
				//console.log(this.evals);
				this.loadingData = false;
				this.processingData = false;
				this.processingEvals = false;
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
