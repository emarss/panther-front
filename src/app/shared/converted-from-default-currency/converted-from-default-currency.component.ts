import { Component, Input } from '@angular/core';
import { SettingService } from 'src/app/core/services/setting.service';

@Component({
  selector: 'app-converted-from-default-currency',
  templateUrl: './converted-from-default-currency.component.html',
  styleUrls: ['./converted-from-default-currency.component.scss']
})
export class ConvertedFromDefaultCurrencyComponent {
  @Input() amount!: number;
  @Input() exchange_rate!: number;
  @Input() currency!: string;

  defaultCurrency !: string;
  constructor(
    private settingService: SettingService
  ) {
    this.defaultCurrency = this.settingService.getCurrentCompanyCurrency();
  }
}
