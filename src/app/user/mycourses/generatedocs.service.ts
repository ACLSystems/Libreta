import { Injectable } from '@angular/core';
import { DecimalPipe, } from '@angular/common';
import * as jsPDF from 'jspdf';


@Injectable()
export class GeneratedocsService {

  constructor(public decimal:DecimalPipe) {

  }

  printdocumentcredit(document:any, certificateNumber:any, nameStudent:any, course:string, finalGrade:any, time:any, units:any, passDate:any, docName: string){

    let grade = this.decimal.transform(finalGrade,'.0-2');
    var doc = new jsPDF();
    doc.addImage(document,'jpg',0,1,210,297);

    //Seccion de los folios
    doc.setFont("Times");
    doc.setFontSize(12);
    doc.setTextColor(255,0,0);
    doc.text(5,265,"Folio "+certificateNumber,null,null);

    // Seccion del nombre del alumno
    doc.setFont("Times");
    doc.setFontType('bold');
    doc.setFontSize(25);
    doc.setTextColor(100);
    doc.text(105,150,nameStudent,null,null,'center');

    //Seccion del nombre del curso
    doc.setFont("Times");
    doc.setFontType('bold');
    doc.setFontSize(16);
    doc.setTextColor(100);
    doc.text(100,176,'"'+course+'"',null,null,'center');

    //Seccion de la calificacion final del estudiante
    doc.setFont("Times");
    doc.setFontType('bold');
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(112,167,grade,'center');

    //duracion del curso
    doc.setFont("Times");
    doc.setFontType('regular');
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(111,184,''+time+' '+units);


    //fecha de termino del curso por parte del alumno
    doc.setFont("Times");
    doc.setFontType('regular');
    doc.setFontSize(11);
    doc.text(110,201,passDate,null,null);

		let docSave = docName || nameStudent;
    doc.save(docSave+"-"+course+".pdf");

  }

  printdocassistance(document:any, certificateNumber:any, nameStudent:any, course:any, time:any, units:any, passDate:any, docName: string){
    var doc = new jsPDF();
    doc.addImage(document,'jpg',0,0,210,300);

    //Seccion de los folios
    doc.setFont("Times");
    doc.setFontSize(12);
    doc.setTextColor(255,0,0);
    doc.text(5,265,"Folio "+certificateNumber,null,null);

    // Seccion del nombre del alumno
    doc.setFont("Times");
    doc.setFontType('bold');
    doc.setFontSize(25);
    doc.setTextColor(100);
    doc.text(100,150,nameStudent,null,null,'center');

    //Seccion del nombre del curso
    doc.setFont("Times");
    doc.setFontType('bold');
    doc.setFontSize(16);
    doc.setTextColor(100);
    doc.text(100,177,'"'+course+'"',null,null,'center');

    //duracion del curso
    doc.setFont("Times");
    doc.setFontType('regular');
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(112,185,''+time+' '+units);


    //fecha de termino del curso por parte del alumno
    doc.setFont("Times");
    doc.setFontType('regular');
    doc.setFontSize(11);
    doc.text(125,202,passDate,null,null,'center');

		let docSave = docName || nameStudent;
    doc.save(docSave+"-"+course+".pdf");
  }

}
