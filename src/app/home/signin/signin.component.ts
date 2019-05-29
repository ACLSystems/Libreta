import { Areas } from './../../models/temp/areas';
import { Component, DoCheck, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HomeService } from './../homeservices/home.service';
import { Login } from './../../shared/login/login';
import { Person } from './../../models/person/person';
import { Router } from '@angular/router';
import { SigninService } from './signin.service';
import { States } from './../../models/temp/states';
import { Student } from './../../models/student/student';
import { StudentExternal } from './../../models/student/studentExternal';
import { Userlms } from './../../models/userlms/userlms';
import { UserTemp } from './../../models/temp/usertemp';



@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  providers: [SigninService, HomeService]
})
export class SigninComponent implements OnInit, DoCheck {

  public userlms: Userlms;
  login: Login;
  public usertemp: UserTemp;
  public person: Person;
  public student: Student;
  public studentE: StudentExternal;
  public st: States;
  public ar: Areas;
  public org: string;
  public datosOk = true;
  public isDataPerson = false;
  uservalite: boolean;
  emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

  public messaerr: string;
  public messasuc: string;
  public messaErrorPerson: string;
  public messaerrorg: string;
  public messaerrstd: string;
  public usertype: string;
  public userorig: string;
  public identiti: any;

  public carrerasList: any[] = [];
  public areadata: any[] = [];
  public typesdata: any[] = [];
  public statesorg: any [] = [];
  public orgUS: any [] = [];
  public query1: any;

  constructor(private signinService: SigninService, private homeService: HomeService, private route: Router) {
    this.org = 'conalep';
    this.person = new Person('', '', '', '', new Date());
    this.student = new Student('', '', '');
    this.studentE = new StudentExternal('', '', '');
    this.usertemp = new UserTemp('', '', '', '');
    this.st = new States('');
    this.ar = new Areas('');
    this.getAreas();
    this.getOrgUnits();
    this.verGrados();
  }

  ngOnInit() {

  }

  ngDoCheck() {
    this.datosOrgs();
  }

  /*
  Funcion para registrar el nuevo usuario
  */
  public onSubmit(username: any, password: any) {

    this.usertemp.org = 'conalep';
    this.person.email  = username;

    if (this.student.type === 'internal') {
      const usert = this.usertemp;
      this.userlms = new Userlms(username, password, this.person, this.student, usert.org, usert.orgUnit);
    } else {
      const usert = this.usertemp;
      this.studentE.type = 'external';
      this.userlms = new Userlms(username, password, this.person, this.studentE, usert.org, usert.orgUnit);
    }

    this.signinService.registerUser(this.userlms).subscribe( () => {
      this.login = new Login (username, password);
      this.signinService.singUp(this.login).subscribe(data => {
        localStorage.setItem('token', data.token);
        this.signinService.getUser(this.login.username).subscribe(res => {
          const identiti = res;
          localStorage.setItem('identiti', JSON.stringify(identiti));
          this.route.navigate(['/consoleuser']);
        });
      });
    });
  }

  /*
  Metodo para obtener el listado de los estados por parte del conalep
  */
  public getOrgUnits() {
    this.query1 = {
        type: 'state',
        parent: 'conalep'
      };
    this.signinService.getStates(this.org, this.query1).subscribe( data => {
      const objr = data.message;
      this.statesorg = objr.ous;
    });
  }

  /*
  Metodo para asignar la unidad de organizacion
  */
  public setOrgUnit(orgunit: any) {
    this.usertemp.orgUnit = orgunit;
  }
  /*
  Funcion para obtener los planteles del estado que seleccion el usuario
  */
  public verPlantel(state: any) {
    this.st.state = state;
    this.query1 = {
      type: 'campus',
      parent: this.signinService.parserString(this.st.state)
    };
    this.signinService.getStates(this.org, this.query1).subscribe(data => {
      const objr = data.message;
      this.orgUS = objr.ous;
    });
  }
  /*
  Funcion para obtener las areas de educacion de la organizacion
  */
  public getAreas() {
    this.signinService.getAreas(this.org).subscribe(data => {
      const objr = data.message;
      this.areadata = objr.details;
    });
  }
  /*
  Funcion para obtener las carreras del area de educacion de la organizacion
  */
  public verCarrera(area: any) {
    this.ar.area = area;
    this.query1 = {
      area: this.ar.area
    };
    this.signinService.getCarreras(this.org, this.query1).subscribe(data => {
      const objr = data.message;
      this.carrerasList = objr.results;
    });
  }

  /*
  funcion para asignar la carrera
  */
  public setCarrer(carrer: any) {
    this.student.career = carrer;
  }

  /*
  Funcion para obtener el listado de semestres
  */
  public verGrados() {
    const type = 'semester';
    this.query1 = {
      type
    };
    this.homeService.getTerms(this.org, this.query1).subscribe(data => {
      this.typesdata = data.body.message.results;
    });
  }

  /*
  funcion para asignar el semestre al usuario
  */
  public setSemester(semester: any) {
    this.student.term = semester;
  }

  public typeU(type: any) {
    this.usertype = type;
    this.student.type = type;
    this.st.state = '';
    this.ar.area  = '';
    this.usertemp.orgUnit = '';
    this.student.term = '';
    this.studentE.external = '';
    this.student.career = '';
    this.studentE.origin = '';
  }

  public origU(external: string) {
    this.userorig = external;
    this.studentE.external = external;
  }

  public setExternalOrigin(origin: any) {
    this.studentE.origin = origin;
  }

  /*
  validaciones del primer formulario de datos personales
  */
  datosPersonales(name: string, father: string, mother: string): string {
    if (name !== '' && father !== '' && mother !== '' ) {
      this.person.name = name;
      this.person.fatherName = father;
      this.person.motherName = mother;
      this.isDataPerson = true;
      return '1';
    } else {
      this.isDataPerson = false;
      return '0';
    }
  }

  /*
  validaciones del segundo formulario de datos escolares
  */
  public datosOrgs(): string {
    this.messaerrorg = null;
    if (this.usertype === 'internal') {
// tslint:disable-next-line: max-line-length
      if (this.st.state.length === 0 || this.st.state === null || this.usertemp.orgUnit.length === 0 || this.usertemp.orgUnit === null || this.ar.area.length === 0 || this.student.career.length === 0 || this.student.term.length === 0) {
        this.messaerrorg = 'Selecciona una opcion de cada lista';
        return '1';
      } else {
        this.messaerrorg = '';
        return '2';
      }
    } else if (this.usertype === 'external') {
      if (this.st.state === null || this.usertemp.orgUnit === null || this.studentE.external.length === null) {
        this.messaerrorg = 'Selecciona una opcion de cada lista';
        return '1';
      } else {
        this.messaerrorg = '';
        return '2';
      }
    } else {
      this.messaerrorg = 'Selecciona una opcion de cada lista';
      return '1';
    }
  }

  public datosStudent(): string {
    if (this.ar.area.length === 0 || this.student.career.length === 0 || this.student.term.length === 0) {
      this.messaerrstd = 'Selecciona una opcion de cada lista';
      return '2';
    } else {
      this.messaerrstd = '';
      return '3';
    }
  }

  /*
  metodo para validar si el usuario esta o no dentro de la base de datos
  */
  validateUser( useremail: any): boolean {
    this.uservalite = this.emailRegex.test(useremail);
    return this.uservalite;
  }
}
