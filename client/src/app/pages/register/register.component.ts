import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
} from '@angular/core';
import { AsyncPipe } from '@angular/common';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '@services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { Router, RouterLink } from '@angular/router';
import { BehaviorSubject, catchError, EMPTY, timeout } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AUTH_TOKEN } from '@constants';
import { AppRoutesEnum } from '@routes/app.routes';
import { TextInputComponent } from '@components/text-input/text-input.component';
import { ButtonComponent } from '@components/button/button.component';
import { SocketService } from '@services/socket.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    AsyncPipe,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    TextInputComponent,
    ButtonComponent,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  private readonly _authService = inject(AuthService);
  private readonly _cookiesService = inject(CookieService);
  private readonly _socketService = inject(SocketService);
  private readonly _fbs = inject(FormBuilder);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _router = inject(Router);

  readonly LOGIN_URL = AppRoutesEnum.login as const;

  readonly form = this._fbs.group({
    firstName: [null, Validators.required],
    lastName: [null, Validators.required],
    email: [null, [Validators.required, Validators.email]],
    password: [null, Validators.required],
  });

  readonly loading$ = new BehaviorSubject<boolean>(false);

  register() {
    if (this.form.invalid || this.loading$.value) {
      return;
    }

    this.loading$.next(true);
    this._authService
      .register(this.form.value)
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
        this._socketService.roomRegistered(user);
        this._cookiesService.set(AUTH_TOKEN, user.token!);
        void this._router.navigate([AppRoutesEnum.messages]);
      });
  }
}
