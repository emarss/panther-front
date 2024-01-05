import { Component, OnInit } from '@angular/core';
import { PaginatedResults } from 'src/app/core/models/paginated_results_model';
import { PaginationOptions } from 'src/app/core/models/pagination_options';
import { appRoutes } from 'src/app/core/routes-list';
import { BankAccountService } from 'src/app/core/services/bank-account.service';
import { AlertService } from 'src/app/core/services/alert.service';
import { ConfirmDialogService } from 'src/app/core/services/confirm-dialog.service';
import * as saveAs from 'file-saver';
import * as printJS from 'print-js';
import { BankAccount } from 'src/app/core/models/bank-account';
import { ToastService } from 'src/app/core/services/toast-service.service';
import * as moment from 'moment';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class IndexComponent implements OnInit {
  public loading = true;
  public bank_accountsList!: Array<BankAccount>;
  public paginatedResults!: PaginatedResults;
  public paginationOptions = new PaginationOptions(
    { sort: 'title', direction: 'asc' },
    'bank_accounts'
  );

  public routes = appRoutes;

  public searchKey = '';

  public sortColumns = [
    'bank_name',
    'account_holder',
    'title',
    'bank_branch',
    'bank_account',
    'status',
    'priority',
    'date_created',
    'date_updated',
  ];

  constructor(
    private bankAccountService: BankAccountService,
    private alertService: AlertService,
    private toastService: ToastService,
    private confirmDialogService: ConfirmDialogService
  ) {
    this.getbank_accountsList();
  }

  private getbank_accountsList() {
    this.loading = true;
    this.bankAccountService
      .get(this.paginationOptions)
      .subscribe((res: PaginatedResults) => {
        this.paginatedResults = res;

        this.bank_accountsList = res.data.map((u) => new BankAccount(u));
        this.loading = false;
      });
  }

  ngOnInit(): void {}

  confirmDelete(bankaccount: BankAccount) {
    this.confirmDialogService.showConfirmDialog({
      title: 'Confirm Delete',
      message: `Are you sure you want to delete ${bankaccount.bank_name}`,
      actionText: 'Delete',
      actionBtnClass: 'btn-danger',
      action: () => {
        this.loading = true;
        this.bankAccountService.delete(bankaccount.uuid).subscribe({
          next: (res: BankAccount) => {
            this.bank_accountsList = this.bank_accountsList.filter(
              (u) => u.uuid != bankaccount.uuid
            );
            this.toastService.showSuccess(
              `BankAccount '${res.bank_account}' has been deleted successfully.`
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
      this.getbank_accountsList();
    }
  }

  search() {
    if (this.searchKey.trim().length === 0) {
      this.getbank_accountsList();
    } else {
      this.loading = true;
      this.bankAccountService
        .search(this.searchKey, this.paginationOptions)
        .subscribe((res: PaginatedResults) => {
          this.paginatedResults = res;
          this.bank_accountsList = res.data.map((u) => new BankAccount(u));
          this.loading = false;
        });
    }
  }

  exportData(type: string) {
    this.loading = true;
    this.bankAccountService
      .export(type, this.searchKey, this.paginationOptions)
      .subscribe({
        next: (data) => {
          saveAs(data as Blob, `Bank Accounts Exported - ${moment()}.${type}`);
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
