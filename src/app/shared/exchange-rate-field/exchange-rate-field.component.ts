import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from '@angular/forms';
import { SettingService } from 'src/app/core/services/setting.service';

@Component({
  selector: 'app-exchange-rate-field',
  templateUrl: './exchange-rate-field.component.html',
  styleUrls: ['./exchange-rate-field.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: ExchangeRateFieldComponent
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: ExchangeRateFieldComponent
    }
  ]

})

export class ExchangeRateFieldComponent implements ControlValueAccessor, Validator {
  @Input()
  title = "Enter Exchange Rate...";

  @Input()
  isDisabled = false;

  @Input()
  public currency?: string;
  public defaultCurrency: string;


  public value?: number;
  public inverse?: number;


  constructor(private settingService: SettingService) {
    this.defaultCurrency = this.settingService.getCurrentCompanyCurrency()
  }

  ngOnInit(): void {
  }

  onChange = (val: number | undefined) => {
    this.updateInverse();
  };

  onTouched = () => { };

  touched = false;

  disabled = false;

  writeValue(val: number) {
    this.value = val;
    this.updateInverse();
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
    return null;
  }

  updateInverse() {
    if (this.value) {
      this.inverse = Math.round((1 / this.value) * 100) / 100;
    }
  }

  updateValue() {
    if (this.inverse) {
      this.value = 1 / this.inverse;
      this.onChange(this.value);
    }
  }
}
