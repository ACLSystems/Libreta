import { Answers, AnswersV1 } from './../../models/temp/answers';
import { AnswersAspects, AnswersTest } from './../../models/temp/answersTemp';
import { AnswersMG } from './../../models/temp/answersMG';
import { Attemp } from './../../models/course/attemp';
import { Component, Input, OnInit } from '@angular/core';
import { CourseService } from './../../shared/sharedservices/course.service';
import { DecimalPipe } from '@angular/common';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from './../../shared/sharedservices/user.service';

@Component({
  selector: 'app-block-questionnarie',
  templateUrl: './block-questionnarie.component.html',
  providers: [CourseService, UserService, DecimalPipe]
})
export class BlockQuestionnarieComponent implements OnInit {

  @Input() block: any;

  attemp: Attemp;
  identity: any;
  dataQuestionnarie: any;

  answerStudentQues: Answers [] = [];

  answerStudent: Answers [] = [];
  answersArray: Answers [] = [];

  answersArrayMG: AnswersMG [] = [];
  answerStudentMG: AnswersMG [] = [];
  answerstxttMG: AnswersMG;

  arrayAspect: AnswersTest [] = [];

  answersv1: AnswersV1;
  answersv1Array: AnswersV1 [] = [];

  answersStudentv1: AnswersV1;
  answersStudentv1Array: AnswersV1 [] = [];

  resultAnswerTestAtencion: AnswersTest;
  resultAnswerTestClaridad: AnswersTest;
  resultAnswerTestReparacion: AnswersTest;
  resultAnswersAspect: AnswersAspects;
  resultsArrayAnswersAspects: AnswersAspects [] = [];


  answersQuiz: any[] = [];
  questionsBlock: any[] = [];
  answerTest: any[] = [];

  gradefinal: number;
  grademinimun: number;
  grade: number;
  weight: number;
  attemps: number;
  maxAttempts: number;
  totalQuestions: number;

  resultQuestion = false;
  isValidateAttemp = false;

  groupid: any;
  blockidTo: any;
  label: any;

  closemodal: NgbModalRef;

  constructor(
    private course: CourseService,
    private userService: UserService,
    private modalService: NgbModal
    ) { }

  ngOnInit() {
    this.questions();
    this.identity = this.userService.getidentity();
  }

  /*
  Metodo para traer las respuestas del cuestionario
  */
  public questions() {
    let totalQuestions = 0;
    let indexquestions = 0;
    let index = 0;
    const arrayTemp: any[] = [];
    const arrayTempGM: any[] = [];
    if (this.block.data.questionnarie.maxAttempts === this.block.data.attempts) {
      this.isValidateAttemp = false;
    } else {
      this.isValidateAttemp = true;
    }

    if (this.block.data.questionnarie.type !== 'test') {
      this.grademinimun = this.block.data.questionnarie.minimum;
      for (const id of this.block.data.questionnarie.questions) {
        this.answersArray = [];
        const pivote = id.answers;
        const label = id.label;
        if (label !== null) {
          this.label = label;
        } else {
          this.label = null;
        }
        for (const idp of pivote) {
          if (id.type === 'option') {
            index = 0;
            const idquestion = id.id;
            const type = id.type;
            const answer = idp.index;
            this.answersArray.push({answer, type, index, indexquestions});
            this.answersv1 = new AnswersV1(idquestion, this.answersArray);
            this.answersv1Array.push(this.answersv1);
            totalQuestions++;
          }
          if (id.type === 'tf') {
            index = 0;
            const idquestion = id.id;
            const type = id.type;
            const answer = idp.tf;
            this.answersArray.push({answer, type, index, indexquestions});
            this.answersv1 = new AnswersV1(idquestion, this.answersArray);
            this.answersv1Array.push(this.answersv1);
            totalQuestions++;
          }

          if (id.type === 'text') {
            index = 0;
            const idquestion = id.id;
            const type = id.type;
            const answer = idp.text;
            this.answersArray.push({answer, type, index, indexquestions});
            this.answersv1 = new AnswersV1(idquestion, this.answersArray);
            this.answersv1Array.push(this.answersv1);
            totalQuestions++;
          }
          if (id.type === 'map' || id.type === 'group') {
            index = 0;
            const idquestion = id.id;
            const type = id.type;
            for (const answer of idp.group) {
              this.answersArray.push({answer, type, index, indexquestions});
              index ++;
              totalQuestions++;
            }
            this.answersv1 = new AnswersV1(idquestion, this.answersArray);
            this.answersv1Array.push(this.answersv1);
          }
          indexquestions++;
        }
      }
      this.weight = Math.round((100 / totalQuestions) * 100) / 100;
    } else {
      this.weight = 1;
      this.answerTest = this.block.data.questionnarie.diagnostic.aspects;
      this.answersv1Array = this.block.data.questionnarie.questions[0].group;
    }
    this.totalQuestions = totalQuestions;
  }

  /*
  Metodo para agregar las respuestas a un arreglo de tipo any
  */
  public getAnswer(idquestion: any, answer: string, type: any, index: any , indexquestions: number) {
    if (this.answerStudent.length > 0) {
      if (this.answerStudent.find(id => id.index === index && id.indexquestions === indexquestions)) {
// tslint:disable-next-line: max-line-length
        const indexRepeat = this.answerStudent.indexOf(this.answerStudent.find(id => id.index === index && id.indexquestions === indexquestions));
        this.answerStudent.splice(indexRepeat, 1);
        this.answerStudent.push({answer, type, index, indexquestions});
      } else {
        this.answerStudent.push({answer, type, index, indexquestions});
      }
    } else {
      this.answerStudent.push({answer, type, index, indexquestions});
    }
  }

  /*
  Metodo para calificar las preguntas del estudiante
  */
  public checkAnswersStudent(type: any) {
    this.answersQuiz  = [];
    this.answersStudentv1Array = [];
    this.gradefinal = 0;
    if (this.answersv1Array.length > 0 && type !== 'test') {
      for (const idAnsQue of this.answersv1Array) {
        this.answerStudentQues = [];
        for (const id of idAnsQue.result) {
          for (const idAnsStu of this.answerStudent) {
            if (id.type === idAnsStu.type && id.index === idAnsStu.index && id.indexquestions === idAnsStu.indexquestions) {
              const studenQuestion: Answers = new Answers(idAnsStu.answer, idAnsStu.type, idAnsStu.index, idAnsStu.indexquestions);
              this.answerStudentQues.push(studenQuestion);
              if ( ( idAnsStu.type === 'text' || idAnsStu.type === 'group') && this.filterString(id.answer, idAnsStu.answer)) {
                this.gradefinal++;
              } else if (id.answer === idAnsStu.answer) {
                this.gradefinal++;
              }
            }
          }
        }
        this.answersStudentv1 = new AnswersV1(idAnsQue.idquestion, this.answerStudentQues);
        this.answersStudentv1Array.push(this.answersStudentv1);
      }
      this.setGradesQuestionnarie(this.answersStudentv1Array, this.gradefinal);
    }
    if (this.answerStudent.length > 0 && type === 'test') {
      this.arrayAspect = [];
      this.resultsArrayAnswersAspects = [];
      let atencion = 0;
      let claridad = 0;
      let reparacion = 0;
      let genero = 0;
      for (const idAnswerTest of this.answerStudent) {
        if (idAnswerTest.type === 'option') {
          genero = idAnswerTest.answer;
        }
        if (idAnswerTest.indexquestions >= 0 && idAnswerTest.indexquestions <= 7 ) {
          atencion = atencion + idAnswerTest.answer;
        }
        if (idAnswerTest.indexquestions >= 8 && idAnswerTest.indexquestions <= 15) {
          claridad = claridad + idAnswerTest.answer;
        }
        if (idAnswerTest.indexquestions >= 16 && idAnswerTest.indexquestions <= 23) {
          reparacion = reparacion + idAnswerTest.answer;
        }
      }
      if (genero === 0) {
        this.resultAnswerTestAtencion = new AnswersTest('Atención', atencion);
        this.resultAnswerTestClaridad = new AnswersTest('Claridad', claridad);
        this.resultAnswerTestReparacion = new AnswersTest('Reparación', reparacion);
      } else if (genero === 1) {
        this.resultAnswerTestAtencion = new AnswersTest('Atención', atencion + 100);
        this.resultAnswerTestClaridad = new AnswersTest('Claridad', claridad + 100);
        this.resultAnswerTestReparacion = new AnswersTest('Reparación', reparacion + 100);
      }

      this.arrayAspect.push(this.resultAnswerTestAtencion);
      this.arrayAspect.push(this.resultAnswerTestClaridad);
      this.arrayAspect.push(this.resultAnswerTestReparacion);

      for (const idData of this.arrayAspect) {
        for (const id of this.answerTest) {
          if (id.name === idData.aspec) {
            for (const idEval of id.eval) {
              if (idData.result >= idEval.min && idData.result <= idEval.max) {
// tslint:disable-next-line: max-line-length
                this.resultAnswersAspect = new AnswersAspects (idEval._id, idEval.min, idEval.max, idData.aspec, idData.result, idEval.results);
                this.resultsArrayAnswersAspects.push(this.resultAnswersAspect);
              }
            }
          }
        }
      }
      this.gradefinal = 100;
      this.setGradesQuestionnarie(this.resultsArrayAnswersAspects, this.gradefinal);
    }
  }

  /*
  Metodo para setear las calificaciones del estudiante
  */
  setGradesQuestionnarie(answers: any, gradefinal: number) {
    this.grade = gradefinal * this.weight;
    if (this.grade >= this.grademinimun) {
      this.resultQuestion = true;
    } else {
      this.resultQuestion = false;
    }

    if (this.grade > 100 || this.grade >= 99.00) {
      this.grade = 100;
    }

    this.attemp = new Attemp(this.block.groupid, this.block.data.blockCurrentId, answers, this.grade);

    this.course.setAttempt(this.attemp).subscribe(data => {
      this.block.data.attempts++;
      if (this.maxAttempts === this.attemps) {
        this.isValidateAttemp = false;
      } else {
        this.isValidateAttemp = true;
      }
    });
  }

  /*
  Funcion de modal para validar las respuestas del usuario
  */
  public showAccept(content: any) {
    this.closemodal = this.modalService.open(content, {size: 'lg'});
  }

  /*
  Metodo para cerrar el modal del cuestionario
  */
  closeDialog() {
    this.closemodal.dismiss();
  }

  /*
  funcion para quitar los espacios en blanco, capitalizar y unificar un solo simbolo
  */
  public filterString(answerQuestion: string, answerStudent: string): boolean {
    if (Array.isArray(answerQuestion)) {
      return answerQuestion.find(idaq => idaq.normalize('NFD').replace(/\W/g, '') === answerStudent.normalize('NFD').replace(/\W/g, ''));
    } else {
      return answerQuestion.normalize('NFD').replace(/\W/g, '') === answerStudent.normalize('NFD').replace(/\W/g, '');
    }
  }
}
