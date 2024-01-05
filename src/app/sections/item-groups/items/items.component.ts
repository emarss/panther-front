import { Component, Input } from '@angular/core';
import * as saveAs from 'file-saver';
import * as moment from 'moment';
import { Item } from 'src/app/core/models/item';
import { ItemGroup } from 'src/app/core/models/item-group';
import { PaginatedResults } from 'src/app/core/models/paginated_results_model';
import { PaginationOptions } from 'src/app/core/models/pagination_options';
import { appRoutes } from 'src/app/core/routes-list';
import { AlertService } from 'src/app/core/services/alert.service';
import { ConfirmDialogService } from 'src/app/core/services/confirm-dialog.service';
import { ItemGroupService } from 'src/app/core/services/item-group.service';
import { ItemService } from 'src/app/core/services/item.service';
import { SettingService } from 'src/app/core/services/setting.service';
import { ToastService } from 'src/app/core/services/toast-service.service';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss'],
})
export class ItemsComponent {
  @Input()
  itemGroup!: ItemGroup;

  public loading = true;
  public itemsList!: Array<Item>;
  public paginatedResults!: PaginatedResults;
  public paginationOptions = new PaginationOptions(
    { sort: 'description', direction: 'asc' },
    'items'
  );

  public routes = appRoutes;
  public current_currency!: string;

  public searchKey = '';

  constructor(
    private itemService: ItemService,
    private itemGroupService: ItemGroupService,
    private alertService: AlertService,
    private toastService: ToastService,
    private settingService: SettingService,
    private confirmDialogService: ConfirmDialogService
  ) {
    this.current_currency = this.settingService.getCurrentCompanyCurrency();
  }

  ngOnInit() {
    this.getItemsList();
  }

  private getItemsList() {
    this.loading = true;
    this.itemGroupService
      .getItemGroupItems(this.itemGroup.uuid, this.paginationOptions)
      .subscribe((res: PaginatedResults) => {
        this.paginatedResults = res;
        this.itemsList = res.data.map((u) => new Item(u));
        this.loading = false;
      });
  }

  confirmDelete(item: Item) {
    this.confirmDialogService.showConfirmDialog({
      title: 'Confirm Delete',
      message: `Are you sure you want to delete ${item.description}`,
      actionText: 'Delete',
      actionBtnClass: 'btn-danger',
      action: () => {
        this.loading = true;
        this.itemService.delete(item.uuid).subscribe({
          next: (res: Item) => {
            this.itemsList = this.itemsList.filter((u) => u.uuid != item.uuid);
            this.toastService.showSuccess(
              `Item '${res.description}' has been deleted successfully.`
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
      this.getItemsList();
    }
  }

  search() {
    if (this.searchKey.trim().length === 0) {
      this.getItemsList();
    } else {
      this.loading = true;
      this.itemGroupService
        .searchItemGroupItems(
          this.itemGroup?.uuid,
          this.searchKey,
          this.paginationOptions
        )
        .subscribe((res: PaginatedResults) => {
          this.paginatedResults = res;

          this.itemsList = res.data.map((u) => new Item(u));
          this.loading = false;
        });
    }
  }

  exportData(type: string) {
    this.loading = true;
    this.itemGroupService
      .exportItemGroupItems(
        this.itemGroup?.uuid,
        type,
        this.searchKey,
        this.paginationOptions
      )
      .subscribe({
        next: (data) => {
          saveAs(
            data as Blob,
            `Item Group Items for ${
              this.itemGroup?.name
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
