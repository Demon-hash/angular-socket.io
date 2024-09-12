import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '@services/auth.service';
import { BehaviorSubject, catchError, EMPTY, timeout } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CookieService } from 'ngx-cookie-service';
import { AUTH_TOKEN } from '@constants';
import { Router, RouterLink } from '@angular/router';
import { AppRoutesEnum } from '@routes/app.routes';
import { TextInputComponent } from '@components/text-input/text-input.component';
import { ButtonComponent } from '@components/button/button.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    AsyncPipe,
    RouterLink,
    TextInputComponent,
    ButtonComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private readonly _fbs = inject(FormBuilder);
  private readonly _auth = inject(AuthService);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _cookies = inject(CookieService);
  private readonly _router = inject(Router);

  readonly REGISTER_URL = AppRoutesEnum.register as const;

  readonly form = this._fbs.group({
    email: [null, [Validators.required, Validators.email]],
    password: [null, Validators.required],
  });

  readonly loading$ = new BehaviorSubject<boolean>(false);

  login() {
    if (this.form.invalid || this.loading$.value) {
      return;
    }

    this.loading$.next(true);
    this._auth
      .login(this.form.value)
      .pipe(
        timeout(15000),
        catchError(() => {
          this.loading$.next(false);
          return EMPTY;
        }),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe((user) => {
        this.loading$.next(false);
        this._cookies.set(AUTH_TOKEN, user.token!);
        void this._router.navigate([AppRoutesEnum.messages]);
      });
  }
}
