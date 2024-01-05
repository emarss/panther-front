import { Component, Input } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PurchaseOrder } from 'src/app/core/models/purchase-order';
import { appRoutes } from 'src/app/core/routes-list';
import { AlertService } from 'src/app/core/services/alert.service';
import { ConfirmDialogService } from 'src/app/core/services/confirm-dialog.service';
import { PurchaseOrderService } from 'src/app/core/services/purchase-order.service';
import { Payment } from 'src/app/core/models/payment';
import { PaginationOptions } from 'src/app/core/models/pagination_options';
import { PaginatedResults } from 'src/app/core/models/paginated_results_model';
import { PaymentService } from 'src/app/core/services/payment.service';
import { ToastService } from 'src/app/core/services/toast-service.service';
import * as saveAs from 'file-saver';
import * as moment from 'moment';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss'],
})
export class PaymentsComponent {
  @Input()
  purchaseOrder!: PurchaseOrder;

  purchasePaymentsList!: Array<Payment>;
  public sub: any;
  public loading = false;
  public paginatedResults!: PaginatedResults;
  public paginationOptions = new PaginationOptions(
    { sort: 'date', direction: 'desc' },
    'payments'
  );

  public searchKey = '';

  public routes = appRoutes;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private purchaseOrderService: PurchaseOrderService,
    private _location: Location,
    private paymentService: PaymentService,
    private alertService: AlertService,
    private toastService: ToastService,
    private confirmDialogService: ConfirmDialogService
  ) {}

  ngOnInit() {
    this.getPurchasePayments();
  }

  getPurchasePayments() {
    this.loading = true;
    this.purchaseOrderService
      .getPurchasePayments(this.purchaseOrder.uuid, this.paginationOptions)
      .subscribe((res: PaginatedResults) => {
        this.paginatedResults = res;
        this.purchasePaymentsList = res.data.map((u) => new Payment(u));
        this.loading = false;
      });
  }

  onPageNumberChanged() {
    this.paginationOptions.pageNumber = this.paginatedResults.current_page;
    this.paginationOptions.saveUpdatedOptions();
    this.onPaginationChanged();
  }

  onPerPageChanged() {
    this.paginatedResults.current_page = 1;
    this.paginationOptions.perPage = this.paginatedResults.per_page;
    this.paginationOptions.pageNumber = this.paginatedResults.current_page;
    this.onPageNumberChanged();
  }

  changeSort(field: string) {
    if (this.paginationOptions.sort === field) {
      this.paginationOptions.toggleDirection();
    } else {
      this.paginationOptions.sort = field;
      this.paginationOptions.resetDirection();
    }

    this.paginatedResults.current_page = 1;
    this.paginationOptions.pageNumber = this.paginatedResults.current_page;
    this.onPageNumberChanged();
  }

  onPaginationChanged() {
    if (this.searchKey.trim().length >= 1) {
      this.search();
    } else {
      this.getPurchasePayments();
    }
  }

  search() {
    if (this.searchKey.trim().length === 0) {
      this.getPurchasePayments();
    } else {
      this.loading = true;
      this.purchaseOrderService
        .searchPurchasePayments(
          this.purchaseOrder.uuid,
          this.searchKey,
          this.paginationOptions
        )
        .subscribe((res: PaginatedResults) => {
          this.paginatedResults = res;

          this.purchasePaymentsList = res.data.map((u) => new Payment(u));
          this.loading = false;
        });
    }
  }

  confirmDeletePayment(payment: Payment) {
    this.confirmDialogService.showConfirmDialog({
      title: 'Confirm Delete',
      message: `Are you sure you want to delete payment #${payment.number}`,
      actionText: 'Delete',
      actionBtnClass: 'btn-danger',
      action: () => {
        this.loading = true;
        this.paymentService.delete(payment.uuid).subscribe({
          next: (res: Payment) => {
            this.purchasePaymentsList = this.purchasePaymentsList.filter(
              (u) => u.uuid != payment.uuid
            );
            this.toastService.showSuccess(
              `Payment payment #${payment.number} has been deleted successfully.`
            );
            this.loading = false;
          },
          error: (err: any) => {
            this.loading = false;
            this.alertService.showNotificationForHttpError(err);
          },
        });
      },
    });
  }

  exportData(type: string) {
    this.loading = true;
    this.purchaseOrderService
      .exportPurchaseOrderPayments(
        this.purchaseOrder?.uuid,
        type,
        this.searchKey,
        this.paginationOptions
      )
      .subscribe({
        next: (data) => {
          saveAs(
            data as Blob,
            `Purchase Order Payments for #${
              this.purchaseOrder?.number
            } Exported - ${moment()}.${type}`
          );
          this.loading = false;
        },
        error: (ex) => {
          this.loading = false;
          this.toastService.showError(
            'The data could not be loaded from the server. Please, check your internet connection and try again.'
          );
        },
      });
  }
}
