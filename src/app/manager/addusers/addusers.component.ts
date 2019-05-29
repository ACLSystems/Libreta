import * as XLSX from 'xlsx';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import {
  corporate,
  personmuir,
  studentexternalmuir,
  studentmuir,
  userexternalmuir,
  usermuir
  } from './../manager.models';
import { ManagerserviceService } from './../managerservice.service';
import {
  ModalDismissReasons,
  NgbModal,
  NgbModalRef,
  NgbModule
  } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from './../../shared/sharedservices/user.service';



@Component({
  selector: 'app-addusers',
  templateUrl: './addusers.component.html',
  providers: [UserService, ManagerserviceService]
})
export class AddusersComponent implements OnInit {

  loadingprocess: boolean;
  loading: boolean;
  reasonOk = false;
  uservalite = false;
  personcheck: boolean;
  userindividual = 0;
  typeregister: any;
  resulttrue: number;
  resultfalse: number;
  resultfind: number;
  resultrepeat: number;

  idrequest: any;
  numberrequest: any;
  request: any;
  labelrequest: any;
  idgroup: any;
  codegroup: any;
  course: any;
  orgName: any;

  carrerList: any [] = [];
  termnList: any [] = ['Semestre I', 'Semestre II', 'Semestre III', 'Semestre IV', 'Semestre V', 'Semestre VI', 'Semestre VII'];
  csvContent: any [] = [];
  csvResult: any [] = [];

  studenstTemp: any [] = [];
  studentsforgrouptmp: any [] = [];
  studentscsvfile: any [] = [];

  messageErrorFile: any;
  messageSuccessFile: any;

  messageSuccess: any;
  messageError: any;

  user: usermuir;
  userexternal: userexternalmuir;
  person: personmuir;
  student: studentmuir;
  personsinglemuir: personmuir;
  studentsinglemuir: studentmuir;
  studentexternalmuir: studentexternalmuir;
  typecorporate: corporate;
  closemodal: NgbModalRef;

  numberRegex = /^([0-9])*$/;
  stringRegex = /^([A-Za-z])+$/;
  stringRegexBlank = /([A-Za-z])\s([A-Za-z])/;
  termnRegex = /^Semestre\s([I,II,III,IV,V,VI,VII])/;

  emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  identiti: any;

  personsingle: any;
  studentsingle: any;
  idusersingle: any;
  persontmp: any;
  typestudent: any;
  corptype: any;
  termn: any;
  career: any;

  datosOkString = false;
  datosOkname = false;
  datosOkafather = false;
  datosOkamother = false;
  datosOkemails = false;
  datosOk = false;
  datosOktype = false;
  datosOkCorptype = false;
  datosOkcarrer = false;
  datosOktermn = false;
  userfind: boolean;
  userfinder: boolean;
  file: File;
  arrayBuffer: any;

// tslint:disable-next-line: max-line-length
  constructor(private modalService: NgbModal , private activatedroute: ActivatedRoute, private managerServices: ManagerserviceService, private userService: UserService) {
    this.activatedroute.params.subscribe(params => {
      if (params.idrequest !== null) {
        this.idrequest = params.idrequest;
      }
      if (params.numberrequest !== null) {
        this.numberrequest = params.numberrequest;
      }
      if (params.labelrequest !== null) {
        this.labelrequest = params.labelrequest;
      }
      if (params.idgroup !== null) {
        this.idgroup = params.idgroup;
      }
      if (params.codegroup !== null) {
        this.codegroup = params.codegroup;
      }
      if (params.orgUnit !== null) {
        this.orgName = params.orgUnit;
      }
    });
    this.userindividual = 0;
    this.personsinglemuir = new personmuir('', '', '', '');
  }

  ngOnInit() {
    this.getCarreras();
    this.getRequestDetails();
  }

  /*
  metodo para validar el tipo de registro por parte del supervisor
  */
  gettyperegister(type) {
    this.typeregister = '';
    if (type !== '') {
      this.typeregister = type;
    }
  }

  getRequestDetails() {
    this.loading = true;
    this.managerServices.getRequestFinder(this.numberrequest).subscribe(
      data => {
        const restemp = data.request.temp2;
        this.request = restemp.find(res => res.idgroup === this.idgroup);
        this.course = data.request.details.find(res => res.item._id === this.idgroup);
        this.loading = false;
      }
    );
  }

  /*
  Metodo para la carga del archivo
  */
  public loadFile(evt) {
    this.loadingprocess = true;
    this.file = evt.target.files[0];
    if (this.file.size > 0) {
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        this.arrayBuffer = fileReader.result;
        const data = new Uint8Array(this.arrayBuffer);
        const arr = new Array();
        for (let i = 0; i !== data.length; i++) {
          arr[i] = String.fromCharCode(data[i]);
        }
        const bstr = arr.join('');
        const workbook = XLSX.read(bstr, {type: 'binary'});
        const first_sheet_name = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[first_sheet_name];
        this.csvContent = XLSX.utils.sheet_to_json(worksheet, {raw: true});
        this.validateFiles(this.csvContent);
        this.loadingprocess = false;
      };
      fileReader.readAsArrayBuffer(this.file);
      this.messageSuccessFile = 'Se cargó el archivo: ' + this.file.name + ' correctamente';
    }
  }

  public validateFiles(students: any[]) {
    this.csvResult = [];
    this.studentscsvfile = [];
    this.resultfalse = 0;
    this.resultfind = 0;
    this.resulttrue = 0;

    if (students.length <= 200) {
      for (const id of students) {
// tslint:disable-next-line: max-line-length
        if (id.Numero != null && id.Nombre_Completo != null && id.Apellido_Paterno != null && id.Apellido_Materno != null && id.Correo_electronico != null && id.Usuario != null && id.Tipo != null) {
          if (this.validateEmails(id.Correo_electronico)) {
            if (this.csvResult.length > 0 ) {
              if (this.csvResult.find(res => res.value.Correo_electronico === id.Correo_electronico)) {
                const result = {value: id, flag: 'secondary', result: 'Registro repetido'};
                this.csvResult.push(result);
                this.resultfind++;
              } else {
                const result = {value: id, flag: 'success', result: 'Registro correcto'};
                this.csvResult.push(result);
                this.studentscsvfile.push(id);
                this.resulttrue++;
              }
            } else {
              const result = {value: id, flag: 'success', result: 'Registro correcto'};
              this.csvResult.push(result);
              this.studentscsvfile.push(id);
              this.resulttrue++;
            }
          } else {
            const result = {value: id, flag: 'danger', result: 'Correo no valido'};
            this.csvResult.push(result);
            this.resultfalse++;
          }
        } else {
          const result = {value: id, flag: 'danger', result: 'El registro no cumple con los estandares de información'};
          this.csvResult.push(result);
          this.resultfalse++;
        }
      }
    } else {
      this.messageErrorFile = 'El archivo solo puede contener como máximo 200 registros';
    }
  }

  /*
  Metodo para validar la informacion del archivo
  */
  public processFiles() {
    this.studenstTemp = [];
    this.studentsforgrouptmp = [];
    for (const idstudent of this.studentscsvfile) {
// tslint:disable-next-line: max-line-length
      this.person = new personmuir(idstudent.Nombre_Completo, idstudent.Apellido_Paterno, idstudent.Apellido_Materno, idstudent.Correo_electronico);
      if (idstudent.Usuario === 'Interno' || idstudent.Usuario === 'interno') {
        if (idstudent.Carrera !== '' && idstudent.Semestre !== '') {
          if (this.validateCareer(idstudent.Carrera) && this.validateTermn(idstudent.Semestre)) {
            this.studentsinglemuir = new studentmuir('internal', idstudent.Carrera, idstudent.Semestre);
          } else {
            this.studentsinglemuir = new studentmuir('internal');
          }
        } else {
          this.studentsinglemuir = new studentmuir('internal');
        }
        this.typecorporate = new corporate(this.parsetypeStudent(idstudent.Tipo));
// tslint:disable-next-line: max-line-length
        this.user = new usermuir(this.person, this.passwordGenerator(idstudent.Numero, this.person.name, this.person.fatherName), 'conalep', this.orgName, this.codegroup, this.numberrequest, this.studentsinglemuir, this.typecorporate);
        this.managerServices.createuserbymanager(this.user).subscribe(data => {
          if (data.uri !== null) {
            this.studenstTemp.push(data.userid);
            this.studentsforgrouptmp.push({
              nombreCompleto: this.user.person.name,
              apellidoPaterno: this.user.person.fatherName,
              apellidoMaterno: this.user.person.motherName,
              correoElectronico: this.user.person.email,
              contraseña: this.user.password
            });
          } else {
            this.studenstTemp.push(data.user.id);
            this.studentsforgrouptmp.push({
              nombreCompleto: data.user.person.name,
              apellidoPaterno: data.user.person.fatherName,
              apellidoMaterno: data.user.person.motherName,
              correoElectronico: data.user.person.email,
              contraseña: 'Usuario existente'
            });
          }
        });
      } else if (idstudent.Usuario === 'Externo' || idstudent.Usuario === 'externo') {
        this.studentexternalmuir = new studentexternalmuir('external', this.parsetypeStudent(idstudent.Tipo));
// tslint:disable-next-line: max-line-length
        this.userexternal = new userexternalmuir(this.person, this.passwordGenerator(idstudent.Numero, this.person.name, this.person.fatherName), 'conalep', this.orgName, this.codegroup, this.numberrequest, this.studentexternalmuir);
        this.managerServices.createuserbymanager(this.userexternal).subscribe(data => {
          if (data.uri !== null) {
            this.studenstTemp.push(data.userid);
            this.studentsforgrouptmp.push({
              nombreCompleto: this.user.person.name,
              apellidoPaterno: this.user.person.fatherName,
              apellidoMaterno: this.user.person.motherName,
              correoElectronico: this.user.person.email,
              contraseña: this.user.password
            });
          } else {
            this.studenstTemp.push(data.user.id);
            this.studentsforgrouptmp.push({
              nombreCompleto: data.user.person.name,
              apellidoPaterno: data.user.person.fatherName,
              apellidoMaterno: data.user.person.motherName,
              correoElectronico: data.user.person.email,
              contraseña: 'Usuario existente'
            });
          }
        });
      }
    }
    this.messageSuccessFile = 'Se agregaron: ' + this.studentscsvfile.length + ' nuevos participantes a este grupo';
    this.closeModal();
  }

  /*
  metodo para actualizar la solicitud
  */
  updateRequestManager() {
    this.loadingprocess = true;
    this.managerServices.getRequestFinder(this.numberrequest).subscribe(
      data => {
        const tmparray = data.request.temp1;
        const tmparray2 = data.request.temp2;
        const valuetemp = tmparray.find(id => id.idgroup === this.idgroup);
        const valuetemp2 = tmparray2.find(id => id.idgroup === this.idgroup);
        const indexrepeat = tmparray.indexOf(tmparray.find(id => id.idgroup === this.idgroup));
        const indexrepeat2 = tmparray2.indexOf(tmparray2.find(id => id.idgroup === this.idgroup));

        if (valuetemp.studentsforgroup.length > 0) {
          const index = this.studenstTemp.length;
          let contador = 0;
          for (const id of this.studenstTemp) {
            valuetemp.studentsforgroup.push(id);
            contador++;
            if (contador === index) {
              tmparray.splice(indexrepeat, 1);
// tslint:disable-next-line: max-line-length
              tmparray.push(
                {
                  idgroup: this.idgroup,
                  studentsforgroup: valuetemp.studentsforgroup,
                  codecourse: valuetemp.codecourse,
                  apiexternal: valuetemp.apiexternal
                }
              );
              const requestUpdate = {
                number: this.numberrequest,
                temp1: tmparray
              };
              this.managerServices.updateRequestManager(requestUpdate).subscribe( () => {
                this.loadingprocess = false;
              }, error => {
                this.loadingprocess = false;
              });
            }
          }
        } else {
          tmparray.splice(indexrepeat, 1);
          tmparray.push({
            idgroup: this.idgroup,
            studentsforgroup: this.studenstTemp,
            codecourse: valuetemp.codecourse,
            apiexternal: valuetemp.apiexternal
          });
          const requestUpdate = {
            number: this.numberrequest,
            temp1: tmparray
          };
          this.managerServices.updateRequestManager(requestUpdate).subscribe( () => {
            this.loadingprocess = false;
          }, () => {
            this.loadingprocess = false;
          });
        }
        if (valuetemp2.students.length > 0) {
          const index = this.studentscsvfile.length;
          let contador = 0;
          for (const id of this.studentsforgrouptmp) {
            valuetemp2.students.push(id);
            contador++;
            if (contador === index) {
              tmparray2.splice(indexrepeat2, 1);
              tmparray2.push({
                idgroup: this.idgroup,
                students: valuetemp2.students,
                codecourse: valuetemp2.codecourse
              });
              const requestUpdate = {
                number: this.numberrequest,
                temp2: tmparray2
              };
              this.managerServices.updateRequestManager(requestUpdate).subscribe( () => {
                this.loadingprocess = false;
              }, () => {
                this.loadingprocess = false;
              });
            }
          }
        } else {
          tmparray2.splice(indexrepeat2, 1);
          tmparray2.push({
            idgroup: this.idgroup,
            students: this.studentscsvfile,
            codecourse: valuetemp2.codecourse
          });
          const requestUpdate = {
            number: this.numberrequest,
            temp2: tmparray2
          };

          this.managerServices.updateRequestManager(requestUpdate).subscribe( () => {
            this.loadingprocess = false;
          }, error => {
            this.loadingprocess = false;
          });
        }
        this.loadingprocess = false;
      }
    );
  }

  /*
  metodo para actualizar un grupo por cada usuario nuevo
  */
  updateRequestManagerSingle(newuserid: any, user: any) {
    this.loadingprocess = true;
    this.managerServices.getRequestFinder(this.numberrequest).subscribe(
      data => {
        const tmparray = data.request.temp1;
        const tmparray2 = data.request.temp2;
        const valuetemp = tmparray.find(id => id.idgroup === this.idgroup);
        const valuetemp2 = tmparray2.find(id => id.idgroup === this.idgroup);
        const indexrepeat = tmparray.indexOf(tmparray.find(id => id.idgroup === this.idgroup));
        const indexrepeat2 = tmparray2.indexOf(tmparray2.find(id => id.idgroup === this.idgroup));

        if (valuetemp.studentsforgroup.length > 0) {
          valuetemp.studentsforgroup.push(newuserid);
          tmparray.splice(indexrepeat, 1);
          tmparray.push({
            idgroup: this.idgroup,
            studentsforgroup: valuetemp.studentsforgroup,
            codecourse: valuetemp.codecourse,
            apiexternal: valuetemp.apiexternal});
        } else {
          valuetemp.studentsforgroup.push(newuserid);
          tmparray.splice(indexrepeat, 1);
          tmparray.push({
            idgroup: this.idgroup,
            studentsforgroup: valuetemp.studentsforgroup,
            codecourse: valuetemp.codecourse,
            apiexternal: valuetemp.apiexternal
          });
        }
        if (valuetemp2.students.length > 0) {
          valuetemp2.students.push(user);
          tmparray2.splice(indexrepeat2, 1);
          tmparray2.push({
            idgroup: this.idgroup,
            students: valuetemp2.students,
            codecourse: valuetemp2.codecourse
          });
          const requestUpdate = {
            number: this.numberrequest,
            temp1: tmparray,
            temp2: tmparray2
          };
          this.managerServices.updateRequestManager(requestUpdate).subscribe( () => {
            this.messageSuccess = 'Se agregó el usuario exitosamente';
            this.userindividual++;
            this.loadingprocess = false;
            this.uservalite = false;
          }, error => {
            this.loadingprocess = false;
            this.messageError = 'Ocurrio un error interno de la plataforma: ' + error;
            this.uservalite = false;
          });
        } else {
          valuetemp2.students.push(user);
          tmparray2.splice(indexrepeat2, 1);
          tmparray2.push({
            idgroup: this.idgroup,
            students: valuetemp2.students,
            codecourse: valuetemp2.codecourse
          });
          const requestUpdate = {
            number: this.numberrequest,
            temp1: tmparray,
            temp2: tmparray2
          };
          this.managerServices.updateRequestManager(requestUpdate).subscribe( () => {
            this.messageSuccess = 'Se agregó el usuario exitosamente';
            this.userindividual++;
            this.loadingprocess = false;
            this.uservalite = false;
          }, error => {
            this.loadingprocess = false;
            this.messageError = 'Ocurrio un error interno de la plataforma: ' + error;
            this.uservalite = false;
          });
        }
      }, error => {
        console.log(error);
      }
    );
  }

  /*
  Metodo para validar las cadenas de texto
  */
  public validateStrings(value: any): boolean {
    this.datosOk = false;
    this.datosOk = this.stringRegex.test(value);
    return this.datosOk;
  }

  /*
  metodo para validar el correo electronico del usuario
  */
  public validateEmails(value: any): boolean {
    this.datosOk = false;
    this.datosOk = this.emailRegex.test(value);
    this.personsinglemuir.email = value;
    return this.datosOk;
  }

  /*
  Metodo para validar los semestres del alumno
  */
  public validateTermn(value: any): boolean {
    this.datosOktermn = false;
    this.datosOktermn = this.termnRegex.test(value);
    this.termn = value;
    return this.datosOktermn;
  }

  /*
  Metodo para validar espacios en blanco
  */
  public validateSpaceBlank(value: any): boolean {
    this.reasonOk = false;
    this.reasonOk = this.stringRegexBlank.test(value) || this.stringRegex.test(value);
    return this.reasonOk;
  }


  public validateName(value: any): boolean {
    this.datosOkname = false;
    this.datosOkname = this.stringRegex.test(value);
    this.personsinglemuir.name = value;
    return this.datosOkname;
  }

  public validateafather(value: any): boolean {
    this.datosOkafather = false;
    this.datosOkafather = this.stringRegex.test(value);
    this.personsinglemuir.fatherName = value;
    return this.datosOkafather;
  }
  public validateamother(value: any): boolean {
    this.datosOkamother = false;
    this.datosOkamother = this.stringRegex.test(value);
    this.personsinglemuir.motherName = value;
    return this.datosOkamother;
  }

  public validatetypestudent(value: any): boolean {
    this.datosOktype = false;
    this.datosOkCorptype = false;
    this.typestudent = '';
    if (value !== '') {
      this.datosOktype = true;
      this.typestudent = value;
    }
    return this.datosOktype;
  }

  public validatecorptypestudent(value: any): boolean {
    this.datosOkCorptype = false;
    this.corptype = '';
    this.termn = '';
    this.career = '';
    if (value !== '') {
      this.datosOkCorptype = true;
      this.corptype = value;
    }
    return this.datosOkCorptype;
  }

  /*
  Metodo para validar las carreras que vienen en el Excel del usuario
  */
  public validateCareer(value: any): boolean {
    this.datosOkcarrer = false;
    this.datosOkcarrer = this.carrerList.find(id => id.longName === value);
    this.career = value;
    return this.datosOkcarrer;
  }

  /*
  Metodo para generar el password del usuarios
  */
  public passwordGenerator(consecutivo: number, name: string, fatherName: string): string {
    const elementsPass = ['.', '+', '-', '*', '$', '&', '#'];
// tslint:disable-next-line: max-line-length
    const password = fatherName.substring(0, 1).toUpperCase() + elementsPass[Math.floor(Math.random() * elementsPass.length)] + consecutivo + name.substring(0, 3);
    return password;
  }

  /*
  Metodo para obtener el listado de carreras
  */
  getCarreras() {
    this.managerServices.getCarreras('conalep').subscribe(
      data => {
        this.carrerList = data.message.results;
      }, error => {
        console.log(error);
      }
    );
  }

  /*
  metodo para validar si el usuario esta o no dentro de la base de datos
  */
  validateUser(useremail: any): boolean {
    this.uservalite = false;
    if (this.emailRegex.test(useremail)) {
      this.uservalite = true;
      this.userfinder = false;
      this.personsinglemuir.email = useremail;
      if (this.request.students.find(st => st.correoElectronico === useremail)) {
        this.userfinder = true;
      } else {
        this.findUserSingle(useremail);
        this.userfinder = false;
      }
    } else {
      this.uservalite = false;
    }
    return this.uservalite;
  }

  findUserSingle(useremail: any) {
    this.userfind = true;
    this.personcheck = false;
    this.managerServices.getUserDetailsByManager(useremail).subscribe(data => {
      this.personsingle =  data.person;
      this.studentsingle = data.student;
      this.idusersingle = data.userid;
      if (this.personsingle !== null) {
        this.persontmp = {
          nombreCompleto: this.personsingle.name,
          apellidoPaterno: this.personsingle.fatherName,
          apellidoMaterno: this.personsingle.motherName,
          correoElectronico: this.personsingle.email,
          contraseña: 'Usuario existente'
        };
      }
      this.personcheck = true;
      this.userfind = false;
    });
  }

  newusersingle() {
    if (this.typestudent === 'internal') {
      this.studentsinglemuir = new studentmuir(this.typestudent, this.career, this.termn);
      this.typecorporate = new corporate(this.corptype);
// tslint:disable-next-line: max-line-length
      this.user = new usermuir(this.personsinglemuir, this.passwordGenerator(0, this.personsinglemuir.name, this.personsinglemuir.fatherName), 'conalep', this.orgName, this.codegroup, this.numberrequest, this.studentsinglemuir, this.typecorporate);
      this.newregister(this.user, this.user.password);
    } else if (this.typestudent === 'external') {
      this.studentexternalmuir = new studentexternalmuir(this.typestudent, this.corptype);
// tslint:disable-next-line: max-line-length
      this.userexternal = new userexternalmuir(this.personsinglemuir, this.passwordGenerator(0, this.personsinglemuir.name, this.personsinglemuir.fatherName), 'conalep', this.orgName, this.codegroup, this.numberrequest, this.studentexternalmuir);
      this.newregister(this.userexternal, this.userexternal.password);
    }
  }

  /*
  metodo para agregar un alumno individualmente
  */
  newregister(user: any, password: any) {
    this.managerServices.createuserbymanager(user).subscribe(
      data => {
        this.persontmp = {
          nombreCompleto: this.personsinglemuir.name,
          apellidoPaterno: this.personsinglemuir.fatherName,
          apellidoMaterno: this.personsinglemuir.motherName,
          correoElectronico: this.personsinglemuir.email,
          contraseña: password
        };
        this.updateRequestManagerSingle(data.userid, this.persontmp);
      }, error => {
        console.log(error);
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

  public parsetypeStudent(type: string) {
    if (type === 'Docente' || type === 'docente') {
      return 'teacher';
    }
    if (type === 'alumno' || type === 'Alumno') {
      return 'student';
    }
    if (type === 'administrativo' || type === 'Administrativo') {
      return 'administrative';
    }
    if (type === 'Publico' || type === 'publico') {
      return 'public';
    }
    if (type === 'Privado' || type === 'privado') {
      return 'private';
    }
    if (type === 'Particular' || type === 'particular') {
      return 'particular';
    }
  }
}
