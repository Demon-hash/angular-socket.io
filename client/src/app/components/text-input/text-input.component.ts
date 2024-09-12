import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import {
  type FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { getControlErrorName } from '@helpers/getControlErrorName';

@Component({
  selector: 'app-text-input',
  standalone: true,
  imports: [AsyncPipe, ReactiveFormsModule],
  templateUrl: './text-input.component.html',
  styleUrl: './text-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextInputComponent {
  protected readonly Validators = Validators;
  protected readonly getControlErrorName = getControlErrorName;

  @Input({ alias: 'id', required: true })
  id!: string;

  @Input({ alias: 'label', required: true })
  label!: string;

  @Input({ alias: 'group', required: true })
  group!: FormGroup;

  @Input({ alias: 'control', required: true })
  control!: string;
}
