import { Component, Input } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Item } from 'src/app/core/models/item';
import { appRoutes } from 'src/app/core/routes-list';
import { AlertService } from 'src/app/core/services/alert.service';
import { ConfirmDialogService } from 'src/app/core/services/confirm-dialog.service';
import { ItemService } from 'src/app/core/services/item.service';
import { StockIssue } from 'src/app/core/models/stock-issue';
import { PaginationOptions } from 'src/app/core/models/pagination_options';
import { PaginatedResults } from 'src/app/core/models/paginated_results_model';
import { StockIssueService } from 'src/app/core/services/stock-issue.service';
import { ToastService } from 'src/app/core/services/toast-service.service';
import * as saveAs from 'file-saver';
import * as moment from 'moment';

@Component({
  selector: 'app-item-stock-issues',
  templateUrl: './item-stock-issues.component.html',
  styleUrls: ['./item-stock-issues.component.scss'],
})
export class ItemStockIssuesComponent {
  @Input()
  item!: Item;

  itemStockIssuesList!: Array<StockIssue>;
  public sub: any;
  public loading = false;
  public paginatedResults!: PaginatedResults;
  public paginationOptions = new PaginationOptions(
    { sort: 'date', direction: 'desc' },
    'stock_issues'
  );

  public searchKey = '';

  public routes = appRoutes;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private itemService: ItemService,
    private _location: Location,
    private stockIssueService: StockIssueService,
    private alertService: AlertService,
    private toastService: ToastService,
    private confirmDialogService: ConfirmDialogService
  ) {}

  ngOnInit() {
    this.getItemStockIssues();
  }

  getItemStockIssues() {
    this.loading = true;
    this.itemService
      .getItemStockIssues(this.item.uuid, this.paginationOptions)
      .subscribe((res: PaginatedResults) => {
        this.paginatedResults = res;
        this.itemStockIssuesList = res.data.map((u) => new StockIssue(u));
        this.loading = false;
      });
  }

  backClicked() {
    this._location.back();
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
      this.getItemStockIssues();
    }
  }

  search() {
    if (this.searchKey.trim().length === 0) {
      this.getItemStockIssues();
    } else {
      this.loading = true;
      this.itemService
        .searchItemStockIssues(
          this.item.uuid,
          this.searchKey,
          this.paginationOptions
        )
        .subscribe((res: PaginatedResults) => {
          this.paginatedResults = res;

          this.itemStockIssuesList = res.data.map((u) => new StockIssue(u));
          this.loading = false;
        });
    }
  }

  confirmDeleteStockIssue(stockIssue: StockIssue) {
    this.confirmDialogService.showConfirmDialog({
      title: 'Confirm Delete',
      message: `Are you sure you want to delete for item ${stockIssue.item?.description}`,
      actionText: 'Delete',
      actionBtnClass: 'btn-danger',
      action: () => {
        this.loading = true;
        this.stockIssueService.delete(stockIssue.uuid).subscribe({
          next: (res: StockIssue) => {
            this.itemStockIssuesList = this.itemStockIssuesList.filter(
              (u) => u.uuid != stockIssue.uuid
            );
            this.toastService.showSuccess(
              `StockIssue for item ${stockIssue.item?.description} has been deleted successfully.`
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
    this.itemService
      .exportItemStockIssues(
        this.item?.uuid,
        type,
        this.searchKey,
        this.paginationOptions
      )
      .subscribe({
        next: (data) => {
          saveAs(
            data as Blob,
            `Item Stock Issues for ${
              this.item?.description
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
