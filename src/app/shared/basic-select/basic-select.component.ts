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
  selector: 'app-basic-select',
  templateUrl: './basic-select.component.html',
  styleUrls: ['./basic-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: BasicSelectComponent,
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: BasicSelectComponent,
    },
  ],
})
export class BasicSelectComponent implements ControlValueAccessor, Validator {
  @Input()
  title = 'Select option...';

  public className = "";

  @Input()
  public options!: Array<string>;

  @Input()
  public selectedOption?: string = '';

  @Input()
  isDisabled = false;

  constructor() {
    this.className = "item_" + (Math.floor(Math.random() * (9999999 - 1111111) + 1111111)).toString();
  }

  ngOnInit(): void {
  }

  onChange = (option: string | undefined) => {

  };

  onTouched = () => { };

  touched = false;

  disabled = false;

  onItemClick(option: string) {
    this.markAsTouched();
    if (!this.disabled) {
      this.selectedOption = option;
      this.onChange(this.selectedOption);
    }
  }


  scrollToView(): void {
    const elementList = document.querySelector('.' + this.className);
    const element = elementList as HTMLElement;

    if (element) {
      element.scrollIntoView({ behavior: 'auto', block: 'nearest' });
    }
  }

  onOpenDropdown() {
    setTimeout(() => {
      this.scrollToView();
    }, 100)
  }

  removeSelected(event: any) {
    event.stopPropagation();
    this.markAsTouched();
    this.selectedOption = undefined;
    this.onChange(this.selectedOption);
  }

  writeValue(option: string) {
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
    if (this.selectedOptionIsNotset()) {
      return null;
    }
    // if (this.options.indexOf(option) === -1) {
    //   return {
    //     itemOutOfRange: {
    //       option,
    //     },
    //   };
    // }
    return null;
  }

  selectedOptionIsNotset() {
    return (
      this.selectedOption === null ||
      this.selectedOption === undefined ||
      this.selectedOption.trim() === ''
    );
  }
}
