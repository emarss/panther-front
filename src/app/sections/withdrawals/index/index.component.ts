import { Component, OnInit } from '@angular/core';
import { PaginatedResults } from 'src/app/core/models/paginated_results_model';
import { PaginationOptions } from 'src/app/core/models/pagination_options';
import { appRoutes } from 'src/app/core/routes-list';
import { WithdrawalService } from 'src/app/core/services/withdrawal.service';
import { AlertService } from 'src/app/core/services/alert.service';
import { ConfirmDialogService } from 'src/app/core/services/confirm-dialog.service';
import { Withdrawal } from 'src/app/core/models/withdrawal';
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
  public withdrawalsList!: Array<Withdrawal>;
  public paginatedResults!: PaginatedResults;
  public paginationOptions = new PaginationOptions(
    { sort: 'date', direction: 'desc' },
    'withdrawals'
  );

  public routes = appRoutes;

  public searchKey = '';

  public sortColumns = [
    'account',
    'currency',
    'amount',
    'date',
    'exchange_rate',
    'narration',
    'date_created',
    'date_updated',
  ];

  constructor(
    private withdrawalService: WithdrawalService,
    private alertService: AlertService,
    private toastService: ToastService,
    private confirmDialogService: ConfirmDialogService
  ) {
    this.getWithdrawalsList();
  }

  private getWithdrawalsList() {
    this.loading = true;
    this.withdrawalService
      .get(this.paginationOptions)
      .subscribe((res: PaginatedResults) => {
        this.paginatedResults = res;
        this.withdrawalsList = res.data.map((u) => new Withdrawal(u));
        this.loading = false;
      });
  }

  toggleFilter() {
    this.paginationOptions.toggleFilter();
    this.paginatedResults.current_page = 1;
    this.onPageNumberChanged();
  }

  ngOnInit(): void {}

  confirmDelete(withdrawal: Withdrawal) {
    this.confirmDialogService.showConfirmDialog({
      title: 'Confirm Delete',
      message: `Are you sure you want to delete with narration ${withdrawal.narration}`,
      actionText: 'Delete',
      actionBtnClass: 'btn-danger',
      action: () => {
        this.loading = true;
        this.withdrawalService.delete(withdrawal.uuid).subscribe({
          next: (res: Withdrawal) => {
            this.withdrawalsList = this.withdrawalsList.filter(
              (u) => u.uuid != withdrawal.uuid
            );
            this.toastService.showSuccess(
              `Withdrawal with narration ${withdrawal.narration} has been deleted successfully.`
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
      this.getWithdrawalsList();
    }
  }

  search() {
    if (this.searchKey.trim().length === 0) {
      this.getWithdrawalsList();
    } else {
      this.loading = true;
      this.withdrawalService
        .search(this.searchKey, this.paginationOptions)
        .subscribe((res: PaginatedResults) => {
          this.paginatedResults = res;

          this.withdrawalsList = res.data.map((u) => new Withdrawal(u));
          this.loading = false;
        });
    }
  }

  exportData(type: string) {
    this.loading = true;
    this.withdrawalService
      .export(type, this.searchKey, this.paginationOptions)
      .subscribe({
        next: (data) => {
          saveAs(data as Blob, `Withdrawals Exported - ${moment()}.${type}`);
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
