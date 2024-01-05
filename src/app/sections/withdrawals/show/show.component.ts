import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Withdrawal } from 'src/app/core/models/withdrawal';
import { WithdrawalService } from 'src/app/core/services/withdrawal.service';
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
  withdrawal!: Withdrawal;
  public sub: any;
  public loading = false;

  public routes = appRoutes;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private withdrawalService: WithdrawalService,
    private _location: Location,
    private toastService: ToastService,
    private alertService: AlertService,
    private confirmDialogService: ConfirmDialogService
  ) {}

  ngOnInit(): void {
    this.sub = this.route.params.subscribe((params) => {
      this.uuid = params['uuid'];
      this.fetchWithdrawal();
    });
  }

  fetchWithdrawal() {
    this.withdrawalService.show(this.uuid).subscribe({
      next: (res: any) => {
        this.withdrawal = new Withdrawal(res);
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
      message: `Are you sure you want to delete withdrawal for with narration ${this.withdrawal.narration}`,
      actionText: 'Delete',
      actionBtnClass: 'btn-danger',
      action: () => {
        this.loading = true;
        this.withdrawalService.delete(this.withdrawal.uuid).subscribe({
          next: (res: Withdrawal) => {
            this.loading = false;
            this.toastService.showSuccess(
              `Withdrawal for with narration ${this.withdrawal.narration} has been deleted successfully.`
            );
            this.router.navigateByUrl(this.routes.financials.withdrawals.index);
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
