import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceisorgService } from './../../shared/sharedservices/serviceisorg.service';
//import { Angular2CsvComponent } from 'angular2-csv';

import { DatePipe, DecimalPipe} from '@angular/common';
//import { DatePipe, DecimalPipe, SlicePipe } from '@angular/common';

//import * as jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { GeneratedocsService } from './../../user/mycourses/generatedocs.service';
import { constancias } from './../../user/models/docsconalep';

//type AOA = any[][];

@Component({
  selector: 'app-gradesbygroup',
  templateUrl: './gradesbygroup.component.html',
  providers:[ ServiceisorgService, DecimalPipe, DatePipe, GeneratedocsService]
})
export class GradesbygroupComponent implements OnInit {

  public idgroup:any;
  public query:any;
  public ouType:any;
  public group:string;
	public groupData:{
		beginDateSpa: string,
		endDateSpa: string,
		code: string
	}
	public titles:any[]=[];
  public roosterstudents:any[]=[];
  public data:any;
  public groupgrades:any[]=[];
  public course:string;
  public duration:any;
  public durationunit:any;
  public finalgrade:any;
	public displayRFC:boolean;
  public imgconalogo:any;
  public loading:boolean = false;
  public beginDate:any;
  public endDate:any;
  public wopts:XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };

  constructor(private _router:Router, private _activeRouter:ActivatedRoute, private _srvirg:ServiceisorgService, public decimal:DecimalPipe, public datePipe:DatePipe,  private genedocs:GeneratedocsService) {
    this._activeRouter.params.subscribe( params =>{
      if(params['idgroup']!=null){
        this.idgroup = params['idgroup'];
      }
      // if(params['query']!=null){
      //   this.query = params['query'];
      // }
      // if(params['ouType']!=null){
      //   this.ouType = params['ouType'];
      // }

    });
  }

  ngOnInit() {
    this.loading = true;
		localStorage.setItem('massCertChunk', String(0));
    this._srvirg.getGradesforgroup(this.idgroup).subscribe(data=>{
			this.data = data;
			this.roosterstudents = data.roster;
			this.course = data.course;
			this.duration = data.courseDuration;
			this.durationunit = data.courseDurUnits;
			this.beginDate = data.beginDate;
			this.endDate = data.endDate;
      this.group = data.group;
			this.displayRFC = data.displayRFC || false;
			this.groupData = {
				beginDateSpa: data.beginDateSpa,
				endDateSpa: data.endDateSpa,
				code: data.groupCode
			};
			let firstStudent = this.roosterstudents[0];
			if(firstStudent.grades && Array.isArray(firstStudent.grades) && firstStudent.grades.length > 0) {
				firstStudent.grades.forEach((grade:any) => {
					this.titles.push(grade.blockTitle);
				});
			}
      this.loading = false;
    },error=>{
      console.log(error);
    });
  }

  /*
  Metodo para exportar a xlsx
  */
  public getExceltest():void{
		//construir el excel
		let headersXlsx:any[]=[];
		let tempArray:any[]=[];
		let data2:any[]=[];
		headersXlsx.push('Curso');
		headersXlsx.push('Grupo');
		if(this.displayRFC) {
			headersXlsx.push('RFC');
		}
		headersXlsx.push('Apellido Paterno');
		headersXlsx.push('Apellido Materno');
		headersXlsx.push('Nombre');
		headersXlsx.push('Correo electrónico');
		headersXlsx.push('Avance del curso');

		let firstStudent = this.roosterstudents[0];
		if(firstStudent.grades && Array.isArray(firstStudent.grades) && firstStudent.grades.length > 0) {
			firstStudent.grades.forEach((grade:any) => {
				headersXlsx.push(grade.blockTitle);
			});
		}
		headersXlsx.push('Calificación final');
		headersXlsx.push('Fecha de término');
		data2.push(headersXlsx);
		for(let item of this.roosterstudents){
			tempArray.push(
				this.course,
				this.groupData.code
			);
			if(this.displayRFC) {
				tempArray.push(item.RFC);
			}
			tempArray.push(
				item.fatherName,
				item.motherName,
				item.name,
				item.email,
				item.track
			);
			for(let idgrade of item.grades){
				tempArray.push(this.decimal.transform(idgrade.blockGrade,'.0-2'));
			}
			tempArray.push(
				this.decimal.transform(item.finalGrade,'.0-2'),
				this.groupData.endDateSpa
			);
			data2.push(tempArray);
			tempArray = [];
		}
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data2);
		/* generate workbook and add the worksheet */
		const wb: XLSX.WorkBook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
		/* save to file */
		XLSX.writeFile(wb, this.groupData.code+'.xlsx');

  }

  // /*
  // Metodo para exportar a .csv
  // */
  // public getReportexcel(){
  //   let datagrade;
  //   let usersgrades:any[]=[];
  //   let grades:any[]=[];
  //   let grade1;
  //   let grade2;
  //   let grade3;
  //   let grade4;
  //   var head = ['Curso','Apellido Paterno','Apellido Materno','Nombre','Correo electrónico','Avance en este curso','Test','Examen intermedio','Examen final','Calificación final','Fecha de término'];
  //   var options={
  //     showLabels:true,
  //     showTitle:true,
  //     useBom:true
  //   };
  //   for(let item of this.roosterstudents){
  //     let pivote = 0;
  //     for(let itemgrade of item.grades){
  //       if(pivote==0){
  //         grade1 = this.decimal.transform(itemgrade.blockGrade,'.0-2');
  //       }
  //       if(pivote==1){
  //         grade2 = this.decimal.transform(itemgrade.blockGrade,'.0-2');
  //       }
  //       if(pivote==2){
  //         grade3 = this.decimal.transform(itemgrade.blockGrade,'.0-2');
  //       }
  //       if(pivote==3){
  //         grade4 = this.decimal.transform(itemgrade.blockGrade,'.0-2');
  //       }
  //       pivote++;
  //     }
  //     datagrade = [this.course,item.fatherName, item.motherName,item.name,item.email, item.track,grade1,grade2,grade3,this.decimal.transform(item.finalGrade,'.0-2'),this.endDate];
  //     usersgrades.push(datagrade);
  //   }
  //   //new Angular2Csv(usersgrades,this.course,{headers: (head)});
  // }

  returnCharts(){
    this._router.navigate(['/reports/consolereports']);
  }

  /*
  Metodo para la impresion masiva de los cursos
  */
  public printCertificatedMass(){
    //this.loading = true;
		let chunk = parseInt(localStorage.getItem('massCertChunk')) || 0;
		if((chunk * 10 ) < this.roosterstudents.length){
			let init = chunk * 10;
			let finish = (chunk + 1) * 10;
			finish = finish > this.roosterstudents.length ? this.roosterstudents.length : finish;
	    for(var i=init; i < finish; i++){
				let id = this.roosterstudents[i];
	      if(id.pass && id.passDate){
	        if(id.finalGrade >= 60){
	          this.genedocs.printdocumentcredit(constancias.constancia_acreditacion, id.certificateNumber, `${id.name} ${id.fatherName} ${id.motherName}`, this.course, id.finalGrade, this.duration, this.durationunit, id.passDateSpa, id.RFC || null);
	        } else {
	          this.genedocs.printdocassistance(constancias.constancia_participacion, id.certificateNumber, `${id.name} ${id.fatherName} ${id.motherName}`,this.course, this.duration, this.durationunit, id.passDateSpa, id.RFC || null);
	        }
	      }
	    }
			localStorage.setItem('massCertChunk', String(chunk + 1));
		}
    //this.loading = false;
  }

  /*
  Metodo para imprimir la constancia
  */
  public getCertificated(name:string, fatherName:string, motherName:string, date:any, finalGrade:number, certificateNumber:number, passDate:any){
      this.loading = true;
      let nombreCompleto = name+" "+fatherName+" "+motherName;
      if(finalGrade >= 60){
				console.log(passDate);
        this.genedocs.printdocumentcredit(constancias.constancia_acreditacion, certificateNumber, nombreCompleto, this.course, finalGrade, this.duration, this.durationunit, passDate, null);
      }else{
        this.genedocs.printdocassistance(constancias.constancia_participacion, certificateNumber, nombreCompleto,this.course, this.duration, this.durationunit, passDate, null);
      }
      this.loading = false;
  }
}
