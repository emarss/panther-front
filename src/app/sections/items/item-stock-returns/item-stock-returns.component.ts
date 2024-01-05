import { Component, Input } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Item } from 'src/app/core/models/item';
import { appRoutes } from 'src/app/core/routes-list';
import { AlertService } from 'src/app/core/services/alert.service';
import { ConfirmDialogService } from 'src/app/core/services/confirm-dialog.service';
import { ItemService } from 'src/app/core/services/item.service';
import { StockReturn } from 'src/app/core/models/stock-return';
import { PaginationOptions } from 'src/app/core/models/pagination_options';
import { PaginatedResults } from 'src/app/core/models/paginated_results_model';
import { StockReturnService } from 'src/app/core/services/stock-return.service';
import { ToastService } from 'src/app/core/services/toast-service.service';
import * as saveAs from 'file-saver';
import * as moment from 'moment';

@Component({
  selector: 'app-item-stock-returns',
  templateUrl: './item-stock-returns.component.html',
  styleUrls: ['./item-stock-returns.component.scss'],
})
export class ItemStockReturnsComponent {
  @Input()
  item!: Item;

  itemStockReturnsList!: Array<StockReturn>;
  public sub: any;
  public loading = false;
  public paginatedResults!: PaginatedResults;
  public paginationOptions = new PaginationOptions(
    { sort: 'date', direction: 'desc' },
    'stock_returns'
  );

  public searchKey = '';

  public routes = appRoutes;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private itemService: ItemService,
    private _location: Location,
    private stockReturnService: StockReturnService,
    private alertService: AlertService,
    private toastService: ToastService,
    private confirmDialogService: ConfirmDialogService
  ) {}

  ngOnInit() {
    this.getItemStockReturns();
  }

  getItemStockReturns() {
    this.loading = true;
    this.itemService
      .getItemStockReturns(this.item.uuid, this.paginationOptions)
      .subscribe((res: PaginatedResults) => {
        this.paginatedResults = res;
        this.itemStockReturnsList = res.data.map((u) => new StockReturn(u));
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
      this.getItemStockReturns();
    }
  }

  search() {
    if (this.searchKey.trim().length === 0) {
      this.getItemStockReturns();
    } else {
      this.loading = true;
      this.itemService
        .searchItemStockReturns(
          this.item.uuid,
          this.searchKey,
          this.paginationOptions
        )
        .subscribe((res: PaginatedResults) => {
          this.paginatedResults = res;

          this.itemStockReturnsList = res.data.map((u) => new StockReturn(u));
          this.loading = false;
        });
    }
  }

  confirmDeleteStockReturn(stockReturn: StockReturn) {
    this.confirmDialogService.showConfirmDialog({
      title: 'Confirm Delete',
      message: `Are you sure you want to delete for item ${stockReturn.item?.description}`,
      actionText: 'Delete',
      actionBtnClass: 'btn-danger',
      action: () => {
        this.loading = true;
        this.stockReturnService.delete(stockReturn.uuid).subscribe({
          next: (res: StockReturn) => {
            this.itemStockReturnsList = this.itemStockReturnsList.filter(
              (u) => u.uuid != stockReturn.uuid
            );
            this.toastService.showSuccess(
              `StockReturn for item ${stockReturn.item?.description} has been deleted successfully.`
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
      .exportItemStockReturns(
        this.item?.uuid,
        type,
        this.searchKey,
        this.paginationOptions
      )
      .subscribe({
        next: (data) => {
          saveAs(
            data as Blob,
            `Item Payments for ${
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
