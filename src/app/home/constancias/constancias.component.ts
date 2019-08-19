import { Component, OnInit, LOCALE_ID } from '@angular/core';
import { HomeService } from '../homeservices/home.service';
import { registerLocaleData } from '@angular/common';
import { interval, Subscription, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import localeMx from '@angular/common/locales/es-MX';

registerLocaleData(localeMx, 'es-Mx');

@Component({
  selector: 'app-constancias',
  templateUrl: './constancias.component.html',
  styleUrls: ['./constancias.component.css'],
	providers: [ { provide: LOCALE_ID, useValue: 'es-Mx'}]
})
export class ConstanciasComponent implements OnInit {

	buscando: boolean;
	messageError: string;
	busqueda: boolean;
	updateDisable: boolean;
	secondsDisable: number;
	segundos: number;
	certificate: {
		courseName: string,
		courseImage: string,
		courseDuration: number,
		courseDurationUnits: string,
		courseBeginDate: any,
		courseEndDate: any,
		studentName: string,
		finalGrade: number,
		passDate: any,
		certificateNumber: number
	}
	certificateFound: boolean;
	private updateDisableSubscription: Subscription;

  constructor(private homeService: HomeService) { }

  ngOnInit() {
		this.buscando = false;
		this.certificateFound = false;
		this.busqueda = false;
		this.updateDisable = false;
  }

	searchCertificate(folio:number) {
		this.secondsDisable = 10000; // 10 segundos
		this.segundos = 10; // 10 veces
		const secondsCounter = interval(this.secondsDisable / this.segundos); // Intervalo que va a contar con intervalos de un segundo
		let numero = 9; // veces + 1 que vamos a contar
		const timer$ = timer(this.secondsDisable); // este va a servir para deshabilitar la suscripción secondsCounter
		this.updateDisableSubscription = interval(this.secondsDisable).subscribe(() => {
			this.updateDisable = false;
			this.updateDisableSubscription.unsubscribe();
		})
		secondsCounter.pipe(takeUntil(timer$)).subscribe( n => this.segundos = numero - n);
		this.buscando = true;
		this.certificateFound = false;
		this.messageError = '';

		this.busqueda = false;
		this.homeService.getCertificate(folio).subscribe((data:any) => {
			if(data) {
				let message = data.message;
				//console.log(message);
				if(message == 'No hay certificado con ese número de folio') {
					this.messageError	= message;
				} else {
					this.certificate = {
						courseName: message.courseName,
						courseImage: message.courseImage,
						courseDuration: message.courseDuration,
						courseDurationUnits: message.courseDurationUnits,
						courseBeginDate: new Date(message.courseBeginDate),
						courseEndDate: new Date(message.courseEndDate),
						studentName: message.studentName,
						finalGrade: message.finalGrade,
						passDate: new Date(message.passDate),
						certificateNumber: folio
					}
					this.certificateFound = true;
				}
			}
			this.updateDisable = true;
			this.buscando = false;
			this.busqueda = true;
		}, error => {
			console.log(error);
		});
	}

}
