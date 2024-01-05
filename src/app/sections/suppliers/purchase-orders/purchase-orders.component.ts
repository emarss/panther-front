import { Component, Input } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Supplier } from 'src/app/core/models/supplier';
import { appRoutes } from 'src/app/core/routes-list';
import { AlertService } from 'src/app/core/services/alert.service';
import { ConfirmDialogService } from 'src/app/core/services/confirm-dialog.service';
import { SupplierService } from 'src/app/core/services/supplier.service';
import { PurchaseOrder } from 'src/app/core/models/purchase-order';
import { PaginationOptions } from 'src/app/core/models/pagination_options';
import { PaginatedResults } from 'src/app/core/models/paginated_results_model';
import { PurchaseOrderService } from 'src/app/core/services/purchase-order.service';
import { ToastService } from 'src/app/core/services/toast-service.service';
import * as moment from 'moment';
import * as saveAs from 'file-saver';

@Component({
  selector: 'app-purchase-orders',
  templateUrl: './purchase-orders.component.html',
  styleUrls: ['./purchase-orders.component.scss'],
})
export class PurchaseOrdersComponent {
  @Input()
  supplier!: Supplier;

  supplierPurchaseOrdersList!: Array<PurchaseOrder>;
  public sub: any;
  public loading = false;
  public paginatedResults!: PaginatedResults;
  public paginationOptions = new PaginationOptions(
    { sort: 'date', direction: 'desc' },
    'purchase_orders'
  );

  public searchKey = '';

  public routes = appRoutes;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private supplierService: SupplierService,
    private _location: Location,
    private purchaseOrderService: PurchaseOrderService,
    private alertService: AlertService,
    private toastService: ToastService,
    private confirmDialogService: ConfirmDialogService
  ) {}

  ngOnInit() {
    this.getSupplierPurchaseOrders();
  }

  getSupplierPurchaseOrders() {
    this.loading = true;
    this.supplierService
      .getSupplierPurchaseOrders(this.supplier.uuid, this.paginationOptions)
      .subscribe((res: PaginatedResults) => {
        this.paginatedResults = res;
        this.supplierPurchaseOrdersList = res.data.map(
          (u) => new PurchaseOrder(u)
        );
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
      this.getSupplierPurchaseOrders();
    }
  }

  search() {
    if (this.searchKey.trim().length === 0) {
      this.getSupplierPurchaseOrders();
    } else {
      this.loading = true;
      this.supplierService
        .searchSupplierPurchaseOrders(
          this.supplier.uuid,
          this.searchKey,
          this.paginationOptions
        )
        .subscribe((res: PaginatedResults) => {
          this.paginatedResults = res;

          this.supplierPurchaseOrdersList = res.data.map(
            (u) => new PurchaseOrder(u)
          );
          this.loading = false;
        });
    }
  }

  confirmDeletePurchase(purchase: PurchaseOrder) {
    this.confirmDialogService.showConfirmDialog({
      title: 'Confirm Delete',
      message: `Are you sure you want to delete purchase #${purchase.number}`,
      actionText: 'Delete',
      actionBtnClass: 'btn-danger',
      action: () => {
        this.loading = true;
        this.purchaseOrderService.delete(purchase.uuid).subscribe({
          next: (res: PurchaseOrder) => {
            this.supplierPurchaseOrdersList =
              this.supplierPurchaseOrdersList.filter(
                (u) => u.uuid != purchase.uuid
              );
            this.toastService.showSuccess(
              `Purchase purchase #${purchase.number} has been deleted successfully.`
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
    this.supplierService
      .exportSupplierPurchaseOrders(
        this.supplier?.uuid,
        type,
        this.searchKey,
        this.paginationOptions
      )
      .subscribe({
        next: (data) => {
          saveAs(
            data as Blob,
            `Supplier Purchase Orders for ${
              this.supplier?.name
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
