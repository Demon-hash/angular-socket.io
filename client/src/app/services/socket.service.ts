import { inject, Injectable, type OnDestroy } from '@angular/core';
import { io } from 'socket.io-client';
import { BehaviorSubject } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { AUTH_TOKEN } from '@constants';
import { environment } from '@environment';
import type { MessageModel } from '@models/message.model';
import type { UserModel } from '@models/user.model';

const Events = {
  online_rooms: 'online_rooms',
  session: 'session',
  private_message: 'private_message',
  room_registered: 'room_registered',
};

@Injectable({
  providedIn: 'root',
})
export class SocketService implements OnDestroy {
  private readonly _cookies = inject(CookieService);
  private readonly _socket = io(environment.socket, {
    extraHeaders: {
      authorization: `Bearer ${this._cookies.get(AUTH_TOKEN)}`,
    },
  });

  private readonly _session$ = new BehaviorSubject<string>('');
  private readonly _onlineSessions$ = new BehaviorSubject<string[]>([]);
  private readonly _rooms = new BehaviorSubject<UserModel[]>([]);

  readonly sessionId$ = this._session$.asObservable();
  readonly onlineSessions$ = this._onlineSessions$.asObservable();
  readonly rooms$ = this._rooms.asObservable();

  readonly messages$ = new BehaviorSubject<MessageModel[]>([]);

  constructor() {
    this._listenForSessionId();
    this._listenForPrivateMessages();
    this._listenForOnlineUsers();
    this._listenForUserRegistered();
  }

  private _listenForOnlineUsers() {
    this._socket.on(Events.online_rooms, (sessions: string[]) => {
      this._onlineSessions$.next(sessions);
    });
  }

  private _listenForSessionId() {
    this._socket.on(Events.session, (sessionId: string) => {
      this._session$.next(sessionId);
    });
  }

  private _listenForPrivateMessages() {
    this._socket.on(Events.private_message, (message) => {
      this.messages$.next([...this.messages$.value, message]);
    });
  }

  private _listenForUserRegistered() {
    this._socket.on(Events.room_registered, (rooms: UserModel[]) => {
      this._rooms.next(rooms);
    });
  }

  sendPrivateMessage(message: string, to: number) {
    this._socket.emit(Events.private_message, { message, to });
  }

  roomRegistered(user?: UserModel) {
    this._socket.emit(Events.room_registered, user);
  }

  ngOnDestroy() {
    Object.values(Events).forEach((event) => this._socket.off(event));
    this._socket.close();
    this._session$.complete();
  }
}
