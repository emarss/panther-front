import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
} from '@angular/forms';

@Component({
  selector: 'app-pagination-select',
  templateUrl: './pagination-select.component.html',
  styleUrls: ['./pagination-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: PaginationSelectComponent,
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: PaginationSelectComponent,
    },
  ],
})
export class PaginationSelectComponent
  implements ControlValueAccessor, Validator {
  @Input()
  public options!: Array<any>;

  @Input()
  public selectedOption!: any;

  constructor() { }

  ngOnInit(): void { }

  onChange = (option: any) => { };

  onTouched = () => { };

  touched = false;

  disabled = false;

  onItemClick(option: any) {
    this.markAsTouched();
    if (!this.disabled) {
      this.selectedOption = option;
      this.onChange(this.selectedOption);
    }
  }

  writeValue(option: any) {
    this.selectedOption = option;
  }

  registerOnChange(onChange: any) {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: any) {
    this.onTouched = onTouched;
  }

  markAsTouched() {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }

  setDisabledState(disabled: boolean) {
    this.disabled = disabled;
  }

  validate(control: AbstractControl): ValidationErrors | null {
    const option = control.value;
    if (this.options.indexOf(option) === -1) {
      return {
        itemOutOfRange: {
          option,
        },
      };
    }
    return null;
  }
}
