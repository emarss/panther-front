import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { appRoutes } from 'src/app/core/routes-list';
import { Location } from '@angular/common';
import { Account } from 'src/app/core/models/account';
import { AccountService } from 'src/app/core/services/account.service';
import { ConfirmDialogService } from 'src/app/core/services/confirm-dialog.service';
import { AlertService } from 'src/app/core/services/alert.service';
import { LoadingModalService } from 'src/app/core/services/loading-modal.service';

@Component({
  selector: 'app-account-show-menu',
  templateUrl: './account-show-menu.component.html',
  styleUrls: ['./account-show-menu.component.scss'],
})
export class AccountShowMenuComponent {
  @Input()
  account!: Account;

  public routes = appRoutes;
  constructor(
    private router: Router,
    private _location: Location,
    private confirmDialogService: ConfirmDialogService,
    private alertService: AlertService,
    private loadingModalService: LoadingModalService,
    private accountService: AccountService
  ) {}

  pageIsShow() {
    return this.router.url.split('/')[4] == 'details';
  }
  pageIsPreview() {
    return this.router.url.split('/')[4] == 'preview';
  }
  pageIsPayments() {
    return this.router.url.split('/')[4] == 'payments';
  }
  pageIsReceipts() {
    return this.router.url.split('/')[4] == 'receipts';
  }
  pageIsDeposits() {
    return this.router.url.split('/')[4] == 'deposits';
  }
  pageIsWithdrawals() {
    return this.router.url.split('/')[4] == 'withdrawals';
  }
  pageIsStatement() {
    return this.router.url.split('/')[4] == 'statement';
  }

  backClicked() {
    this._location.back();
  }
}
