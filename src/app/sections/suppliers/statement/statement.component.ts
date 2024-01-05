import { Component, Input } from '@angular/core';
import { ReportOptions } from 'src/app/core/models/report-options';
import { Supplier } from 'src/app/core/models/supplier';
import { appRoutes } from 'src/app/core/routes-list';
import { AlertService } from 'src/app/core/services/alert.service';
import { SettingService } from 'src/app/core/services/setting.service';
import { SupplierService } from 'src/app/core/services/supplier.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-statement',
  templateUrl: './statement.component.html',
  styleUrls: ['./statement.component.scss'],
})
export class StatementComponent {
  @Input()
  supplier!: Supplier;

  public downloadUrl = '';

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
  public totalPurchaseOrders: number = 0;
  public totalPayments: number = 0;
  public totalRefunds: number = 0;

  constructor(
    private supplierService: SupplierService,
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
    this.supplierService
      .statement(this.supplier.uuid, this.reportOptions)
      .subscribe({
        next: (res: any) => {
          this.data = res.transactions;
          this.closingBalance = res.closing_balance;
          this.openingBalance = res.opening_balance;
          this.totalPurchaseOrders = res.total_purchase_orders;
          this.totalPayments = res.total_payments;
          this.totalRefunds = res.total_refunds;

          this.downloadUrl = `${environment.apiURL}/suppliers/statement/download/${this.supplier.uuid}?startDate=${this.reportOptions.startDate}&endDate=${this.reportOptions.endDate}`;

          this.loading = false;
        },
        error: (err: any) => {
          this.alertService.showNotificationForHttpError(err);
        },
      });
  }
}
