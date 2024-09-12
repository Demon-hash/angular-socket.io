import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type { UserModel } from '@models/user.model';
import type { UserRegisterDto } from '../DTO/user-register.dto';
import type { UserLoginDto } from '../DTO/user-login.dto';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly _http = inject(HttpClient);

  login(dto: UserLoginDto) {
    return this._http.post<UserModel>('login', dto);
  }

  register(dto: UserRegisterDto) {
    return this._http.post<UserModel>('register', dto);
  }
}
