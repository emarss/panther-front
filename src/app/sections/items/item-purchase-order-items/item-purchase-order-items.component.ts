import { Component, Input } from '@angular/core';
import { Item } from 'src/app/core/models/item';
import { appRoutes } from 'src/app/core/routes-list';
import { AlertService } from 'src/app/core/services/alert.service';
import { ConfirmDialogService } from 'src/app/core/services/confirm-dialog.service';
import { ItemService } from 'src/app/core/services/item.service';
import { PaginationOptions } from 'src/app/core/models/pagination_options';
import { PaginatedResults } from 'src/app/core/models/paginated_results_model';
import { PurchaseOrderService } from 'src/app/core/services/purchase-order.service';
import { ToastService } from 'src/app/core/services/toast-service.service';
import { PurchaseOrderItem } from 'src/app/core/models/purchase-order-item';
import * as saveAs from 'file-saver';
import * as moment from 'moment';

@Component({
  selector: 'app-item-purchase-order-items',
  templateUrl: './item-purchase-order-items.component.html',
  styleUrls: ['./item-purchase-order-items.component.scss'],
})
export class ItemPurchaseOrderItemsComponent {
  @Input()
  item!: Item;

  itemPurchaseOrderItemsList!: Array<PurchaseOrderItem>;
  public sub: any;
  public loading = false;
  public paginatedResults!: PaginatedResults;
  public paginationOptions = new PaginationOptions(
    { sort: 'date', direction: 'desc' },
    'purchase_order_items'
  );

  public searchKey = '';

  public routes = appRoutes;

  constructor(
    private itemService: ItemService,
    private toastService: ToastService,
  ) {}

  ngOnInit() {
    this.getItemPurchaseOrderItems();
  }

  getItemPurchaseOrderItems() {
    this.loading = true;
    this.itemService
      .getItemPurchaseOrderItems(this.item.uuid, this.paginationOptions)
      .subscribe((res: PaginatedResults) => {
        this.paginatedResults = res;
        this.itemPurchaseOrderItemsList = res.data.map(
          (u) => new PurchaseOrderItem(u)
        );
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
      this.getItemPurchaseOrderItems();
    }
  }

  search() {
    if (this.searchKey.trim().length === 0) {
      this.getItemPurchaseOrderItems();
    } else {
      this.loading = true;
      this.itemService
        .searchItemPurchaseOrders(
          this.item.uuid,
          this.searchKey,
          this.paginationOptions
        )
        .subscribe((res: PaginatedResults) => {
          this.paginatedResults = res;

          this.itemPurchaseOrderItemsList = res.data.map(
            (u) => new PurchaseOrderItem(u)
          );
          this.loading = false;
        });
    }
  }

  exportData(type: string) {
    this.loading = true;
    this.itemService
      .exportItemPurchaseOrderItems(
        this.item?.uuid,
        type,
        this.searchKey,
        this.paginationOptions
      )
      .subscribe({
        next: (data) => {
          saveAs(
            data as Blob,
            `Item Purchase Order Items for ${
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
