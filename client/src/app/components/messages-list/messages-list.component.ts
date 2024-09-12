import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  ViewChild,
} from '@angular/core';
import { SocketService } from '@services/socket.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import type { UserModel } from '@models/user.model';

@Component({
  selector: 'app-messages-list',
  standalone: true,
  imports: [AsyncPipe, ReactiveFormsModule],
  templateUrl: './messages-list.component.html',
  styleUrl: './messages-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessagesListComponent {
  @Input()
  selectedRoom?: Partial<UserModel>;

  @ViewChild('message')
  message?: HTMLTextAreaElement;

  private readonly _socketService = inject(SocketService);
  private readonly _fb = inject(FormBuilder);

  readonly form = this._fb.group({
    message: [null, [Validators.required]],
  });

  readonly messages$ = this._socketService.messages$;
  readonly sessionId$ = this._socketService.sessionId$;

  onKeyUp(event: KeyboardEvent) {
    const key = event.key.toLowerCase();
    const message = this.form.value?.message ?? '';
    const to = this.selectedRoom?.id;
    const isEmptyMessage = message.replace(/\s/g, '').length === 0;
    const isInvalidReceiver =
      typeof to !== 'number' || !Number.isSafeInteger(to) || Number.isNaN(to);

    if (key === 'enter') {
      if (isEmptyMessage || isInvalidReceiver) {
        event.preventDefault();
        return;
      }

      if (event.shiftKey) {
        return;
      }

      event.preventDefault();
      this._socketService.sendPrivateMessage(message, to);
      this.form.reset();
    }
  }
}
