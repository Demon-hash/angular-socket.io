import type { Routes } from '@angular/router';

export const enum AppRoutesEnum {
  root = '',
  messages = 'messages',
  login = 'login',
  register = 'register',
}

export const routes: Routes = [
  {
    path: AppRoutesEnum.root,
    pathMatch: 'full',
    redirectTo: AppRoutesEnum.messages,
  },
  {
    path: AppRoutesEnum.messages,
    loadComponent: () =>
      import('../pages/messages/messages.component').then(
        (c) => c.MessagesComponent,
      ),
  },
  {
    path: AppRoutesEnum.login,
    loadComponent: () =>
      import('../pages/login/login.component').then((c) => c.LoginComponent),
  },
  {
    path: AppRoutesEnum.register,
    loadComponent: () =>
      import('../pages/register/register.component').then(
        (c) => c.RegisterComponent,
      ),
  },
];
