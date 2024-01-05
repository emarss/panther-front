import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { AlertService } from 'src/app/core/services/alert.service';
import { ConfirmDialogService } from 'src/app/core/services/confirm-dialog.service';
import { appRoutes } from 'src/app/core/routes-list';
import { PaymentService } from 'src/app/core/services/payment.service';
import { Payment } from 'src/app/core/models/payment';
import { ToastService } from 'src/app/core/services/toast-service.service';

@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.scss'],
})
export class ShowComponent implements OnInit {
  uuid!: string;
  payment!: Payment;
  public sub: any;
  public loading = false;

  public routes = appRoutes;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private paymentService: PaymentService,
    private _location: Location,
    private alertService: AlertService,
    private toastService: ToastService,
    private confirmDialogService: ConfirmDialogService
  ) {}

  ngOnInit(): void {
    this.sub = this.route.params.subscribe((params) => {
      this.uuid = params['uuid'];
      this.fetchPayment();
    });
  }

  fetchPayment() {
    this.paymentService.show(this.uuid).subscribe({
      next: (res: any) => {
        this.payment = new Payment(res);
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
      message: `Are you sure you want to delete payment for  number #${this.payment.number}`,
      actionText: 'Delete',
      actionBtnClass: 'btn-danger',
      action: () => {
        this.loading = true;
        this.paymentService.delete(this.payment.uuid).subscribe({
          next: (res: Payment) => {
            this.loading = false;
            this.toastService.showSuccess(
              `Payment for  number #${this.payment.number} has been deleted successfully.`
            );
            this.router.navigateByUrl(this.routes.financials.payments.index);
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
