import { Component, OnInit } from '@angular/core';
import { ItemGroup } from 'src/app/core/models/item-group';
import { PaginatedResults } from 'src/app/core/models/paginated_results_model';
import { PaginationOptions } from 'src/app/core/models/pagination_options';
import { appRoutes } from 'src/app/core/routes-list';
import { ItemGroupService } from 'src/app/core/services/item-group.service';
import { AlertService } from 'src/app/core/services/alert.service';
import { ConfirmDialogService } from 'src/app/core/services/confirm-dialog.service';
import * as saveAs from 'file-saver';
import * as printJS from 'print-js';
import { ToastService } from 'src/app/core/services/toast-service.service';
import * as moment from 'moment';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class IndexComponent implements OnInit {
  public loading = true;
  public item_groupsList!: Array<ItemGroup>;
  public paginatedResults!: PaginatedResults;
  public paginationOptions = new PaginationOptions(
    { sort: 'name', direction: 'asc' },
    'item_groups'
  );

  public routes = appRoutes;

  public searchKey = '';

  public sortColumns = ['name', 'description', 'date_created', 'date_updated'];

  constructor(
    private itemGroupService: ItemGroupService,
    private alertService: AlertService,
    private toastService: ToastService,
    private confirmDialogService: ConfirmDialogService
  ) {
    this.getitem_groupsList();
  }

  private getitem_groupsList() {
    this.loading = true;
    this.itemGroupService
      .get(this.paginationOptions)
      .subscribe((res: PaginatedResults) => {
        this.paginatedResults = res;

        this.item_groupsList = res.data.map((u) => new ItemGroup(u));
        this.loading = false;
      });
  }

  ngOnInit(): void {}

  confirmDelete(itemgroup: ItemGroup) {
    this.confirmDialogService.showConfirmDialog({
      title: 'Confirm Delete',
      message: `Are you sure you want to delete ${itemgroup.name}`,
      actionText: 'Delete',
      actionBtnClass: 'btn-danger',
      action: () => {
        this.loading = true;
        this.itemGroupService.delete(itemgroup.uuid).subscribe({
          next: (res: ItemGroup) => {
            this.item_groupsList = this.item_groupsList.filter(
              (u) => u.uuid != itemgroup.uuid
            );
            this.toastService.showSuccess(
              `ItemGroup '${res.name}' has been deleted successfully.`
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
    if (this.searchKey.trim().length >= 1) {
      this.search();
    } else {
      this.getitem_groupsList();
    }
  }

  search() {
    if (this.searchKey.trim().length === 0) {
      this.getitem_groupsList();
    } else {
      this.loading = true;
      this.itemGroupService
        .search(this.searchKey, this.paginationOptions)
        .subscribe((res: PaginatedResults) => {
          this.paginatedResults = res;
          this.item_groupsList = res.data.map((u) => new ItemGroup(u));
          this.loading = false;
        });
    }
  }

  exportData(type: string) {
    this.loading = true;
    this.itemGroupService
      .export(type, this.searchKey, this.paginationOptions)
      .subscribe({
        next: (data) => {
          saveAs(data as Blob, `Item Groups Exported - ${moment()}.${type}`);
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
