import { Component, Input } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PurchaseOrder } from 'src/app/core/models/purchase-order';
import { appRoutes } from 'src/app/core/routes-list';
import { AlertService } from 'src/app/core/services/alert.service';
import { ConfirmDialogService } from 'src/app/core/services/confirm-dialog.service';
import { PurchaseOrderService } from 'src/app/core/services/purchase-order.service';
import { Receipt } from 'src/app/core/models/receipt';
import { PaginationOptions } from 'src/app/core/models/pagination_options';
import { PaginatedResults } from 'src/app/core/models/paginated_results_model';
import { ReceiptService } from 'src/app/core/services/receipt.service';
import { ToastService } from 'src/app/core/services/toast-service.service';
import * as saveAs from 'file-saver';
import * as moment from 'moment';

@Component({
  selector: 'app-refunds',
  templateUrl: './refunds.component.html',
  styleUrls: ['./refunds.component.scss'],
})
export class RefundsComponent {
  @Input()
  purchaseOrder!: PurchaseOrder;

  purchaseReceiptsList!: Array<Receipt>;
  public sub: any;
  public loading = false;
  public paginatedResults!: PaginatedResults;
  public paginationOptions = new PaginationOptions(
    { sort: 'date', direction: 'desc' },
    'receipts'
  );

  public searchKey = '';

  public routes = appRoutes;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private purchaseOrderService: PurchaseOrderService,
    private _location: Location,
    private receiptService: ReceiptService,
    private alertService: AlertService,
    private toastService: ToastService,
    private confirmDialogService: ConfirmDialogService
  ) {}

  ngOnInit() {
    this.getPurchaseReceipts();
  }

  getPurchaseReceipts() {
    this.loading = true;
    this.purchaseOrderService
      .getPurchaseReceipts(this.purchaseOrder.uuid, this.paginationOptions)
      .subscribe((res: PaginatedResults) => {
        this.paginatedResults = res;
        this.purchaseReceiptsList = res.data.map((u) => new Receipt(u));
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
      this.getPurchaseReceipts();
    }
  }

  search() {
    if (this.searchKey.trim().length === 0) {
      this.getPurchaseReceipts();
    } else {
      this.loading = true;
      this.purchaseOrderService
        .searchPurchaseReceipts(
          this.purchaseOrder.uuid,
          this.searchKey,
          this.paginationOptions
        )
        .subscribe((res: PaginatedResults) => {
          this.paginatedResults = res;

          this.purchaseReceiptsList = res.data.map((u) => new Receipt(u));
          this.loading = false;
        });
    }
  }

  confirmDeleteReceipt(receipt: Receipt) {
    this.confirmDialogService.showConfirmDialog({
      title: 'Confirm Delete',
      message: `Are you sure you want to delete refund #${receipt.number}`,
      actionText: 'Delete',
      actionBtnClass: 'btn-danger',
      action: () => {
        this.loading = true;
        this.receiptService.delete(receipt.uuid).subscribe({
          next: (res: Receipt) => {
            this.purchaseReceiptsList = this.purchaseReceiptsList.filter(
              (u) => u.uuid != receipt.uuid
            );
            this.toastService.showSuccess(
              `Receipt refund #${receipt.number} has been deleted successfully.`
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
      .exportPurchaseOrderReceipts(
        this.purchaseOrder?.uuid,
        type,
        this.searchKey,
        this.paginationOptions
      )
      .subscribe({
        next: (data) => {
          saveAs(
            data as Blob,
            `PurchaseOrder Receipts for ${
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
