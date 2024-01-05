import { AbstractControl, ValidatorFn } from '@angular/forms';

export function phoneNumberValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const phoneNumberRegex = /^\+(?:[0-9] ?){10,14}[0-9]$/;
    const isValid = phoneNumberRegex.test(control.value);
    return isValid ? null : { invalidPhoneNumber: true };
  };
}
