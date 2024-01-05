import { Pipe, PipeTransform } from '@angular/core';
import { SettingService } from '../services/setting.service';

@Pipe({
  name: 'defaultCurrency'
})

export class DefaultCurrencyPipe implements PipeTransform {
  constructor(private settingService: SettingService) { }

  transform(value: number, compact: boolean = false): string {

    if (compact) {
      let formatter = Intl.NumberFormat('en', {
        notation: 'compact',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      return formatter.format(value) + " " + this.settingService.getCurrentCompanyCurrency();
    }
    return Number(value).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + " " + this.settingService.getCurrentCompanyCurrency();
  }
}
