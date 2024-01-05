import { Component, OnInit } from '@angular/core';
import { PaginatedResults } from 'src/app/core/models/paginated_results_model';
import { PaginationOptions } from 'src/app/core/models/pagination_options';
import { appRoutes } from 'src/app/core/routes-list';
import { StockAdjustmentService } from 'src/app/core/services/stock-adjustment.service';
import { AlertService } from 'src/app/core/services/alert.service';
import { ConfirmDialogService } from 'src/app/core/services/confirm-dialog.service';
import * as saveAs from 'file-saver';
import * as printJS from 'print-js';
import { StockAdjustment } from 'src/app/core/models/stock-adjustment';
import { ToastService } from 'src/app/core/services/toast-service.service';
import * as moment from 'moment';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class IndexComponent implements OnInit {
  public loading = true;
  public stockAdjustmentsList!: Array<StockAdjustment>;
  public paginatedResults!: PaginatedResults;
  public paginationOptions = new PaginationOptions(
    { sort: 'date', direction: 'desc' },
    'stock_adjustments'
  );

  public routes = appRoutes;

  public searchKey = '';

  public sortColumns = [
    'salesperson',
    'item',
    'type',
    'quantity',
    'date',
    'comments',
    'date_created',
    'date_updated',
  ];

  constructor(
    private stockAdjustmentService: StockAdjustmentService,
    private alertService: AlertService,
    private toastService: ToastService,
    private confirmDialogService: ConfirmDialogService
  ) {
    this.getStockAdjustmentsList();
  }

  private getStockAdjustmentsList() {
    this.loading = true;
    this.stockAdjustmentService
      .get(this.paginationOptions)
      .subscribe((res: PaginatedResults) => {
        this.paginatedResults = res;
        this.stockAdjustmentsList = res.data.map((u) => new StockAdjustment(u));
        this.loading = false;
      });
  }

  ngOnInit(): void {}

  confirmDelete(stockAdjustment: StockAdjustment) {
    this.confirmDialogService.showConfirmDialog({
      title: 'Confirm Delete',
      message: `Are you sure you want to delete Stock adjustment for item ${stockAdjustment.item?.description}`,
      actionText: 'Delete',
      actionBtnClass: 'btn-danger',
      action: () => {
        this.loading = true;
        this.stockAdjustmentService.delete(stockAdjustment.uuid).subscribe({
          next: (res: StockAdjustment) => {
            this.stockAdjustmentsList = this.stockAdjustmentsList.filter(
              (u) => u.uuid != stockAdjustment.uuid
            );
            this.toastService.showSuccess(
              `Stock adjustment for item ${stockAdjustment.item?.description} has been deleted successfully.`
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
      this.getStockAdjustmentsList();
    }
  }

  search() {
    if (this.searchKey.trim().length === 0) {
      this.getStockAdjustmentsList();
    } else {
      this.loading = true;
      this.stockAdjustmentService
        .search(this.searchKey, this.paginationOptions)
        .subscribe((res: PaginatedResults) => {
          this.paginatedResults = res;

          this.stockAdjustmentsList = res.data.map(
            (u) => new StockAdjustment(u)
          );
          this.loading = false;
        });
    }
  }

  exportData(type: string) {
    this.loading = true;
    this.stockAdjustmentService
      .export(type, this.searchKey, this.paginationOptions)
      .subscribe({
        next: (data) => {
          saveAs(
            data as Blob,
            `Stock Adjustments Exported - ${moment()}.${type}`
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
