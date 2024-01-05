import { Directive, ElementRef } from '@angular/core';
import { PermissionService } from '../services/permission.service';

@Directive({
  selector: '[appExchangeRatePermission]'
})
export class ExchangeRatePermissionDirective {

  constructor(private elementRef: ElementRef, private permissionService: PermissionService) {

  }

  ngOnInit() {
    if (this.permissionService.checkPermissionsForSection('exchange_rates', 4) === false) {
      this.elementRef.nativeElement.setAttribute('readonly', 'true');
    }
  }

}
