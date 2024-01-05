import { Component, OnInit } from '@angular/core';
import * as saveAs from 'file-saver';
import * as moment from 'moment';
import { PaginatedResults } from 'src/app/core/models/paginated_results_model';
import { PaginationOptions } from 'src/app/core/models/pagination_options';
import { Notification } from 'src/app/core/models/notification';
import { appRoutes } from 'src/app/core/routes-list';
import { AlertService } from 'src/app/core/services/alert.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { ToastService } from 'src/app/core/services/toast-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class IndexComponent {
  public loading = true;
  public notificationsList: Array<Notification> = [];
  public paginatedResults!: PaginatedResults;
  public paginationOptions = new PaginationOptions(
    { sort: 'date_created', direction: 'desc', perPage: 1000 },
    'notifications'
  );

  public routes = appRoutes;

  constructor(
    private notificationService: NotificationService,
    private alertService: AlertService,
    private router: Router,
    private toastService: ToastService
  ) {
    this.getNotificationsList();
  }

  private getNotificationsList() {
    this.loading = true;
    this.notificationService
      .get(this.paginationOptions)
      .subscribe((res: PaginatedResults) => {
        this.paginatedResults = res;
        this.notificationsList = res.data.map((u) => new Notification(u));
        if (
          this.notificationsList.filter((el) => el.seen == false).length > 0
        ) {
          this.markAllAsSeen();
        }
        this.loading = false;
      });
  }

  private markAllAsSeen() {
    this.notificationService.markAllAsSeen().subscribe((res: boolean) => {
      console.info('All notifications marked as seen');
    });
  }

  ngOnInit(): void {}

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
    this.getNotificationsList();
  }

  openNotificationsPage(element: Notification) {
    let route = '';
    switch (element.type) {
      case 'Purchase Orders Due Today':
        route = this.routes.notifications.purchase_orders_due_today;
        break;
      case 'Overdue Purchases Orders':
        route = this.routes.notifications.overdue_purchase_orders;
        break;
      case 'Expired Subscriptions':
        route = this.routes.notifications.expired_subscriptions;
        break;
      case 'Subscriptions About To Expire':
        route = this.routes.notifications.subscriptions_about_to_expire;
        break;

      default:
        break;
    }

    this.router.navigate([route]);
  }
}
