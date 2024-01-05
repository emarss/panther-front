import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
} from '@angular/forms';

@Component({
  selector: 'app-custom-multi-select',
  templateUrl: './custom-multi-select.component.html',
  styleUrls: ['./custom-multi-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: CustomMultiSelectComponent,
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: CustomMultiSelectComponent,
    },
  ],
})
export class CustomMultiSelectComponent
  implements ControlValueAccessor, Validator
{
  @ViewChild('searchElement')
  searchElement!: ElementRef;

  @Input()
  title = 'Select value...';

  @Input()
  isDisabled = false;

  @Input()
  createSection!: string;

  @Input()
  public options!: Array<CustomSelectOption>;

  @Input()
  createNewText?: string;

  @Output()
  onClickCreateNew = new EventEmitter();

  public selectedSelectItems!: Array<CustomSelectOption>;

  public searchKey = '';
  public filteredOptions: any;

  constructor() {}

  ngOnInit(): void {
    this.filteredOptions = this.options;
  }

  onOpenDropdown() {
    this.searchKey = '';
    this.filteredOptions = this.options;
    setTimeout(() => {
      this.searchElement.nativeElement.focus();
    }, 100);
  }

  search() {
    const key = this.searchKey.trim();
    if (key.length >= 1) {
      this.filteredOptions = this.options.filter(
        (a) => a.name.toLowerCase().indexOf(key.toLowerCase()) >= 0
      );
    } else {
      this.filteredOptions = this.options;
    }
  }

  onChange = (customSelectOption: Array<CustomSelectOption>) => {};

  onTouched = () => {};

  touched = false;

  disabled = false;

  onItemClick(customSelectOption: CustomSelectOption) {
    this.markAsTouched();
    if (!this.disabled) {
      if (this.selectedSelectItemHasItem(customSelectOption)) {
        this.selectedSelectItems = this.selectedSelectItems.filter(
          (el) => el.value !== customSelectOption.value
        );
      } else {
        this.selectedSelectItems.push(customSelectOption);
      }
      this.onChange(this.selectedSelectItems);
    }
  }

  public selectedSelectItemHasItem(customSelectOption: CustomSelectOption) {
    return this.selectedSelectItems.find(
      (el) => el.value === customSelectOption.value
    );
  }

  writeValue(customSelectOption: Array<CustomSelectOption>) {
    this.selectedSelectItems = customSelectOption;
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

  createNewClicked() {
    this.onClickCreateNew.emit();
  }

  validate(control: AbstractControl): ValidationErrors | null {
    // const customSelectOption = control.value;
    // if (this.selectedSelectItems.find((el) => { return this.options.find((res) => { return el.value === res.value }) === undefined })) {
    //   return {
    //     itemOutOfRange: {
    //       customSelectOption
    //     }
    //   };
    // }
    return null;
  }

  selectedSelectItemIsNotset() {
    return (
      this.selectedSelectItems === null ||
      this.selectedSelectItems.length == 0 ||
      this.selectedSelectItems === undefined
    );
  }
}

export class CustomSelectOption {
  value: any;
  name: any;
}
