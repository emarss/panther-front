import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Account } from 'src/app/core/models/account';
import { AccountService } from 'src/app/core/services/account.service';
import { Location } from '@angular/common';
import { AlertService } from 'src/app/core/services/alert.service';
import { ConfirmDialogService } from 'src/app/core/services/confirm-dialog.service';
import { appRoutes } from 'src/app/core/routes-list';
import { ToastService } from 'src/app/core/services/toast-service.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent {
  @Input()
  account!: Account;
  public sub: any;
  public loading = false;

  public routes = appRoutes;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private _location: Location,
    private alertService: AlertService,
    private toastService: ToastService,
    private confirmDialogService: ConfirmDialogService
  ) {}

  ngOnInit(): void {}

  backClicked() {
    this._location.back();
  }

  confirmDelete() {
    this.confirmDialogService.showConfirmDialog({
      title: 'Confirm Delete',
      message: `Are you sure you want to delete ${this.account.name}`,
      actionText: 'Delete',
      actionBtnClass: 'btn-danger',
      action: () => {
        this.loading = true;
        this.accountService.delete(this.account.uuid).subscribe({
          next: (res: Account) => {
            this.loading = false;
            this.toastService.showSuccess(
              `Account '${res.name}' has been deleted successfully.`
            );
            this.router.navigateByUrl(
              this.routes.administration.accounts.index
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
