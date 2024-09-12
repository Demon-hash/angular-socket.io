import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  type OnInit,
  Output,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject, catchError, combineLatestWith, EMPTY } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { SocketService } from '@services/socket.service';
import type { UserModel } from '@models/user.model';

@Component({
  selector: 'app-my-active-rooms',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './my-active-rooms.component.html',
  styleUrl: './my-active-rooms.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyActiveRoomsComponent implements OnInit {
  @Output()
  onRoomSelected = new EventEmitter<UserModel>();

  private readonly _socketService = inject(SocketService);
  private readonly _destroyRef = inject(DestroyRef);

  readonly rooms$ = new BehaviorSubject<UserModel[]>([]);
  readonly sessionId$ = this._socketService.sessionId$;

  private _getRooms() {
    this._socketService.rooms$
      .pipe(
        combineLatestWith(this._socketService.onlineSessions$),
        catchError(() => {
          return EMPTY;
        }),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe(([rooms, sessions]) => {
        this._updateRooms(rooms, sessions);
      });
  }

  private _getSessions() {
    this._socketService.onlineSessions$
      .pipe(
        catchError(() => {
          return EMPTY;
        }),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe((sessions) => {
        this._updateRooms(this.rooms$.value, sessions);
      });
  }

  private _updateRooms(rooms: UserModel[], sessions: string[]) {
    const onlineList = sessions.reduce(
      (acc, curr) => ((acc[curr] = true), acc),
      {} as Record<string, boolean>,
    );

    const roomsWithStatus = rooms.map(({ id, ...rest }) => ({
      id,
      ...rest,
      online: !!onlineList?.[`user-${id}`],
    }));

    this.rooms$.next(roomsWithStatus);
  }

  ngOnInit() {
    this._getRooms();
    this._getSessions();
  }

  selectRoom(room: UserModel) {
    this.onRoomSelected.emit(
      this.rooms$.value.find(({ id }) => id === room.id),
    );
  }
}
