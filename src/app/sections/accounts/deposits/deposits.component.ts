import { Component, Input } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Account } from 'src/app/core/models/account';
import { appRoutes } from 'src/app/core/routes-list';
import { AlertService } from 'src/app/core/services/alert.service';
import { ConfirmDialogService } from 'src/app/core/services/confirm-dialog.service';
import { AccountService } from 'src/app/core/services/account.service';
import { Deposit } from 'src/app/core/models/deposit';
import { PaginationOptions } from 'src/app/core/models/pagination_options';
import { PaginatedResults } from 'src/app/core/models/paginated_results_model';
import { DepositService } from 'src/app/core/services/deposit.service';
import { ToastService } from 'src/app/core/services/toast-service.service';
import * as moment from 'moment';
import * as saveAs from 'file-saver';

@Component({
  selector: 'app-deposits',
  templateUrl: './deposits.component.html',
  styleUrls: ['./deposits.component.scss'],
})
export class DepositsComponent {
  @Input()
  account!: Account;

  accountDepositsList!: Array<Deposit>;
  public sub: any;
  public loading = false;
  public paginatedResults!: PaginatedResults;
  public paginationOptions = new PaginationOptions(
    { sort: 'date', direction: 'desc' },
    'deposits'
  );

  public searchKey = '';

  public routes = appRoutes;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private _location: Location,
    private depositService: DepositService,
    private alertService: AlertService,
    private toastService: ToastService,
    private confirmDialogService: ConfirmDialogService
  ) {}

  ngOnInit() {
    this.getAccountDeposits();
  }

  getAccountDeposits() {
    this.loading = true;
    this.accountService
      .getAccountDeposits(this.account.uuid, this.paginationOptions)
      .subscribe((res: PaginatedResults) => {
        this.paginatedResults = res;
        this.accountDepositsList = res.data.map((u) => new Deposit(u));
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
      this.getAccountDeposits();
    }
  }

  search() {
    if (this.searchKey.trim().length === 0) {
      this.getAccountDeposits();
    } else {
      this.loading = true;
      this.accountService
        .searchAccountDeposits(
          this.account.uuid,
          this.searchKey,
          this.paginationOptions
        )
        .subscribe((res: PaginatedResults) => {
          this.paginatedResults = res;

          this.accountDepositsList = res.data.map((u) => new Deposit(u));
          this.loading = false;
        });
    }
  }

  confirmDeleteDeposit(deposit: Deposit) {
    this.confirmDialogService.showConfirmDialog({
      title: 'Confirm Delete',
      message: `Are you sure you want to delete deposit ${deposit.narration}`,
      actionText: 'Delete',
      actionBtnClass: 'btn-danger',
      action: () => {
        this.loading = true;
        this.depositService.delete(deposit.uuid).subscribe({
          next: (res: Deposit) => {
            this.accountDepositsList = this.accountDepositsList.filter(
              (u) => u.uuid != deposit.uuid
            );
            this.toastService.showSuccess(
              `Deposit ${deposit.narration} has been deleted successfully.`
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
      .exportAccountDeposits(
        this.account?.uuid,
        type,
        this.searchKey,
        this.paginationOptions
      )
      .subscribe({
        next: (data) => {
          saveAs(
            data as Blob,
            `Account Deposits for ${
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
