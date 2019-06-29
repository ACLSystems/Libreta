import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceisorgService } from './../../shared/sharedservices/serviceisorg.service';
import { Angular2CsvComponent } from 'angular2-csv';

import { DatePipe, DecimalPipe, SlicePipe } from '@angular/common';

import * as jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { GeneratedocsService } from './../../user/mycourses/generatedocs.service';
import { constancias } from './../../user/models/docsconalep';

type AOA = any[][];

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
  public data:AOA = [ [1, 2], [3, 4] ];
  public data2:AOA = []=[];
  public groupgrades:any[]=[];
  public course:string;
  public duration:any;
  public durationunit:any;
  public finalgrade:any;
  public imgconalogo:any;
  public loading:boolean = false;
  public beginDate:any;
  public endDate:any;
  public wopts:XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };
  public headersXlsx:any []=['Curso','Apellido Paterno','Apellido Materno','Nombre','correo electrónico','Avance del curso','Test','Examen intermedio','Examen final','Calificación final','Fecha de término'];

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
    let tempArray:any[]=[];
    let name:any;
    let pivote:number=0;
    let grade1;
    let grade2;
    let grade3;
    let grade4;
    this.data2.push(this.headersXlsx);
    this._srvirg.getGradesforgroup(this.idgroup).subscribe(data=>{
      this.group = data.group;
			this.groupData = {
				beginDateSpa: data.beginDateSpa,
				endDateSpa: data.endDateSpa,
				code: data.groupCode
			};
      this.roosterstudents = data.roster;
			let firstStudent = this.roosterstudents[0];
			if(firstStudent.grades && Array.isArray(firstStudent.grades) && firstStudent.grades.length > 0) {
				firstStudent.grades.forEach((grade:any) => {
					this.titles.push(grade.blockTitle);
				});
			}
			console.log(this.titles);
      this.course = data.course;
      this.duration = data.courseDuration;
      this.durationunit = data.courseDurUnits;
      this.beginDate = data.beginDate;
      this.endDate = data.endDate;
      for(let item of data.roster){
        this.finalgrade = this.decimal.transform(item.finalGrade,'.0-2');
        this.groupgrades.push(item.grades);
        for(let idgrade of this.groupgrades){
          for(let idg of idgrade){
            if(pivote == 0){
              grade1 = this.decimal.transform(idg.blockGrade,'.0-2');
            }
            if(pivote == 1){
              grade2 = this.decimal.transform(idg.blockGrade,'.0-2');
            }
            if(pivote == 2){
              grade3 = this.decimal.transform(idg.blockGrade,'.0-2');
            }
            if(pivote == 3){
              grade4 = this.decimal.transform(idg.blockGrade,'.0-2');
            }
            pivote ++;
          }
          pivote = 0;
        }
        tempArray.push(this.course,item.fatherName,item.motherName,item.name, item.email, item.track, grade1, grade2, grade3, this.finalgrade, this.endDate);
        this.data2.push(tempArray);
        tempArray = [];
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
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(this.data2);
		/* generate workbook and add the worksheet */
		const wb: XLSX.WorkBook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
		/* save to file */
		XLSX.writeFile(wb, this.course+'.xlsx');

  }

  /*
  Metodo para exportar a .csv
  */
  public getReportexcel(){
    let datagrade;
    let usersgrades:any[]=[];
    let grades:any[]=[];
    let grade1;
    let grade2;
    let grade3;
    let grade4;
    var head = ['Curso','Apellido Paterno','Apellido Materno','Nombre','Correo electrónico','Avance en este curso','Test','Examen intermedio','Examen final','Calificación final','Fecha de término'];
    var options={
      showLabels:true,
      showTitle:true,
      useBom:true
    };
    for(let item of this.roosterstudents){
      let pivote = 0;
      for(let itemgrade of item.grades){
        if(pivote==0){
          grade1 = this.decimal.transform(itemgrade.blockGrade,'.0-2');
        }
        if(pivote==1){
          grade2 = this.decimal.transform(itemgrade.blockGrade,'.0-2');
        }
        if(pivote==2){
          grade3 = this.decimal.transform(itemgrade.blockGrade,'.0-2');
        }
        if(pivote==3){
          grade4 = this.decimal.transform(itemgrade.blockGrade,'.0-2');
        }
        pivote++;
      }
      datagrade = [this.course,item.fatherName, item.motherName,item.name,item.email, item.track,grade1,grade2,grade3,this.decimal.transform(item.finalGrade,'.0-2'),this.endDate];
      usersgrades.push(datagrade);
    }
    //new Angular2Csv(usersgrades,this.course,{headers: (head)});
  }

  returnCharts(){
    this._router.navigate(['/reports/consolereports']);
  }

  /*
  Metodo para la impresion masiva de los cursos
  */
  public printCertificatedMass(){
    this.loading = true;
    for(let id of this.roosterstudents){
      if(id.pass && id.passDate){
        if(id.finalGrade >= 60){
          this.genedocs.printdocumentcredit(constancias.constancia_acreditacion, id.certificateNumber, id.name, this.course, id.finalGrade, this.duration, this.durationunit, id.passDateSpa);
        }else{
          this.genedocs.printdocassistance(constancias.constancia_participacion, id.certificateNumber, id.name,this.course, this.duration, this.durationunit, id.passDateSpa);
        }
      }
    }
    this.loading = false;
  }

  /*
  Metodo para imprimir la constancia
  */
  public getCertificated(name:string, fatherName:string, motherName:string, date:any, finalGrade:number, certificateNumber:number, passDate:any){
      this.loading = true;
      let nombreCompleto = name+" "+fatherName+" "+motherName
      if(finalGrade >= 60){
        this.genedocs.printdocumentcredit(constancias.constancia_acreditacion, certificateNumber, nombreCompleto, this.course, finalGrade, this.duration, this.durationunit, passDate);
      }else{
        this.genedocs.printdocassistance(constancias.constancia_participacion, certificateNumber, nombreCompleto,this.course, this.duration, this.durationunit, passDate);
      }
      this.loading = false;
  }
}
