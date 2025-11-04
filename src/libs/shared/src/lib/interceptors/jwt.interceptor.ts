import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const jwtInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const router = inject(Router);
  const token = localStorage.getItem('authToken');

  // Clone the request and add the authorization header if token exists
  let authReq = req;
  if (token && !req.url.includes('/auth/')) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(authReq).pipe(
    catchError((error) => {
      if (error.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('authToken');
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};