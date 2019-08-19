import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpInterceptor, HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ErrorService } from './../error/error.service';

@Injectable()

export class HttpConfigInterceptor implements HttpInterceptor{
  constructor(public errorService:ErrorService, private router: Router) { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token: string = localStorage.getItem('token');
    //console.log(token)
    if (token) {
      request = request.clone({ headers: request.headers.set('x-access-token', token) });
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
					error.error.message === 'Error 204: Token expired' // Con estatus 403
			) {
					//localStorage.removeItem('identiti');
			    //localStorage.removeItem('token');
			    //localStorage.clear();
					this.router.navigate(['/home']);
				} else {
	        console.log(error);
	        return throwError(error);
				}
      })
    );
  }
}
