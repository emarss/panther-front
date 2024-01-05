import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BankAccount } from 'src/app/core/models/bank-account';
import { BankAccountService } from 'src/app/core/services/bank-account.service';
import { Location } from '@angular/common';
import { AlertService } from 'src/app/core/services/alert.service';
import { ConfirmDialogService } from 'src/app/core/services/confirm-dialog.service';
import { appRoutes } from 'src/app/core/routes-list';
import { ToastService } from 'src/app/core/services/toast-service.service';

@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.scss'],
})
export class ShowComponent implements OnInit {
  uuid!: string;
  bankAccount!: BankAccount;
  public sub: any;
  public loading = false;

  public routes = appRoutes;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bankAccountService: BankAccountService,
    private _location: Location,
    private alertService: AlertService,
    private toastService: ToastService,
    private confirmDialogService: ConfirmDialogService
  ) {}

  ngOnInit(): void {
    this.sub = this.route.params.subscribe((params) => {
      this.uuid = params['uuid'];
      this.fetchBankAccount();
    });
  }

  fetchBankAccount() {
    this.bankAccountService.show(this.uuid).subscribe({
      next: (res: any) => {
        this.bankAccount = new BankAccount(res);
      },
      error: (err: any) => {},
    });
  }

  backClicked() {
    this._location.back();
  }

  confirmDelete() {
    this.confirmDialogService.showConfirmDialog({
      title: 'Confirm Delete',
      message: `Are you sure you want to delete Bank account for item ${this.bankAccount.bank_name}`,
      actionText: 'Delete',
      actionBtnClass: 'btn-danger',
      action: () => {
        this.loading = true;
        this.bankAccountService.delete(this.bankAccount.uuid).subscribe({
          next: (res: BankAccount) => {
            this.loading = false;
            this.toastService.showSuccess(
              `Bank account for item ${this.bankAccount.bank_name} has been deleted successfully.`
            );
            this.router.navigateByUrl(
              this.routes.administration.bank_accounts.index
            );
          },
          error: (err: any) => {
            this.loading = false;
            this.alertService.showNotificationForHttpError(err);
          },
        });
      },
    });
  }
}
