import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { log } from 'util';
import { ManagerserviceService } from './../managerservice.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { payment } from './../manager.models';
import { UserService } from './../../shared/sharedservices/user.service';

declare var $: any;

@Component({
  selector: 'app-viewrequest',
  templateUrl: './viewrequest.component.html',
  providers: [ ManagerserviceService, UserService]
})
export class ViewrequestComponent implements OnInit {

  loading = false;
  loadingfile: boolean;
  numberrequest: any;
  request: any;
  closemodal: NgbModalRef;
  reasonOk: boolean;
  paymentmodel: payment;

  total: any;
  subtotal: any;
  IVA: any;

  stringRegex = /^([A-Za-z])+$/;
  stringRegexBlank = /([A-Za-z])\s([A-Za-z])/;

  messageSuccess: any;
  messageError: any;
  invoiceNumber: number;
  codegroup: any;
  idgrouptmp: any;
  token: any;
  fileid: any;
  filename: any;
  groupscsv: any;

// tslint:disable-next-line: max-line-length
  constructor(private modalService: NgbModal, private router: Router, private activatedroute: ActivatedRoute, private managerServices: ManagerserviceService, private userService: UserService) {
    this.token = this.userService.getToken();
    this.activatedroute.params.subscribe(params => {
      if (params.numberrequest != null) {
        this.numberrequest = params.numberrequest;
      }
    });

  }

  ngOnInit() {
    this.getRequestView();
  }

  getRequestView() {
    this.total = 0;
    this.subtotal = 0;
    this.IVA = 0;
    this.loading = true;
    this.managerServices.getRequestFinder(this.numberrequest).subscribe(
      data => {
        this.request = data.request;
        this.invoiceNumber = data.invoiceNumber;
        for (const id of this.request.details) {
          for (const idtemp of this.request.temp1) {
            if (idtemp.idgroup === id.item._id) {
              this.subtotal = this.subtotal + (id.item.course.cost * idtemp.studentsforgroup.length);
              this.IVA = this.subtotal * .16;
              this.total = this.subtotal + this.IVA;
            }
          }
        }
        this.loading = false;
      });
  }

  /*
  metodo para redireccionar al usuario y pueda agregar un nuevo grupo a la solicitud
  */
  addnewGroup() {
    this.router.navigate(['/newrequest', this.request._id, this.request.reqNumber, this.request.label]);
  }

  /*

  */
  deleteGroupRequest(idgroup: any, codegruop: any, content: any) {
    this.idgrouptmp = idgroup;
    this.codegroup = codegruop;
    this.showModal(content);
  }

  /*

  */
  showGroup(idgroup: any, content: any) {
    this.groupscsv = this.request.temp2.find( id => id.idgroup === idgroup);
    this.showModal(content);
    console.log(this.groupscsv);
  }

  /*

  */
  quitGruop() {
    this.closeModal();
    this.loading = true;
    const dett = this.request.details;
    const tmp1 = this.request.temp1;
    const tmp2 = this.request.temp2;
    const det1 = dett.indexOf(dett.find(idtt => idtt.item._id === this.idgrouptmp));
    const val1 = tmp1.indexOf(tmp1.find(idtm => idtm.idgroup === this.idgrouptmp));
    const val2 = tmp2.indexOf(tmp2.find(idtm => idtm.idgroup === this.idgrouptmp));
    dett.splice(det1, 1);
    tmp1.splice(val1, 1);
    tmp2.splice(val2, 1);
    const jsoupdate = {
      number: this.numberrequest,
      details: dett,
      temp1: tmp1,
      temp2: tmp2
    };
    this.managerServices.updateRequestManager(jsoupdate).subscribe(
      data => {
        this.getRequestView();
      }, error => {
        console.log(error);
        this.closeModal();
      }
    );
  }

  /*
  metodo para mostrar el modal de la cancelación de la solicitud
  */
  public showModal(content: any) {
    this.closemodal = this.modalService.open(content, {size: 'lg'});
  }
  public closeModal() {
    this.closemodal.dismiss();
  }

  /*
  Metodo para cancelar una solicitud
  */
  public deletedRequest(reason: any) {
    const requestDeleted = {
      number: this.request.reqNumber,
      statusReason: reason
    };
    this.managerServices.deletedRequest(requestDeleted).subscribe(data => {
      this.router.navigate(['/solicitudes']);
      this.closeModal();
    }, error => {
      console.log(error);
    });
  }

  /*
  Metodo para validar espacios en blanco
  */
  public validateSpaceBlank(value: any): boolean {
    this.reasonOk = this.stringRegexBlank.test(value) || this.stringRegex.test(value);
    return this.reasonOk;
  }

  /*
  Metodo para subir el formato de excel con los correos
  */
  public uploadFile($event: any) {
    this.loadingfile = true;
    this.messageSuccess = null;
    this.messageError = null;
    if ($event.target.files.length === 1 && $event.target.files[0].size <= 1048576) {
      this.managerServices.setAttachment($event.target.files[0], this.invoiceNumber, this.numberrequest, this.token).subscribe(
        data => {
          this.messageSuccess = 'Se cargo el archivo correctamente';
          this.fileid = data.fileId;
          this.filename = $event.target.files[0].name;
          this.loadingfile = false;
        }, error => {
          console.log(error);
          this.messageError = 'Ocurrió un error inesperado' + error;
          this.loadingfile = false;
        }
      );
    }
  }

  /*
  metodo para enviar el comprobante de pago
  */
  public setPayment(notes?: any) {
    if (notes !== '') {
// tslint:disable-next-line: max-line-length
      this.paymentmodel = new payment(this.numberrequest, this.invoiceNumber, this.request.invoice.idAPIExternal, this.fileid, this.request.requester.name, notes);
    } else {
// tslint:disable-next-line: max-line-length
      this.paymentmodel = new payment(this.numberrequest, this.invoiceNumber, this.request.invoice.idAPIExternal, this.fileid, this.request.requester.name);
    }
    this.managerServices.sendPayment(this.paymentmodel).subscribe(
      data => {
        this.closeModal();
        this.getRequestView();
        this.messageSuccess = data.message;
      }, error => {
        console.log(error);
      }
    );
  }
}
