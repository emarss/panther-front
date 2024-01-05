import { Directive, ElementRef, Input } from '@angular/core';
import { SettingService } from '../services/setting.service';

@Directive({
  selector: '[appExchangeRateFlat]'
})
export class ExchangeRateFlatDirective {
  @Input() rate!: number;

  constructor(private elementRef: ElementRef) {
  }

  ngOnInit() {
    if (this.rate == 1) {
      this.elementRef.nativeElement.style.display = 'none';
    }
  }
}
