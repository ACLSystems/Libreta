import { Component, OnInit } from '@angular/core';
import { UserService } from './../../shared/sharedservices/user.service';
import { ManagerserviceService } from './../managerservice.service';
import { Router } from '@angular/router';
import { NgbModule, NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-grupos',
  templateUrl: './grupos.component.html',
  providers: [UserService,ManagerserviceService]
})
export class GruposComponent implements OnInit {

  identity:any
  request:any;

  requestsManager:any[];
  emails:any[]=[];
  groupsmanager:any[];
  groupscsv:any[]=[];

  loading:boolean = false;
  isFindOk:boolean = false;
  labelOk:boolean = false;
  addmails:boolean = false;

  messageNotFound = "";
  closemodal:NgbModalRef;
  invoiceNumber:any;
  emailcurrent:any;


  constructor(private router:Router, private modalService:NgbModal, private userservice:UserService, private managerService:ManagerserviceService) {

  }

  ngOnInit() {
    this.identity = this.userservice.getidentity();
    this.getRequests();
    this.getgroups();
  }

  /*
  metodo par obtener las solicitudes por usuario
  */
  public getRequests(){
    this.requestsManager = [];
    this.loading = true;
    this.managerService.getRequestsManager().subscribe(
      data=>{
        this.requestsManager = data.requests
        this.loading = false;
      },error=>{
        this.loading = false;
      }
    );
  }

  /*
  metodo para generar una nueva solicitud
  */
  public getNewResource(labelValue){
    let label = {
        "label":labelValue
      };
    this.managerService.getNewRequest(label).subscribe(data=>{
      data.request.id;
      data.request.number;
      data.request.label;
      this.router.navigate(["/requests/newrequest",data.request.id,data.request.number,data.request.label]);
      this.closeModal();
    },error=>{
      console.log(error);
    });
  }

  /*
  metodo para redireccionar a la vista de una solicitud en especifico
  */
  getRequestView(reqNumber){
    this.router.navigate(["/requests/viewrequest",reqNumber]);
  }

  /*
  Metodo para buscar una solicitud dentro del listado
  */
  findRequest(value){
    if(value!=''){
      this.managerService.getRequestFinder(value).subscribe(
        data=>{
          this.request = data.request;
          this.isFindOk = true;
          this.messageNotFound=null
          console.log(this.request);
        },error=>{
          this.isFindOk = false;
          this.messageNotFound ="No se encontraron resultados con este número";
        }
      );
    }else{
      this.isFindOk = null;
      this.messageNotFound=null
    }
  }

  public getgroups(){
    this.groupsmanager = [];
    this.loading = true;
    this.managerService.getGroupsManager(this.identity.ouid).subscribe(data=>{
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
  metodo para buscar los emails de la solicitud
  */
  findEmails(numberrequest, content){
    this.emails=[];
    this.managerService.getRequestFinder(numberrequest).subscribe(
      data=>{
        this.invoiceNumber = data.request.invoice.idAPIExternal,
        this.emailcurrent = data.request.requester.name;
        this.showModal(content);
      },error=>{
        console.log(error);
      }
    );
  }

  /*
  metodo para el envio de emails
  */
  sendEmails(){
    if(this.emails.length==0){
      this.emails.push(this.emailcurrent);
    }

    let jsonemail={
      "invNumber":this.invoiceNumber,
      "emails":this.emails
    }
    console.log(jsonemail);
    /*
    this.managerService.sendMailRequestManager(jsonemail).subscribe(
      data=>{

      },error=>{

      }
    );
    */
  }

  /*
  consulta de los grupos que tiene la solicitud
  */
  findgroupscsv(numberrequest, content){
    this.managerService.getRequestFinder(numberrequest).subscribe(
      data=>{
        this.groupscsv = data.request.temp2;
        this.showModal(content);
        console.log(this.groupscsv);
      },error=>{
        console.log(error);
      });
  }

  /*
  descarga el archivo csv
  */
  downloadfile(codecourse, students){
    let data, filename, link;
    let csv = this.converCsv(students);
    if(csv == null){
      return;
    }
    filename = students.filename || codecourse+'.csv';
    if(!csv.match(/^data:text\/csv/i)){
      csv = 'data:text/csv;charset=utf-8,' + csv;
    }
     data = encodeURI(csv);

     link = document.createElement('a');
     link.setAttribute('href', data);
     link.setAttribute('download', filename);
     link.click();
  }

  /*
  convierte los json del arreglo en el archivo CSV
  */
  converCsv(students){
    var result,ctr,keys,columndelimiter,linedelimiter,data;
    data = students || null;
    if(data==null || !data.length){
      return null
    }
    columndelimiter = students.columndelimiter || ',';
    linedelimiter = students.linedelimiter || '\n';
    keys = Object.keys(data[0]);

    result ='';
    result += keys.join(columndelimiter);
    result += linedelimiter;
    data.forEach(function(item){
      ctr = 0;
      keys.forEach(function(key){
        if(ctr>0){
          result+=columndelimiter;
        }
        result += item[key];
        ctr++;
      });
      result += linedelimiter
    });
    return result;
  }

  /*
  metodo para agregar mas emails de envio
  */
  addnewemails(newemail){
    this.addmails = true;
    if(this.emails.length==0){
      this.emails.push(this.emailcurrent);
      this.emails.push(newemail);
      this.addmails = false;
    }else{
      this.emails.push(newemail);
      this.addmails = false;
    }
    document.getElementById("newemail").onreset;
  }

  /*

  */
  resetemails(){
    this.emails = [];
  }

  public showModal(content){
    this.closemodal = this.modalService.open(content);
  }

  public closeModal(){
    this.closemodal.dismiss();
  }

  validateLabel(value):boolean{
    this.labelOk = false;
    this.labelOk = value.length != 0;
    return this.labelOk;
  }
}
