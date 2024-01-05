import { Component, OnInit } from '@angular/core';
import { PaginatedResults } from 'src/app/core/models/paginated_results_model';
import { PaginationOptions } from 'src/app/core/models/pagination_options';
import { appRoutes } from 'src/app/core/routes-list';
import { StockReturnService } from 'src/app/core/services/stock-return.service';
import { AlertService } from 'src/app/core/services/alert.service';
import { ConfirmDialogService } from 'src/app/core/services/confirm-dialog.service';
import { StockReturn } from 'src/app/core/models/stock-return';
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
  public stockReturnsList!: Array<StockReturn>;
  public paginatedResults!: PaginatedResults;
  public paginationOptions = new PaginationOptions(
    { sort: 'date', direction: 'desc' },
    'stock_returns'
  );

  public routes = appRoutes;

  public searchKey = '';

  public sortColumns = [
    'salesperson',
    'item',
    'quantity',
    'date',
    'comments',
    'date_created',
    'date_updated',
  ];

  constructor(
    private stockReturnService: StockReturnService,
    private alertService: AlertService,
    private toastService: ToastService,
    private confirmDialogService: ConfirmDialogService
  ) {
    this.getStockReturnsList();
  }

  private getStockReturnsList() {
    this.loading = true;
    this.stockReturnService
      .get(this.paginationOptions)
      .subscribe((res: PaginatedResults) => {
        this.paginatedResults = res;
        this.stockReturnsList = res.data.map((u) => new StockReturn(u));
        this.loading = false;
      });
  }

  ngOnInit(): void {}

  confirmDelete(stockReturn: StockReturn) {
    this.confirmDialogService.showConfirmDialog({
      title: 'Confirm Delete',
      message: `Are you sure you want to delete Stock return for item ${stockReturn.item?.description}`,
      actionText: 'Delete',
      actionBtnClass: 'btn-danger',
      action: () => {
        this.loading = true;
        this.stockReturnService.delete(stockReturn.uuid).subscribe({
          next: (res: StockReturn) => {
            this.stockReturnsList = this.stockReturnsList.filter(
              (u) => u.uuid != stockReturn.uuid
            );
            this.toastService.showSuccess(
              `Stock return for item ${stockReturn.item?.description} has been deleted successfully.`
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
      this.getStockReturnsList();
    }
  }

  search() {
    if (this.searchKey.trim().length === 0) {
      this.getStockReturnsList();
    } else {
      this.loading = true;
      this.stockReturnService
        .search(this.searchKey, this.paginationOptions)
        .subscribe((res: PaginatedResults) => {
          this.paginatedResults = res;

          this.stockReturnsList = res.data.map((u) => new StockReturn(u));
          this.loading = false;
        });
    }
  }

  exportData(type: string) {
    this.loading = true;
    this.stockReturnService
      .export(type, this.searchKey, this.paginationOptions)
      .subscribe({
        next: (data) => {
          saveAs(data as Blob, `Stock Returns Exported - ${moment()}.${type}`);
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
