import { Component, OnInit } from '@angular/core';
import * as saveAs from 'file-saver';
import * as moment from 'moment';
import * as printJS from 'print-js';
import { PaginatedResults } from 'src/app/core/models/paginated_results_model';
import { PaginationOptions } from 'src/app/core/models/pagination_options';
import { Receipt } from 'src/app/core/models/receipt';
import { appRoutes } from 'src/app/core/routes-list';
import { AlertService } from 'src/app/core/services/alert.service';
import { ConfirmDialogService } from 'src/app/core/services/confirm-dialog.service';
import { ReceiptService } from 'src/app/core/services/receipt.service';
import { ToastService } from 'src/app/core/services/toast-service.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class IndexComponent implements OnInit {
  public loading = true;
  public receiptsList!: Array<Receipt>;
  public paginatedResults!: PaginatedResults;
  public paginationOptions = new PaginationOptions(
    { sort: 'date', direction: 'desc' },
    'receipts'
  );

  public routes = appRoutes;

  public searchKey = '';

  public sortColumns = [
    'supplier',
    'currency',
    'number',
    'exchange_rate',
    'category',
    'amount',
    'date',
    'date_created',
    'date_updated',
  ];

  constructor(
    private receiptService: ReceiptService,
    private alertService: AlertService,
    private toastService: ToastService,
    private confirmDialogService: ConfirmDialogService
  ) {
    this.getReceiptsList();
  }

  private getReceiptsList() {
    this.loading = true;
    this.receiptService
      .get(this.paginationOptions)
      .subscribe((res: PaginatedResults) => {
        this.paginatedResults = res;
        this.receiptsList = res.data.map((u) => new Receipt(u));
        this.loading = false;
      });
  }

  ngOnInit(): void {}

  confirmDelete(receipt: Receipt) {
    this.confirmDialogService.showConfirmDialog({
      title: 'Confirm Delete',
      message: `Are you sure you want to delete with number #${receipt.number}`,
      actionText: 'Delete',
      actionBtnClass: 'btn-danger',
      action: () => {
        this.loading = true;
        this.receiptService.delete(receipt.uuid).subscribe({
          next: (res: Receipt) => {
            this.receiptsList = this.receiptsList.filter(
              (u) => u.uuid != receipt.uuid
            );
            this.toastService.showSuccess(
              `Receipt with number #${receipt.number} has been deleted successfully.`
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
      this.getReceiptsList();
    }
  }

  search() {
    if (this.searchKey.trim().length === 0) {
      this.getReceiptsList();
    } else {
      this.loading = true;
      this.receiptService
        .search(this.searchKey, this.paginationOptions)
        .subscribe((res: PaginatedResults) => {
          this.paginatedResults = res;

          this.receiptsList = res.data.map((u) => new Receipt(u));
          this.loading = false;
        });
    }
  }

  exportData(type: string) {
    this.loading = true;
    this.receiptService
      .export(type, this.searchKey, this.paginationOptions)
      .subscribe({
        next: (data) => {
          saveAs(data as Blob, `Receipts Exported - ${moment()}.${type}`);
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
