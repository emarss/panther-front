import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Deposit } from 'src/app/core/models/deposit';
import { DepositService } from 'src/app/core/services/deposit.service';
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
  deposit!: Deposit;
  public sub: any;
  public loading = false;

  public routes = appRoutes;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private depositService: DepositService,
    private _location: Location,
    private alertService: AlertService,
    private toastService: ToastService,
    private confirmDialogService: ConfirmDialogService
  ) {}

  ngOnInit(): void {
    this.sub = this.route.params.subscribe((params) => {
      this.uuid = params['uuid'];
      this.fetchDeposit();
    });
  }

  fetchDeposit() {
    this.depositService.show(this.uuid).subscribe({
      next: (res: any) => {
        this.deposit = new Deposit(res);
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
      message: `Are you sure you want to delete deposit for with narration ${this.deposit.narration}`,
      actionText: 'Delete',
      actionBtnClass: 'btn-danger',
      action: () => {
        this.loading = true;
        this.depositService.delete(this.deposit.uuid).subscribe({
          next: (res: Deposit) => {
            this.loading = false;
            this.toastService.showSuccess(
              `Deposit for with narration ${this.deposit.narration} has been deleted successfully.`
            );
            this.router.navigateByUrl(this.routes.financials.deposits.index);
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
