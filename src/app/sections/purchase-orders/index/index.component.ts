import { Component, OnInit } from '@angular/core';
import { PaginatedResults } from 'src/app/core/models/paginated_results_model';
import { PaginationOptions } from 'src/app/core/models/pagination_options';
import { appRoutes } from 'src/app/core/routes-list';
import { PurchaseOrderService } from 'src/app/core/services/purchase-order.service';
import { AlertService } from 'src/app/core/services/alert.service';
import { ConfirmDialogService } from 'src/app/core/services/confirm-dialog.service';
import { PurchaseOrder } from 'src/app/core/models/purchase-order';
import * as saveAs from 'file-saver';
import * as printJS from 'print-js';
import { ToastService } from 'src/app/core/services/toast-service.service';
import * as moment from 'moment';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class IndexComponent implements OnInit {
  public loading = true;
  public purchaseOrdersList!: Array<PurchaseOrder>;
  public paginatedResults!: PaginatedResults;
  public paginationOptions = new PaginationOptions(
    { sort: 'date', direction: 'desc' },
    'purchase_orders'
  );

  public routes = appRoutes;

  public searchKey = '';

  public sortColumns = [
    'supplier',
    'due_date',
    'date',
    'exchange_rate',
    'discount',
    'currency',
    'number',
    'date_created',
    'date_updated',
  ];

  constructor(
    private purchaseOrderService: PurchaseOrderService,
    private alertService: AlertService,
    private toastService: ToastService,
    private confirmDialogService: ConfirmDialogService
  ) {
    this.getPurchaseOrdersList();
  }

  private getPurchaseOrdersList() {
    this.loading = true;
    this.purchaseOrderService
      .get(this.paginationOptions)
      .subscribe((res: PaginatedResults) => {
        this.paginatedResults = res;
        this.purchaseOrdersList = res.data.map((u) => new PurchaseOrder(u));
        this.loading = false;
      });
  }

  ngOnInit(): void {}

  confirmDelete(purchaseOrder: PurchaseOrder) {
    this.confirmDialogService.showConfirmDialog({
      title: 'Confirm Delete',
      message: `Are you sure you want to delete purchase order number #${purchaseOrder.number}`,
      actionText: 'Delete',
      actionBtnClass: 'btn-danger',
      action: () => {
        this.loading = true;
        this.purchaseOrderService.delete(purchaseOrder.uuid).subscribe({
          next: (res: PurchaseOrder) => {
            this.purchaseOrdersList = this.purchaseOrdersList.filter(
              (u) => u.uuid != purchaseOrder.uuid
            );
            this.toastService.showSuccess(
              `Purchase Order number #${purchaseOrder.number} has been deleted successfully.`
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

  toggleFilter() {
    this.paginationOptions.toggleFilter();
    this.paginatedResults.current_page = 1;
    this.onPageNumberChanged();
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
      this.getPurchaseOrdersList();
    }
  }

  search() {
    if (this.searchKey.trim().length === 0) {
      this.getPurchaseOrdersList();
    } else {
      this.loading = true;
      this.purchaseOrderService
        .search(this.searchKey, this.paginationOptions)
        .subscribe((res: PaginatedResults) => {
          this.paginatedResults = res;

          this.purchaseOrdersList = res.data.map((u) => new PurchaseOrder(u));
          this.loading = false;
        });
    }
  }

  exportData(type: string) {
    this.loading = true;
    this.purchaseOrderService
      .export(type, this.searchKey, this.paginationOptions)
      .subscribe({
        next: (data) => {
          saveAs(
            data as Blob,
            `Purchase Orders Exported - ${moment()}.${type}`
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
