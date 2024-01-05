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
import { CustomSelectOption } from 'src/app/core/interfaces/custom-select-option';

@Component({
  selector: 'app-custom-select',
  templateUrl: './custom-select.component.html',
  styleUrls: ['./custom-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: CustomSelectComponent,
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: CustomSelectComponent,
    },
  ],
})
export class CustomSelectComponent implements ControlValueAccessor, Validator {
  public className = '';

  @ViewChild('searchElement')
  searchElement!: ElementRef;

  @Input()
  title = 'Select value...';

  @Input()
  createSection!: string;

  @Input()
  strLimit = 3000;

  @Input()
  createNewText?: string;

  @Input()
  isDisabled = false;

  @Input()
  public options!: Array<CustomSelectOption>;

  @Output()
  onClickCreateNew = new EventEmitter();

  public selectedSelectItem?: CustomSelectOption;

  public searchKey = '';
  public filteredOptions: any;

  constructor() {
    this.className =
      'item_' +
      Math.floor(Math.random() * (9999999 - 1111111) + 1111111).toString();
  }

  ngOnInit(): void {
    this.filteredOptions = this.options;
  }

  scrollToView(): void {
    const elementList = document.querySelector('.' + this.className);
    const element = elementList as HTMLElement;
    if (element) {
      element.scrollIntoView({ behavior: 'auto', block: 'nearest' });
    }
  }

  onOpenDropdown() {
    this.searchKey = '';
    this.filteredOptions = this.options;
    setTimeout(() => {
      this.searchElement.nativeElement.focus();
      this.scrollToView();
    }, 100);
  }

  search() {
    const key = this.searchKey.trim();
    if (key.length >= 1 && this.options.length) {
      if (this.options[0].searchString) {
        this.filteredOptions = this.options.filter(
          (a) => a.searchString.toLowerCase().indexOf(key.toLowerCase()) >= 0
        );
      } else {
        this.filteredOptions = this.options.filter(
          (a) => a.name.toLowerCase().indexOf(key.toLowerCase()) >= 0
        );
      }
    } else {
      this.filteredOptions = this.options;
    }
  }

  onChange = (customSelectOption: CustomSelectOption | undefined) => {};

  onTouched = () => {};

  touched = false;

  disabled = false;

  onItemClick(customSelectOption: CustomSelectOption) {
    this.markAsTouched();
    if (!this.disabled) {
      if (this.selectedSelectItem?.value === customSelectOption.value) {
        this.selectedSelectItem = undefined;
      } else {
        this.selectedSelectItem = customSelectOption;
      }
      this.onChange(this.selectedSelectItem);
    }
  }

  removeSelected(event: any) {
    event.stopPropagation();
    this.markAsTouched();
    this.selectedSelectItem = undefined;
    this.onChange(this.selectedSelectItem);
  }

  writeValue(customSelectOption: CustomSelectOption) {
    this.selectedSelectItem = customSelectOption;
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
    if (this.selectedSelectItemIsNotset()) {
      return null;
    }
    return null;
  }

  selectedSelectItemIsNotset() {
    return (
      this.selectedSelectItem === null ||
      this.selectedSelectItem === undefined ||
      this.selectedSelectItem.value === undefined ||
      this.selectedSelectItem.value === null
    );
  }

  createNewClicked() {
    this.onClickCreateNew.emit();
  }
}
