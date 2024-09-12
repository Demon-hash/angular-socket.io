import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MyActiveRoomsComponent } from '@components/my-active-rooms/my-active-rooms.component';
import { MessagesListComponent } from '@components/messages-list/messages-list.component';
import type { UserModel } from '@models/user.model';

@Component({
  selector: 'app-messenger',
  standalone: true,
  imports: [MyActiveRoomsComponent, MessagesListComponent],
  templateUrl: './messenger.component.html',
  styleUrl: './messenger.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessengerComponent {
  room?: Partial<UserModel>;
}
