import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  public user!: User;

  constructor(
    private authService: AuthService
  ) {
    this.user = this.authService.getCurrentUserFromLocal();
  }

  checkPermissionsForSection(section: string, permission: number): boolean {

    //TODO: here
    let res = true;
    switch (section) {
      case "items":
        res = this.user.permissions?.items != null && this.user.permissions?.items >= permission;
        break;
      case "purchase_orders":
        res = this.user.permissions?.purchase_orders != null && this.user.permissions?.purchase_orders >= permission;
        break;
      case "stock_issues":
        res = this.user.permissions?.stock_issues != null && this.user.permissions?.stock_issues >= permission;
        break;
      case "stock_adjustments":
        res = this.user.permissions?.stock_adjustments != null && this.user.permissions?.stock_adjustments >= permission;
        break;
      case "stock_returns":
        res = this.user.permissions?.stock_returns != null && this.user.permissions?.stock_returns >= permission;
        break;
      case "payments":
        res = this.user.permissions?.payments != null && this.user.permissions?.payments >= permission;
        break;
      case "receipts":
        res = this.user.permissions?.receipts != null && this.user.permissions?.receipts >= permission;
        break;
      case "deposits":
        res = this.user.permissions?.deposits != null && this.user.permissions?.deposits >= permission;
        break;
      case "withdrawals":
        res = this.user.permissions?.withdrawals != null && this.user.permissions?.withdrawals >= permission;
        break;
      case "user_logs":
        res = this.user.permissions?.user_logs != null && this.user.permissions?.user_logs >= permission;
        break;
      case "suppliers":
        res = this.user.permissions?.suppliers != null && this.user.permissions?.suppliers >= permission;
        break;
      case "contact_persons":
        res = this.user.permissions?.contact_persons != null && this.user.permissions?.contact_persons >= permission;
        break;
      case "users":
        res = this.user.permissions?.users != null && this.user.permissions?.users >= permission;
        break;
      case "item_groups":
        res = this.user.permissions?.item_groups != null && this.user.permissions?.item_groups >= permission;
        break;
      case "accounts":
        res = this.user.permissions?.accounts != null && this.user.permissions?.accounts >= permission;
        break;
      case "documents":
        res = this.user.permissions?.documents != null && this.user.permissions?.documents >= permission;
        break;
      case "exchange_rates":
        res = this.user.permissions?.exchange_rates != null && this.user.permissions?.exchange_rates >= permission;
        break;
      case "bank_accounts":
        res = this.user.permissions?.bank_accounts != null && this.user.permissions?.bank_accounts >= permission;
        break;
      case "unit_of_measures":
        res = this.user.permissions?.unit_of_measures != null && this.user.permissions?.unit_of_measures >= permission;
        break;
      case "taxes":
        res = this.user.permissions?.taxes != null && this.user.permissions?.taxes >= permission;
        break;

      default:
        break;
    }

    return res;
  }
}
