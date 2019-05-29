import { Component, Input, OnInit } from '@angular/core';
import {
  fiscaladdress,
  fiscalemails,
  fiscalfacdates,
  fiscalfacmodel,
  fiscalupdate,
  fiscaluser,
  fiscalusercorp,
  fiscalusernew,
  fiscalusernewcorp,
  fiscaluserupdates,
  roostermodels
  } from './../../manager.models';
import { ManagerserviceService } from './../../managerservice.service';
import {
  ModalDismissReasons,
  NgbModal,
  NgbModalRef,
  NgbModule
  } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from './../../../shared/sharedservices/user.service';

@Component({
  selector: 'app-checkfac',
  templateUrl: './checkfac.component.html',
  providers: [UserService, ManagerserviceService]
})
export class CheckfacComponent implements OnInit {

  @Input() detailsFactura:any;

  accept:boolean;
  datosOk:boolean = false;
  newrfcusercorp:boolean;
  rfcuserpers:boolean;
  updprocess:boolean;
  otherrfctype:any;
  identiti:any;
  fiscaldetails:any[]=[];
  rfccoporates:any[]=[];
  orgUs:any[]=[];
  statesOU:any[]=[];
  emails:any[]=[];
  otherrfc:any;
  person:any;
  messageSuccess:any;
  messageError:any;

  fiscalAddress:fiscaladdress
  fiscalUser:fiscaluser;
  fiscalUpdate:fiscalupdate;
  fiscalUserUpd:fiscaluserupdates;
  fiscalUserNew:fiscalusernew;
  fiscalUseerCorp:fiscalusercorp;
  fiscalUserNewCorp:fiscalusernewcorp;
  fiscaldates:fiscalfacdates;
  fiscalfacmodel:fiscalfacmodel;
  fiscalemails:fiscalemails;
  roostermodel:roostermodels;

  invoiceNumber:number;
  longnamecorp:any;
  orgName:any;
  orgid:any;
  orgusboolean:boolean;
  orgusstate:boolean;
  orgusname:boolean;
  stateBoolean:boolean;
  addmails:boolean;
  closerequestprocess:boolean;

  parent:any;
  state:any;
  longname:any;
  closemodal:NgbModalRef;


  constructor(private modalService:NgbModal,private userservice:UserService, private managerservice:ManagerserviceService) {
    this.identiti = this.userservice.getIdentiti();
  }

  ngOnInit() {
    this.getFiscalDetails();
    this.getDetailsRequest();
    this.getOU();
  }

  public getDetailsRequest(){
    this.managerservice.getRequestFinder(this.detailsFactura.numberrequest).subscribe(
      data=>{
        console.log(data);
        //this.invoiceNumber = data.invoiceNumber;
      },error=>{
        console.log(error);
      }
    );
  }

  /*
  Metodo para obtener el tipo de Ou del usuario
  */
  public getOU(){
    this.userservice.getRoles().subscribe(data=>{
      console.log(data);
      /*
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
        this.orgUs.push(longName);
      }
      */
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
      this.orgUs = data.message.ous;
      this.stateBoolean = true;
    },error=>{
      this.stateBoolean = true;
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
  Metodo para obtener el numero de plantel
  */
  public getOrgGroup(orgunit:any){
    this.orgusboolean = false;
    if(orgunit.length!=0){
      let org =  this.orgUs.find(id => id.id == orgunit)
      this.longnamecorp = org.longName
      this.orgid = org.id
      this.orgName = org.name;
      this.orgusboolean = true;
    }
  }

  /*
  Metodo para consultar los datos fiscales del usuario
  */
  getFiscalDetails(){
    this.messageSuccess = null;
    this.messageError = null;
    this.fiscaldetails = [];
    this.userservice.getUser(this.identiti.name).subscribe(
      data=>{
        this.fiscaldetails = data.fiscal;
        this.otherrfc = this.fiscaldetails.length==0;
        if(!this.otherrfc){
          this.person = this.fiscaldetails.find(id => id.fiscalcurrent);
          this.getUserRFC(this.person.tag);
        }
      },error=>{
        console.log(error);
      }
    );
  }

  /*
  Metodo para validar si el usuario requiere añadir otro rfc
  */
  getUserRFC(userrfc){
    this.messageSuccess = null;
    this.messageError = null;
    this.newrfcusercorp = false;
    this.otherrfc = false;
    this.otherrfctype = '';
    if(userrfc!=''){
      if(userrfc!='other'){
        this.otherrfc = 'false';
        this.getuserbyrfc(userrfc);
      }else{
        this.otherrfc = 'true';
      }
    }
  }

  /*
  metodo para consultar los datos del usuario en base al RFC que selecciono
  */
  getuserbyrfc(userrfc){
    this.person = this.fiscaldetails.find(id => id.tag == userrfc);
    this.rfcuserpers = true;
  }

  /*
  metodo para validar el tipo de rfc
  */
  gettyperfc(rfctype){
    this.messageSuccess = null;
    this.messageError = null;
    this.person = null;
    this.otherrfctype = rfctype;
    if(this.otherrfctype=='corporativo'){
      this.getrfccorporate();
    }else if(this.otherrfctype=='personal'){
      this.otherrfctype = rfctype;
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

  getrfccorp(rfc){
    this.messageSuccess = null;
    this.messageError = null;
    this.person = null
    if(rfc!=''){
      if(rfc!='newrfccorp'){
        this.person = this.rfccoporates.find(id => id.tag == rfc);
        this.newrfcusercorp = false;
      }else if(rfc=='newrfccorp'){
        this.newrfcusercorp = true;
      }
    }else{
      this.person = null
      this.newrfcusercorp = false;
    }
  }

  /*

  */
  datacheck(emailuser,name,newrfc?){
    if(this.otherrfc == 'true'){
      this.datosOk = this.managerservice.validateEmails(emailuser)&&name!='';
    }else{
      this.datosOk = this.managerservice.validateEmails(emailuser)&&name!='';
    }
  }

  /*
  Actualizar los datos de un RFC del usuario
  */
  updatefiscaldates(rfc,emailuser,name,tnumber1,tnumber2,cellnumber,street,extnum,intnum,cp,colony,locality,municipality){
    this.messageSuccess = null;
    this.messageError = null;
    this.fiscalAddress = new fiscaladdress(street,extnum,intnum,colony,locality,municipality,cp);
    this.fiscalUpdate = new fiscalupdate(this.person.tag, tnumber1,tnumber2,cellnumber,this.fiscalAddress);
    this.fiscalUserUpd = new fiscaluserupdates(this.identiti.name,this.fiscalUpdate);
    this.updrfcuser(this.fiscalUserUpd);
  }

  /*
  Guardar los datos de un RFC del usuario
  */
  savefiscaldates(newrfc,emailuser,name,tnumber1,tnumber2,cellnumber,street,extnum,intnum,cp,colony,locality,municipality){
    this.messageSuccess = null;
    this.messageError = null;
    if(this.otherrfctype=='personal'){
      let tag = newrfc+"--"+this.otherrfctype;
      this.fiscalAddress = new fiscaladdress(street,extnum,intnum,colony,locality,municipality,cp);
      this.fiscalUser = new fiscaluser(newrfc,tag,name,emailuser,this.otherrfctype,'client',tnumber1,tnumber2,cellnumber,this.fiscalAddress);
      this.fiscalUserNew = new fiscalusernew(this.identiti.name,this.fiscalUser);
      this.updrfcuser(this.fiscalUserNew);
    }else if(this.otherrfctype=='corporativo'){
      let tag = newrfc+"-Plantel-"+this.orgName;
      this.fiscalAddress = new fiscaladdress(street,extnum,intnum,colony,locality,municipality,cp);
      this.fiscalUseerCorp = new fiscalusercorp(newrfc, tag, name, emailuser, this.otherrfctype, 'client', true, this.orgid, tnumber1, tnumber2, cellnumber, this.fiscalAddress);
      this.fiscalUserNewCorp = new fiscalusernewcorp(this.identiti.name,this.fiscalUseerCorp);
      this.updrfcuser(this.fiscalUserNewCorp);
    }
  }

  /*
  metodo para actualizar/guardar los RFC del usuario en su listado de RFC'S
  */
  updrfcuser(fiscalusrupd){
    this.updprocess = true;
    this.userservice.userModify(fiscalusrupd).subscribe(
      data=>{
        this.updprocess = false;
        this.messageSuccess = "Operación exitosa"
      },error=>{
        this.updprocess = false;
        this.messageError = error;
      }
    );
  }

  /*
  metodo para cerrar la solicitud
  */
  closeRequestTicket(){
    this.closeModal();
    this.closerequestprocess = true;
    if(this.emails.length==0){
      this.emails.push(this.person.email)
    }
    this.fiscaldates = new fiscalfacdates(true,this.person.tag);
    this.fiscalfacmodel = new fiscalfacmodel(this.detailsFactura.numberrequest,this.fiscaldates, this.getItemsRequest());

    this.managerservice.closeRequestManager(this.fiscalfacmodel).subscribe(
      data=>{
        this.invoiceNumber = data.invoiceNumber;
        this.fiscalemails = new fiscalemails(this.invoiceNumber, this.emails);
        this.managerservice.getRequestFinder(this.detailsFactura.numberrequest).subscribe(
          data=>{
            let reqtmp = data.request;
            for(let reqid of this.detailsFactura.detailsrequest.details){
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
    for(let item of this.detailsFactura.details){
      console.log(item);
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

  /*
  metodo para mostrar el modal de la cancelación de la solicitud
  */
  public showModal(content){
    this.closemodal = this.modalService.open(content,{size:'lg'});
  }
  public closeModal(){
    this.closemodal.dismiss();
  }

  validatnewemails(email){
    this.addmails = this.managerservice.validateEmails(email);
  }

  /*

  */
  addnewemails(newemail){
    this.addmails = true;
    if(this.emails.length==0){
      this.emails.push(this.person.email);
      this.emails.push(newemail);
      this.addmails = false;
    }else{
      this.emails.push(newemail);
      this.addmails = false;
    }
  }

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

}
