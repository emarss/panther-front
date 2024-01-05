import { Component, Input } from '@angular/core';
import { PaginatedResults } from 'src/app/core/models/paginated_results_model';
import { PaginationOptions } from 'src/app/core/models/pagination_options';
import { ReportOptions } from 'src/app/core/models/report-options';
import { User } from 'src/app/core/models/user';
import { appRoutes } from 'src/app/core/routes-list';
import { AlertService } from 'src/app/core/services/alert.service';
import { SettingService } from 'src/app/core/services/setting.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss'],
})
export class LogsComponent {
  @Input()
  user!: User;

  public loading = true;
  public reloading = false;

  public routes = appRoutes;

  public searchKey = '';
  public current_currency!: string;

  public reportOptions = new ReportOptions({});
  public paginatedResults!: PaginatedResults;
  public paginationOptions = new PaginationOptions(
    { sort: 'date_created', direction: 'desc', perPage: 10 },
    'user_logs'
  );

  public startDateString!: string;
  public endDateString!: string;

  public data: Array<any> = [];

  constructor(
    private userService: UserService,
    private alertService: AlertService,
    private settingService: SettingService
  ) {
    this.setStartAndEndDateString();
    this.current_currency = this.settingService.getCurrentSchoolCurrency();
  }

  ngOnInit() {
    this.fetchData();
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

  onPaginationChanged() {
    if (this.searchKey.trim().length >= 1) {
      // this.search();
    } else {
      this.fetchData();
    }
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

  private fetchData() {
    this.loading = true;
    this.userService
      .logs(this.user.uuid, this.paginationOptions, this.reportOptions)
      .subscribe({
        next: (res: PaginatedResults) => {
          this.data = res.data;
          this.paginatedResults = res;

          this.loading = false;
        },
        error: (err: any) => {
          this.alertService.showNotificationForHttpError(err);
        },
      });
  }
}
