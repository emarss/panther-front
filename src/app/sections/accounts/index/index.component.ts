import { Component, OnInit } from '@angular/core';
import * as saveAs from 'file-saver';
import * as moment from 'moment';
import * as printJS from 'print-js';
import { Account } from 'src/app/core/models/account';
import { PaginatedResults } from 'src/app/core/models/paginated_results_model';
import { PaginationOptions } from 'src/app/core/models/pagination_options';
import { appRoutes } from 'src/app/core/routes-list';
import { AccountService } from 'src/app/core/services/account.service';
import { AlertService } from 'src/app/core/services/alert.service';
import { ConfirmDialogService } from 'src/app/core/services/confirm-dialog.service';
import { ToastService } from 'src/app/core/services/toast-service.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class IndexComponent implements OnInit {
  public loading = true;
  public accountsList!: Array<Account>;
  public paginatedResults!: PaginatedResults;
  public paginationOptions = new PaginationOptions(
    { sort: 'name', direction: 'asc' },
    'accounts'
  );

  public routes = appRoutes;

  public searchKey = '';

  public sortColumns = [
    'name',
    'description',
    'exchange_rate',
    'currency',
    'date_created',
    'date_updated',
  ];

  constructor(
    private accountService: AccountService,
    private alertService: AlertService,
    private toastService: ToastService,
    private confirmDialogService: ConfirmDialogService
  ) {
    this.getAccountsList();
  }

  private getAccountsList() {
    this.loading = true;
    this.accountService
      .get(this.paginationOptions)
      .subscribe((res: PaginatedResults) => {
        this.paginatedResults = res;
        this.accountsList = res.data.map((u) => new Account(u));
        this.loading = false;
      });
  }

  ngOnInit(): void {}

  confirmDelete(account: Account) {
    this.confirmDialogService.showConfirmDialog({
      title: 'Confirm Delete',
      message: `Are you sure you want to delete ${account.name}`,
      actionText: 'Delete',
      actionBtnClass: 'btn-danger',
      action: () => {
        this.loading = true;
        this.accountService.delete(account.uuid).subscribe({
          next: (res: Account) => {
            this.accountsList = this.accountsList.filter(
              (u) => u.uuid != account.uuid
            );
            this.toastService.showSuccess(
              `Account '${res.name}' has been deleted successfully.`
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
      this.getAccountsList();
    }
  }

  search() {
    if (this.searchKey.trim().length === 0) {
      this.getAccountsList();
    } else {
      this.loading = true;
      this.accountService
        .search(this.searchKey, this.paginationOptions)
        .subscribe((res: PaginatedResults) => {
          this.paginatedResults = res;

          this.accountsList = res.data.map((u) => new Account(u));
          this.loading = false;
        });
    }
  }

  exportData(type: string) {
    this.loading = true;
    this.accountService
      .export(type, this.searchKey, this.paginationOptions)
      .subscribe({
        next: (data) => {
          saveAs(data as Blob, `Accounts Exported - ${moment()}.${type}`);

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
