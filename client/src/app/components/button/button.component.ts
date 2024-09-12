import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  @Input({ alias: 'type', required: true })
  type!: 'button' | 'submit';

  @Input({ alias: 'label', required: true })
  label!: string;

  @Input({ alias: 'severity' })
  severity: 'primary' | 'secondary' = 'primary';

  @Input({ alias: 'disabled' })
  disabled?: boolean | null;

  @Output()
  click = new EventEmitter<unknown>();

  protected SEVERITY_CLASSES = {
    primary:
      'text-white bg-green-700 hover:bg-green-800 disabled:text-gray-500 disabled:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center',
    secondary:
      'text-white bg-gray-500 hover:bg-gray-500 focus:ring-4 focus:outline-none focus:ring-gray-400 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center',
  } as const;

  protected onClick(event: Event) {
    this.click.emit(event);
  }
}
