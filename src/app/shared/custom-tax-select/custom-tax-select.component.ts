import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from '@angular/forms';
import { Tax } from 'src/app/core/models/tax';


@Component({
  selector: 'app-custom-tax-select',
  templateUrl: './custom-tax-select.component.html',
  styleUrls: ['./custom-tax-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: CustomTaxSelectComponent
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: CustomTaxSelectComponent
    }
  ]

})

export class CustomTaxSelectComponent implements ControlValueAccessor, Validator {
  public className = "";

  @ViewChild('searchElement')
  searchElement!: ElementRef;

  @Input()
  title = "Select value...";

  @Input()
  strLimit = 3000;

  @Input()
  createNewText?: string;

  @Input()
  isDisabled = false;

  @Input()
  public options!: Array<Tax>;

  @Output()
  onClickCreateNew = new EventEmitter();

  public selectTax?: Tax;

  public searchKey = "";
  public filteredOptions: any;


  constructor() {
    this.className = "item_" + (Math.floor(Math.random() * (9999999 - 1111111) + 1111111)).toString();
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

  removeSelected(event: any) {
    event.stopPropagation();
    this.markAsTouched();
    this.selectTax = undefined;
    this.onChange(this.selectTax);
  }

  onOpenDropdown() {
    this.searchKey = '';
    this.filteredOptions = this.options;
    setTimeout(() => {
      this.searchElement.nativeElement.focus();
      this.scrollToView();
    }, 100)
  }

  search() {
    const key = this.searchKey.trim();
    if (key.length >= 1 && this.options.length) {
      if (this.options[0].name) {
        this.filteredOptions = this.options.filter((a) => a.name.toLowerCase().indexOf(key.toLowerCase()) >= 0);
      } else {
        this.filteredOptions = this.options.filter((a) => a.rate.toString().toLowerCase().indexOf(key.toLowerCase()) >= 0);
      }
    } else {
      this.filteredOptions = this.options;
    }
  }

  onChange = (customSelectOption: Tax | undefined) => { };

  onTouched = () => { };

  touched = false;

  disabled = false;


  onItemClick(customSelectOption: Tax) {
    this.markAsTouched();
    if (!this.disabled) {
      if (this.selectTax?.uuid === customSelectOption.uuid) {
        this.selectTax = undefined;
      } else {
        this.selectTax = customSelectOption;
      }
      this.onChange(this.selectTax);
    }
  }

  writeValue(customSelectOption: Tax) {
    this.selectTax = customSelectOption;
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
    if (this.selectTaxIsNotset()) {
      return null;
    }
    return null;
  }

  selectTaxIsNotset() {
    return this.selectTax === null || this.selectTax === undefined || this.selectTax.uuid === undefined || this.selectTax.uuid === null;
  }

  createNewClicked() {
    this.onClickCreateNew.emit();
  }
}
