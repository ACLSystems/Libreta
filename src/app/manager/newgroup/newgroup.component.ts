import { ActivatedRoute, Router } from '@angular/router';
import { Component, DoCheck, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { environment } from './../../../environments/environment';
import { groupEntity, groupEntityTutor, groupModify } from './../manager.models';
import { ManagerserviceService } from './../managerservice.service';
import {
  ModalDismissReasons,
  NgbModal,
  NgbModalRef,
  NgbModule
  } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from './../../shared/sharedservices/user.service';



@Component({
  selector: 'app-newgroup',
  templateUrl: './newgroup.component.html',
  providers: [ManagerserviceService, UserService, DatePipe]
})
export class NewgroupComponent implements OnInit{

  loading:boolean = false;
  loadingprocess:boolean;
  ngboolean:boolean = false;
  namegboolean:boolean = false;
  coursegboolean:boolean = false;
  orgusboolean:boolean = false;
  orgusstate:boolean = false;
  orgusname:boolean = false;
  dataGroupsOk:boolean = false;
  dateBegin:boolean = false;
  datosOkcodegroup:boolean;
  codeValidated:boolean = false;
  stateBoolean:boolean = false;
  reasonOk = false;

  public idrequest:any;
  public numberRequest:number;
  public labelrequest:any;
  public detailsRequest:any;
  public detailsRequestTemp:any;
  public temp1Request:any;
  public temp2Request:any;

  public closemodal:NgbModalRef;

  public newGroupEntity:any;
  public modifyGroupEntity:groupModify;
  public claveGroup:any;
  public codeCourse:any;
  public apiexternal:any;
  public idCourse:any;
  public nameCourse:any;
  public defaultDaysDuration:number;
  public typecourse:any;
  public numberOrg:any;
  public numberGroup:any;
  public nameGroupUp:any;
  public idTutor:any;
  public idorg:any;
  public pricecourse:any;
  public costcourse:any;

  public messageError:any;
  public messageSuccess:any;


  public statesOU:any[]=[];
  public orgUS:any[]=[];
  public courses:any[]=[];
  datacourse:any[]=[];
  public carrerList:any[]=[];
  public beginDate:Date;
  public endDate:Date;
  public endDateLabel:any;
  public beginDateLabel:any;



  public todayDate = new Date();
  public today = this.datePipe.transform(this.todayDate , 'yyyy-MM-dd');

  public numberRegex = /^([0-9])*$/
  public stringRegex = /^([A-Za-z])+$/
  public stringRegexBlank = /([A-Za-z])\s([A-Za-z])/
  public termnRegex = /^Semestre\s([I,II,III,IV,V,VI,VII])/

  public emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  public identity;
  public parent:any;
  public state:any;
  statefinder:any;
  public orgName:any;
  public longname:any;


  constructor(private activatedroute:ActivatedRoute, private router:Router, private modalService:NgbModal, private managerServices:ManagerserviceService, private userService:UserService, private datePipe:DatePipe) {
    this.idTutor = environment.idTutor;
    this.activatedroute.params.subscribe(params=>{
      if(params['id']!=null){
        this.idrequest=params['id'];
      }
      if(params['numberrequest']!=null){
        this.numberRequest=params['numberrequest'];
      }
      if(params['labelrequest']!=null){
        this.labelrequest=params['labelrequest'];
      }
    });
  }

  ngOnInit() {
    this.identity = this.userService.getidentity();
    console.log(this.identity);
    this.getOU();
    this.getCourses();
    this.getCarreras();
  }

  /*
  metodo para obtener los estados del país
  */
  public getStatesOU(){
    let query1={
        type:"state",
        parent:"conalep"
      };
    this.managerServices.getStates('conalep', query1).subscribe(data=>{
        let objr = data.message;
        this.statesOU = objr.ous;
      },error=>{
        console.log(error);
      });
  }
  /*
  Metodo para obtener los planteles por supervisor
  */
  public getOrgUnits(state){
    this.statefinder = this.managerServices.parserString(state);
    this.stateBoolean = false
    let query1={
      type:"campus",
      parent:this.managerServices.parserString(state)
    };
    this.managerServices.getStates('conalep',query1).subscribe(data=>{
      this.orgUS = data.message.ous;
      this.stateBoolean = true;
    },error=>{
      this.stateBoolean = true;
    });
  }

  /*
  Metodo para obtener los cursos que estan disponibles
  */
  public getCourses(){
    this.loading = true;
    this.managerServices.getCourses().subscribe(
      data=>{
        this.courses = data.message.courses;
        this.loading = false;
      }
      ,error=>{
        this.loading = false;
      }
    );
  }

  /*
  Metodo para obtener el listado de carreras
  */
  getCarreras(){
    this.managerServices.getCarreras('conalep').subscribe(
      data=>{
        this.carrerList = data.message.results;
      },error=>{
        console.log(error);
      }
    );
  }

  /*
  Metodo para obtener el tipo de Ou del usuario
  */
  public getOU(){
    this.userService.getRoles().subscribe(data=>{
      this.parent = data.message.ou.parent;
      this.state = data.message.ou.state;
      this.longname = data.message.ou.longName;
      if(this.parent=='conalep' && this.state=='conalep'){
        this.getStatesOU();
        this.orgusstate = true;
        this.orgusname = true;
      }else if(this.parent=='conalep' && this.state!='conalep'){
        this.getOrgUnits(this.state);
        this.orgusname = true;
      }else if(this.parent!='conalep' && this.state==this.parent){
        this.orgusstate = false;
        this.stateBoolean = true;
        this.orgusname = true;
        let longName = {name:data.message.ou.name,longName:this.longname};
        this.orgUS.push(longName);
      }
    },error=>{
      console.log(error);
    });
  }

  /*
  Metodo para validar el campo del curso
  */
  public getCourse(course:any[]){
    if(course.length != 0){
      this.coursegboolean = true;
      this.codeCourse = course;
    }else{
      this.coursegboolean = false;
    }
    console.log(this.codeCourse);
  }

  /*
  Metodo para autenticar que el numero de grupo tiene un valor
  */
  public getNumber(numberGruop){
    if(numberGruop!='' && this.numberRegex.test(numberGruop)){
      this.ngboolean = true;
      this.numberGroup = numberGruop;
    }else{
      this.ngboolean = false;
    }
  }

  /*
  metodo para mostrar el modal de la cancelación de la solicitud
  */
  public showModal(content){
    this.closemodal = this.modalService.open(content);
  }
  public closeModal(){
    this.closemodal.dismiss();
  }

  /*
  Metodo para cancelar una solicitud
  */
  public deletedRequest(reason){
    var requestDeleted = {
      "number":this.numberRequest,
      "statusReason":reason
    }
    this.managerServices.deletedRequest(requestDeleted).subscribe(data=>{
      this.router.navigate(["/requests"]);
      this.closeModal();
    },error=>{
      console.log(error);
    });
  }

  /*
  Metodo para autenticar que el nombre de grupo tiene un valor
  */
  public getNanme(nameGroup){
    if(nameGroup!=''){
      this.namegboolean = true;
      this.nameGroupUp = nameGroup.toUpperCase();
    }else{
      this.namegboolean = false;
    }
  }

  /*
  Metodo para obtener el numero de plantel
  */
  public getOrgGroup(orgunit:any){
    if(orgunit.length!=0){
      this.orgusboolean = true;
      let org =  this.orgUS.find(id => id.id == orgunit)
      this.idorg = org.id
      this.orgName = org.name;
    }else{
      this.orgusboolean = false;
    }
  }

  /*
  Metodo de validacion de fechas
  */
  public getDates(begindate) {
    if(begindate !== '') {
      this.beginDate = new Date(begindate);
      this.endDate = new Date(begindate);
      this.beginDate.setDate(this.beginDate.getDate() + 1);
      this.endDate.setDate(this.beginDate.getDate() + this.defaultDaysDuration);
      this.beginDateLabel = this.datePipe.transform(this.beginDate, 'yyyy-MM-dd');
      this.endDateLabel = this.datePipe.transform(this.endDate, 'yyyy-MM-dd');
      this.dataGroupsOk = true;
    }
  }

  /*
  Metodo para generar la clave del grupo y consultarlo en la base de datos
  */
  public generateCodeGroup(code){
    if(code.length !== 0 && this.orgName!=null && this.numberGroup!=null){
      this.codeCourse = code;
      this.getNameCourse(this.codeCourse);
      let consecutivo = 1
      this.claveGroup = this.codeCourse+"-"+this.orgName+"-"+this.numberGroup+"-00"+consecutivo;
      this.coursegboolean = true;
    }else{
      this.coursegboolean = false;
    }
  }

  /*
  metodo para obtener el listado de grupos por curso y plantel
  */
  getValidateCourse(){
    this.loading = true;
    if(this.orgusstate){
      this.managerServices.getGroupsforParent(this.idCourse, this.statefinder).subscribe(
        data=>{
          if(data.groups>0){
            let vartmp = data.message.find(id => id.ouName == this.orgName);
            console.log(vartmp);
            if(vartmp!=null){
              this.datacourse = vartmp.groups
              while(this.datacourse.find(dc => dc.code == this.claveGroup)){
                let number = this.claveGroup.substring(this.claveGroup.length,(this.claveGroup.length-3));
                number++
                if(number>10){
                  this.claveGroup = this.codeCourse+"-"+this.orgName+"-"+this.numberGroup+"-0"+number;
                }else if(number>100){
                  this.claveGroup = this.codeCourse+"-"+this.orgName+"-"+this.numberGroup+"-"+number;
                }else{
                  this.claveGroup = this.codeCourse+"-"+this.orgName+"-"+this.numberGroup+"-00"+number;
                }
              }
            }
          }
          this.loading = false;
        },error=>{
          console.log(error);
          this.loading = false;
        }
      );
    }else{
      this.identity.orgunit
      this.managerServices.getGroupsforParent(this.idCourse, this.identity.orgUnit).subscribe(
        data=>{
          if(data.groups>0){
            let groupstmp = data.message.find(id => id.ouName == this.orgName);
            if(groupstmp!=null){
              this.datacourse = groupstmp.groups
              while(this.datacourse.find(dc => dc.code == this.claveGroup)){
                let number = this.claveGroup.substring(this.claveGroup.length,(this.claveGroup.length-3));
                number++
                if(number>10){
                  this.claveGroup = this.codeCourse+"-"+this.orgName+"-"+this.numberGroup+"-0"+number;
                }else if(number>100){
                  this.claveGroup = this.codeCourse+"-"+this.orgName+"-"+this.numberGroup+"-"+number;
                }else{
                  this.claveGroup = this.codeCourse+"-"+this.orgName+"-"+this.numberGroup+"-00"+number;
                }
              }
            }
            this.loading = true;
          }
        },error=>{
          this.loading = true;
          console.log(error);
        }
      );
    }
  }

  /*
  Metodo para regresar el nombre del curso
  */
  public getNameCourse(coursecode){
    const list = this.courses.find( c => c.code == coursecode);
    this.idCourse = list.id;
    this.nameCourse = list.title;
    this.pricecourse = list.price;
    this.costcourse = list.cost;
    this.apiexternal = list.apiExternal;
    this.defaultDaysDuration = list.defaultDaysDuration;
    this.typecourse = list.type;
    if(this.typecourse=='tutor'){
      this.dataGroupsOk = true
    }else{
      this.dataGroupsOk = false
    }

  }

  /*
  Metodo para crear y activar el grupo
  */
  public setGroup(){
    this.loadingprocess = true;
    const begindate = this.datePipe.transform(this.beginDate, 'yyyy-MM-dd hh:mm');
    const enddate = this.datePipe.transform(this.endDate, 'yyyy-MM-dd hh:mm');
    if(this.typecourse=='tutor'){
      this.newGroupEntity = new groupEntityTutor(this.claveGroup, this.nameGroupUp, this.idCourse, this.idTutor, this.idorg);
    }else{
      this.newGroupEntity = new groupEntity(this.claveGroup, this.nameGroupUp, this.idCourse, this.idTutor, begindate, enddate, this.idorg);
    }
    this.managerServices.postGroup(this.newGroupEntity).subscribe(
      data=>{
        var res = data.group;
        this.modifyGroupEntity = new groupModify(res.id , "active");
        this.managerServices.modifyGroup(this.modifyGroupEntity).subscribe(
          dat=>{
            this.managerServices.getRequestFinder(this.numberRequest).subscribe(
              data=>{
                this.detailsRequestTemp = data.request.details;
                this.temp1Request = data.request.temp1;
                this.temp2Request = data.request.temp2;
                let newgroup = {'kind':'groups','item':res.id}
                let newtemp1 = {'idgroup':res.id, "studentsforgroup":[], "codecourse":this.codeCourse, "apiexternal":this.apiexternal};
                let newtemp2 = {'idgroup':res.id, "codecourse":this.claveGroup, "students":[]}
                this.detailsRequestTemp.push(newgroup);
                this.temp1Request.push(newtemp1);
                this.temp2Request.push(newtemp2);
                let requestUpdate = {
                  'number':this.numberRequest,
                  'details':this.detailsRequestTemp,
                  'temp1':this.temp1Request,
                  'temp2':this.temp2Request,
                }
                this.managerServices.updateRequestManager(requestUpdate).subscribe(
                  data=>{
                    this.router.navigate(["/requests/addusers",this.idrequest,this.numberRequest,this.labelrequest,res.id,res.code,this.orgName]);
                    this.loadingprocess = false;
                  },error=>{
                    console.log(error);
                  }
                );
              }
            );
          },erro=>{
            console.log(erro)
          }
        );
      },error=>{
        console.log(error);
      }
    );
  }

  /*
  Metodo para validar las cadenas de texto
  */
  public validateStrings(value):boolean{
    let datosOk = false;
    datosOk = this.stringRegex.test(value)
    return datosOk;
  }

  /*
  metodo para validar el correo electronico del usuario
  */
  public validateEmails(value):boolean{
    let datosOk = false;
    datosOk = this.emailRegex.test(value);
    return datosOk;
  }

  /*
  Metodo para validar los semestres del alumno
  */
  public validateTermn(value):boolean{
    let datosOk = false;
    datosOk = this.termnRegex.test(value);
    return datosOk
  }

  /*
  Metodo para validar espacios en blanco
  */
  public validateSpaceBlank(value):boolean{
    this.reasonOk = this.stringRegexBlank.test(value) || this.stringRegex.test(value);
    return this.reasonOk
  }

  /*
  Metodo para validar las carreras que vienen en el Excel del usuario
  */
  public validateCareer(value):boolean{
    let datosOk = false;
    datosOk = this.carrerList.find(id => id.longName == value);
    return datosOk;
  }
  /*
  Metodo para generar el password del usuarios
  */
  public passwordGenerator(consecutivo, name:string, fatherName:string):string{
    let elementsPass = ['.','+','-','*','$','&','#'];
    let password = fatherName.substring(0,1).toUpperCase() + elementsPass[Math.floor(Math.random() * elementsPass.length)] + consecutivo + name.substring(0,3)
    return password;
  }
}
