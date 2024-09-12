import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MessengerComponent } from '@components/messenger/messenger.component';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [MessengerComponent],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessagesComponent {}
