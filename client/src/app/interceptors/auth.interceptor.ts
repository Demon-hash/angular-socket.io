import {
  HttpErrorResponse,
  type HttpHandlerFn,
  type HttpInterceptorFn,
  type HttpRequest,
  HttpStatusCode,
} from '@angular/common/http';
import { AUTH_TOKEN } from '@constants';
import { CookieService } from 'ngx-cookie-service';
import { inject } from '@angular/core';
import { catchError } from 'rxjs';
import { Router } from '@angular/router';
import { AppRoutesEnum } from '../routes/app.routes';
import { environment } from '@environment';

export const authenticationInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) => {
  const cookies = inject(CookieService);
  const router = inject(Router);
  const token = cookies.get(AUTH_TOKEN);

  return next(
    req.clone({
      url: `${environment.api}/${req.url}`,
      headers: req.headers.set('Authorization', `Bearer ${token}`),
    }),
  ).pipe(
    catchError((error) => {
      if (error instanceof HttpErrorResponse) {
        const redirect = [
          HttpStatusCode.Unauthorized,
          HttpStatusCode.Forbidden,
        ].includes(error.status);

        if (redirect) {
          void router.navigate([AppRoutesEnum.login], {
            replaceUrl: true,
          });
        }
      }

      throw error;
    }),
  );
};
