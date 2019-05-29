import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CourseshopComponent } from '../courseshop/courseshop.component';
import { HomeService } from './../homeservices/home.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-curso',
  templateUrl: './curso.component.html',
  providers:[HomeService]
})
export class CursoComponent implements OnInit {

  @ViewChild(CourseshopComponent) shop: CourseshopComponent;

  public identiti: any;
  public token: any;
  loading: boolean;
  costo: number;
  cursos: any = [];
  curso: any = [];
  block: any = [];
  sections: any [] = [];
  contents: any [] = [];
  idc: string;
  closemodal: NgbModalRef;
  modaltype: any;
  members = 0;
  maxmembers: number [] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

  constructor(private modalService: NgbModal,
              private activeRouter: ActivatedRoute,
              private router: Router,
              private homeService: HomeService) {
    this.identiti = this.homeService.getIdentiti();
    this.token = this.homeService.getToken();
    this.costo = 30;
    this.activeRouter.params.subscribe( params =>{
      if (params.id != null) {
        this.idc = params.id;
      }
    });
  }
  ngOnInit() {
    this.getCourse(this.idc);
  }

  public getCourse(id){
    this.loading = true;
    this.homeService.getCoursesOrg().subscribe(data => {
      this.cursos = data.body.message.courses;
      this.curso = this.cursos.find(c => c.id == id);
      this.loading = false;
    });

    this.homeService.showBlocks(id).subscribe(data => {
      this.block = data.body.message.blocks;;
      this.loading = false;
    });
  }

  public verCurso(curso) {
    this.router.navigate(['/curso',curso]);
  }

  public typeModal( typeModal: any ) {
    this.modaltype = typeModal;
    this.members = 0;

    if (this.modaltype === 'individual') {
      this.members = 1;
    }
  }

  public setMembers( members: number) {
    this.members = members;
  }

  showModal( content ) {
    this.closemodal = this.modalService.open(content, {size: 'lg'});
  }

  closeModal() {
    this.closemodal.dismiss();
  }

  sendCourseShop() {
    this.shop.setShopCourses( this.idc, this.members);
    this.closeModal();
  }
}
