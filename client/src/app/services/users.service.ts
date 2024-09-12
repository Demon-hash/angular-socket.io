import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type { UserModel } from '@models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private readonly _http = inject(HttpClient);

  getUsers() {
    return this._http.post<UserModel[]>('users', {});
  }
}
