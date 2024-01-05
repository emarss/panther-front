import { Component, Input } from '@angular/core';
import { ReportOptions } from 'src/app/core/models/report-options';
import { Account } from 'src/app/core/models/account';
import { appRoutes } from 'src/app/core/routes-list';
import { AlertService } from 'src/app/core/services/alert.service';
import { SettingService } from 'src/app/core/services/setting.service';
import { AccountService } from 'src/app/core/services/account.service';

@Component({
  selector: 'app-statement',
  templateUrl: './statement.component.html',
  styleUrls: ['./statement.component.scss'],
})
export class StatementComponent {
  @Input()
  account!: Account;

  public loading = true;
  public reloading = false;

  public routes = appRoutes;

  public searchKey = '';
  public current_currency!: string;

  public reportOptions = new ReportOptions({});

  public startDateString!: string;
  public endDateString!: string;

  public data: Array<any> = [];
  public openingBalance: number = 0;
  public closingBalance: number = 0;
  public totalDeposits: number = 0;
  public totalWithdrawals: number = 0;
  public totalPayments: number = 0;
  public totalReceipts: number = 0;

  constructor(
    private accountService: AccountService,
    private alertService: AlertService,
    private settingService: SettingService
  ) {
    this.setStartAndEndDateString();
    this.current_currency = this.settingService.getCurrentCompanyCurrency();
  }

  ngOnInit() {
    this.fetchData();
  }

  private setStartAndEndDateString() {
    this.endDateString = this.reportOptions.endDateString;
    this.startDateString = this.reportOptions.startDateString;
  }

  public setPeriod(period: string) {
    this.reportOptions.setPeriod(period);
    this.reloading = !this.reloading;
    this.fetchData();
  }

  public setSegment(segment: string) {
    this.reportOptions.setSegment(segment);
    this.setStartAndEndDateString();

    this.fetchData();
  }

  public endDateChanged() {
    this.reportOptions.setEndDate(this.endDateString);
    this.fetchData();
  }

  public startDateChanged() {
    this.reportOptions.setStartDate(this.startDateString);
    this.fetchData();
  }

  private fetchData() {
    this.loading = true;
    this.accountService
      .statement(this.account.uuid, this.reportOptions)
      .subscribe({
        next: (res: any) => {
          this.data = res.transactions;
          this.closingBalance = res.closing_balance;
          this.openingBalance = res.opening_balance;
          this.totalDeposits = res.total_deposits;
          this.totalWithdrawals = res.total_withdrawals;
          this.totalPayments = res.total_payments;
          this.totalReceipts = res.total_receipts;
          this.loading = false;
        },
        error: (err: any) => {
          this.alertService.showNotificationForHttpError(err);
        },
      });
  }
}
