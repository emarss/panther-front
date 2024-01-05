import { Component, Input } from '@angular/core';
import { ReportOptions } from 'src/app/core/models/report-options';
import { Item } from 'src/app/core/models/item';
import { appRoutes } from 'src/app/core/routes-list';
import { AlertService } from 'src/app/core/services/alert.service';
import { SettingService } from 'src/app/core/services/setting.service';
import { UserService } from 'src/app/core/services/user.service';
import { User } from 'src/app/core/models/user';

@Component({
  selector: 'app-inventory-statement',
  templateUrl: './inventory-statement.component.html',
  styleUrls: ['./inventory-statement.component.scss'],
})
export class InventoryStatementComponent {
  @Input()
  user!: User;

  public loading = true;
  public reloading = false;

  public routes = appRoutes;

  public searchKey = '';
  public current_currency!: string;

  public reportOptions = new ReportOptions({});

  public startDateString!: string;
  public endDateString!: string;

  public data: Array<any> = [];
  public openingStock: number = 0;
  public closingStock: number = 0;
  public totalStockIssues: number = 0;
  public totalStockReturns: number = 0;

  constructor(
    private userService: UserService,
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
    this.userService
      .inventoryStatement(this.user.uuid, this.reportOptions)
      .subscribe({
        next: (res: any) => {
          this.data = res.activity;
          this.closingStock = res.closing_stock;
          this.openingStock = res.opening_stock;
          this.totalStockIssues = res.total_stock_issues;
          this.totalStockReturns = res.total_stock_returns;
          this.loading = false;
        },
        error: (err: any) => {
          this.alertService.showNotificationForHttpError(err);
        },
      });
  }
}
