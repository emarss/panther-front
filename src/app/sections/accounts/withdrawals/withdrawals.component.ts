import { Component, Input } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Account } from 'src/app/core/models/account';
import { appRoutes } from 'src/app/core/routes-list';
import { AlertService } from 'src/app/core/services/alert.service';
import { ConfirmDialogService } from 'src/app/core/services/confirm-dialog.service';
import { AccountService } from 'src/app/core/services/account.service';
import { Withdrawal } from 'src/app/core/models/withdrawal';
import { PaginationOptions } from 'src/app/core/models/pagination_options';
import { PaginatedResults } from 'src/app/core/models/paginated_results_model';
import { WithdrawalService } from 'src/app/core/services/withdrawal.service';
import { ToastService } from 'src/app/core/services/toast-service.service';
import * as moment from 'moment';
import * as saveAs from 'file-saver';

@Component({
  selector: 'app-withdrawals',
  templateUrl: './withdrawals.component.html',
  styleUrls: ['./withdrawals.component.scss'],
})
export class WithdrawalsComponent {
  @Input()
  account!: Account;

  accountWithdrawalsList!: Array<Withdrawal>;
  public sub: any;
  public loading = false;
  public paginatedResults!: PaginatedResults;
  public paginationOptions = new PaginationOptions(
    { sort: 'date', direction: 'desc' },
    'withdrawals'
  );

  public searchKey = '';

  public routes = appRoutes;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private _location: Location,
    private withdrawalService: WithdrawalService,
    private alertService: AlertService,
    private toastService: ToastService,
    private confirmDialogService: ConfirmDialogService
  ) {}

  ngOnInit() {
    this.getAccountWithdrawals();
  }

  getAccountWithdrawals() {
    this.loading = true;
    this.accountService
      .getAccountWithdrawals(this.account.uuid, this.paginationOptions)
      .subscribe((res: PaginatedResults) => {
        this.paginatedResults = res;
        this.accountWithdrawalsList = res.data.map((u) => new Withdrawal(u));
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
      this.getAccountWithdrawals();
    }
  }

  search() {
    if (this.searchKey.trim().length === 0) {
      this.getAccountWithdrawals();
    } else {
      this.loading = true;
      this.accountService
        .searchAccountWithdrawals(
          this.account.uuid,
          this.searchKey,
          this.paginationOptions
        )
        .subscribe((res: PaginatedResults) => {
          this.paginatedResults = res;

          this.accountWithdrawalsList = res.data.map((u) => new Withdrawal(u));
          this.loading = false;
        });
    }
  }

  confirmDeleteWithdrawal(withdrawal: Withdrawal) {
    this.confirmDialogService.showConfirmDialog({
      title: 'Confirm Delete',
      message: `Are you sure you want to delete withdrawal ${withdrawal.narration}`,
      actionText: 'Delete',
      actionBtnClass: 'btn-danger',
      action: () => {
        this.loading = true;
        this.withdrawalService.delete(withdrawal.uuid).subscribe({
          next: (res: Withdrawal) => {
            this.accountWithdrawalsList = this.accountWithdrawalsList.filter(
              (u) => u.uuid != withdrawal.uuid
            );
            this.toastService.showSuccess(
              `Withdrawal ${withdrawal.narration} has been deleted successfully.`
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
    this.accountService
      .exportAccountWithdrawals(
        this.account?.uuid,
        type,
        this.searchKey,
        this.paginationOptions
      )
      .subscribe({
        next: (data) => {
          saveAs(
            data as Blob,
            `Account Withdrawals for ${
              this.account?.name
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
