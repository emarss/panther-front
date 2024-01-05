import { Component, Input } from '@angular/core';
import { ReportOptions } from 'src/app/core/models/report-options';
import { Item } from 'src/app/core/models/item';
import { appRoutes } from 'src/app/core/routes-list';
import { AlertService } from 'src/app/core/services/alert.service';
import { SettingService } from 'src/app/core/services/setting.service';
import { ItemService } from 'src/app/core/services/item.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-item-statement',
  templateUrl: './item-statement.component.html',
  styleUrls: ['./item-statement.component.scss'],
})
export class ItemStatementComponent {
  @Input()
  item!: Item;

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
  public openingStock: number = 0;
  public closingStock: number = 0;
  public totalPurchaseOrderItems: number = 0;
  public totalPositiveStockAdjustments: number = 0;
  public totalNegativeStockAdjustments: number = 0;

  constructor(
    private itemService: ItemService,
    private alertService: AlertService,
    private settingService: SettingService
  ) {
    this.setStartAndEndDateString();
    this.current_currency = this.settingService.getCurrentSchoolCurrency();
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
    this.itemService.statement(this.item.uuid, this.reportOptions).subscribe({
      next: (res: any) => {
        this.data = res.activity;
        this.closingStock = res.closing_stock;
        this.openingStock = res.opening_stock;
        this.totalPurchaseOrderItems = res.total_purchase_order_items;
        this.totalPositiveStockAdjustments =
          res.total_positive_stock_adjustments;
        this.totalNegativeStockAdjustments =
          res.total_negative_stock_adjustments;
        this.downloadUrl = `${environment.apiURL}/items/statement/download/${this.item.uuid}?startDate=${this.reportOptions.startDate}&endDate=${this.reportOptions.endDate}`;
        this.loading = false;
      },
      error: (err: any) => {
        this.alertService.showNotificationForHttpError(err);
      },
    });
  }
}
