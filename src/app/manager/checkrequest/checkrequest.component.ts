import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute,Router } from '@angular/router';
import { ManagerserviceService } from './../managerservice.service';
import { UserService } from './../../shared/sharedservices/user.service';
import { NgbModule, NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { fiscaluser, fiscalusernew, fiscaladdress, fiscalupdate, fiscaluserupdates, fiscalusercorp, fiscalusernewcorp, fiscalticketdates, fiscalticketmodel, fiscalemails, roostermodels} from './../manager.models';

@Component({
  selector: 'app-checkrequest',
  templateUrl: './checkrequest.component.html',
  providers: [ManagerserviceService, UserService]
})

export class CheckrequestComponent implements OnInit {

  detailsRequest:any[];
  request:any;
  detailsFactura:any;
  factura:boolean;
  check:any;
  identiti:any;

  rfccoporates:any[]=[];
  emails:any[]=[];
  rfcusercurrent:any;
  rfcuserpers:boolean;
  newrfcusercorp:boolean;
  checktype:boolean = false;
  datosOk:boolean = false;
  updprocess:boolean;
  numberrequest:number;
  accept:boolean = false;
  subtotal:number;
  ivarequest:number;
  totalrequest:number;
  invoiceNumber:number;

  fiscalAddress:fiscaladdress
  fiscalUser:fiscaluser;
  fiscalUpdate:fiscalupdate;
  fiscalUserUpd:fiscaluserupdates;
  fiscalUserNew:fiscalusernew;
  fiscalUseerCorp:fiscalusercorp;
  fiscalUserNewCorp:fiscalusernewcorp;
  fiscaldates:fiscalticketdates;
  fiscalemails:fiscalemails;
  fiscalticketmodel:fiscalticketmodel;
  roostermodel:roostermodels;
  messageSuccess:any;
  messageError:any;
  idAPIExternal:any;

  parent:any;
  state:any;
  longname:any;
  longnamecorp:any;
  orgusstate:boolean;
  orgusname:boolean;
  addmails:boolean;
  orgName:any;
  orgid:any;
  stateBoolean:boolean;
  orgusboolean:boolean;
  orgUS:any[]=[];
  statesOU:any[]=[];
  closemodal:NgbModalRef;
  closerequestprocess:boolean;


  constructor(private modalService:NgbModal, private managerservice:ManagerserviceService, private userservice:UserService, private activatedroute:ActivatedRoute) {
    this.identiti = this.userservice.getIdentiti();
    this.activatedroute.params.subscribe(params=>{
      if(params['numberrequest']!=null){
        this.numberrequest = params['numberrequest'];
      }
    })
  }

  ngOnInit() {
    this.getRequestDetails();
    this.getOU();
  }

  /*
  Metodo para obtener el tipo de Ou del usuario
  */
  public getOU(){
    this.userservice.getRoles().subscribe(data=>{
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
  metodo para obtener los estados del país
  */
  public getStatesOU(){
    let query1={
        type:"state",
        parent:"conalep"
      };
    this.managerservice.getStates('conalep', query1).subscribe(data=>{
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
    this.stateBoolean = false
    let query1={
      type:"campus",
      parent:this.managerservice.parserString(state)
    };
    this.managerservice.getStates('conalep',query1).subscribe(data=>{
      this.orgUS = data.message.ous;
      this.stateBoolean = true;
    },error=>{
      this.stateBoolean = true;
    });
  }

  /*
  Metodo para obtener el numero de plantel
  */
  public getOrgGroup(orgunit:any){
    this.orgusboolean = false;
    if(orgunit.length!=0){
      let org =  this.orgUS.find(id => id.id == orgunit)
      this.longnamecorp = org.longName
      this.orgid = org.id
      this.orgName = org.name;
      this.orgusboolean = true;
    }
  }

  /*
  metodo para organizar los detalles de la compra
  */
  getRequestDetails(){
    this.detailsRequest = [];
    this.managerservice.getRequestFinder(this.numberrequest).subscribe(
      data=>{
        let index = 0;
        this.invoiceNumber = data.invoiceNumber;
        this.request =  data.request
        for(let idtmp of this.request.temp1){
          let code = idtmp.codecourse;
          let price = this.request.details.find(id=> id.item.course.code == code);
          if(this.detailsRequest.find(id => id.code == code)){
            let valuetmp = this.detailsRequest.find(id => id.code == code);
            let indexrepeattmp = this.detailsRequest.indexOf(this.detailsRequest.find(id => id.code == code));
            let totaltmp = valuetmp.total +  idtmp.studentsforgroup.length;
            this.detailsRequest.splice(indexrepeattmp,1);
            let tmp = {"id":idtmp.apiexternal.id,"description":idtmp.apiexternal.description,"reference":code, "quantity":totaltmp, "price":price.item.course.cost, "precio":price.item.course.price, "subtotal":price.item.course.cost*totaltmp};
            this.detailsRequest.push(tmp);
          }else{
            let tmp = {"id":idtmp.apiexternal.id,"description":idtmp.apiexternal.description,"reference":code, "quantity":idtmp.studentsforgroup.length, "price":price.item.course.cost, "precio":price.item.course.price, "subtotal":price.item.course.cost*idtmp.studentsforgroup.length};
            this.detailsRequest.push(tmp);
          }
          index++;
        }
        this.getFinalPrices();
      },error=>{
        console.log(error);
      }
    );
  }

  /*
  metodo para obtener el subtotal y el iva de la venta
  */
  getFinalPrices(){
    this.subtotal =0;
    this.ivarequest =0;
    for(let id of this.detailsRequest){
      this.subtotal = this.subtotal+id.subtotal;
      this.ivarequest = this.subtotal*.16;
      this.totalrequest = this.subtotal+this.ivarequest;
    }
  }

  /*
  Metodo para validar si requiere o no factura el usuario
  */
  getFactura(typeticket){
    this.detailsFactura=[]
    this.checktype = false;
    if(typeticket!=''){
      this.getRequestDetails();
      if(typeticket=='si'){
        this.checktype = true;
        this.factura = true;
        this.detailsFactura = {"numberrequest":this.numberrequest,"detailsrequest":this.request, "details":this.detailsRequest};
      }else if(typeticket=='no'){
        this.checktype = true;
        this.factura = false;
      }
    }else{
      this.factura = null
    }
  }

  /*
  metodo para obtener el listado de los rfc corporativos
  */
  getrfccorporate(){
    this.managerservice.getrfccorporate().subscribe(
      data=>{
        this.rfccoporates = data.message;
        this.newrfcusercorp = this.rfccoporates.length==0;
      },error=>{
        console.log(error);
      });
  }
  /*
  metodo para cerrar la solicitud
  */
  closeRequestTicket(){
    this.closeModal();
    this.closerequestprocess = true;
    if(this.emails.length==0){
      this.emails.push(this.identiti.name);
    }
    this.fiscaldates = new fiscalticketdates(false);
    this.fiscalticketmodel = new fiscalticketmodel(this.numberrequest, this.fiscaldates, this.getItemsRequest());
    this.managerservice.closeRequestManager(this.fiscalticketmodel).subscribe(
      data=>{
        this.invoiceNumber = data.invoiceNumber
        this.fiscalemails = new fiscalemails(this.invoiceNumber, this.emails);
        this.managerservice.getRequestFinder(this.numberrequest).subscribe(
          data=>{
            //
            let reqtmp = data.request;
            for(let reqid of this.request.details){
              let grptmp = reqtmp.temp1.find(grid => grid.idgroup == reqid.item._id);
              this.roostermodel = new roostermodels(reqid.item.code, grptmp.studentsforgroup);
              console.log(this.roostermodel);
              this.managerservice.createroosterbymanager(this.roostermodel).subscribe(
                data=>{
                  console.log(data);
                },error=>{
                  console.log(error);
                }
              );
            }
            //
            console.log(this.fiscalemails);
            this.managerservice.sendMailRequestManager(this.fiscalemails).subscribe(
              data=>{
                console.log(data);
                this.closerequestprocess = false;
              },error=>{
                console.log(error);
                this.closerequestprocess = false;
              }
            );
          },error=>{
            console.log(error);
          }
        );
      },error=>{
        console.log(error);
      }
    );
  }

  /*

  */
  getItemsRequest():any[]{
    let items:any [] = []
    for(let item of this.detailsRequest){
      item = {
        "id":item.id,
        "reference":item.reference,
        "description":item.description,
        "price":item.price,
        "quantity":item.quantity
      }
      items.push(item);
    }
    return items;
  }

  validatnewemails(email){
    this.addmails = this.managerservice.validateEmails(email);
  }

  /*

  */
  addnewemails(newemail){
    this.addmails = true;
    if(this.emails.length==0){
      this.emails.push(this.identiti.name);
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

  /*
  metodo para validar que el usuario ya acepto lo terminos y condiciones del pago
  */
  acceptCheck(){
    let check = <HTMLInputElement> document.getElementById('accept');
    this.accept = check.checked;
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
}
