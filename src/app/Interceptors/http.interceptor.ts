import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpInterceptor, HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ErrorService } from './../error/error.service';
import * as jwt_decode from 'jwt-decode';

@Injectable()

export class HttpConfigInterceptor implements HttpInterceptor{
  constructor(public errorService:ErrorService, private router: Router) { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token: string = localStorage.getItem('token');
    if (token) {
			let decodedToken = this.getDecodedAccessToken(token);
			let exp: Date = new Date(0);
			exp.setSeconds(decodedToken.exp);
			let now: Date = new Date();
			const identity: any = localStorage.getItem('identity');
			if(!identity) {
				localStorage.removeItem('identity');
				localStorage.removeItem('token');
				localStorage.clear();
			}
			if(now < exp){
	      //request = request.clone({ headers: request.headers.set('x-access-token', token) });
				request = request.clone({ headers: request.headers.set('Authorization', 'Bearer ' + token) });
			}
    }
		if(!request.url.match(/upload/)) {
			if (!request.headers.has('Content-Type')) {
	      request = request.clone({ headers: request.headers.set('Content-Type', 'application/json') });
	    }
		}
    request = request.clone({ headers: request.headers.set('Accept', 'application/json') });
    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          //console.log(event);
        }
        return event;
      }),
      catchError((error: HttpErrorResponse) => {
				if(error.error.message === 'Error 205: User not authorized' || // Con estatus 403
					error.error.message === 'Error 200: Missing token' || // Con estatus 401
					error.error.message === 'Error 204: Token expired' || // Con estatus 403
					error.error.message === 'Token expirado. Favor de iniciar sesión' ||// Con estatus 401
					error.status === 401
			) {
					//localStorage.removeItem('identity');
			    //localStorage.removeItem('token');
			    //localStorage.clear();
					console.log(error);
					if(error.error && error.error.message) {
						console.log(request.url);
						if(!request.url.match(/login/) && !request.url.match(/recover/)) {
							window.alert(error.error.message);
						}
					}
					this.router.navigate(['/login']);
				} else if(error.status === 0) { // Está offline
					this.router.navigate(['/offline']);
				} else {
	        console.log(error);
	        return throwError(error);
				}
      })
    );
  }
	getDecodedAccessToken(token: string): any {
		try {
			return jwt_decode(token);
		} catch (err)  {
			return null;
		}
	}
}
