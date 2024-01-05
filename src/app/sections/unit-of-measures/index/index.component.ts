import { Component, OnInit } from '@angular/core';
import { PaginatedResults } from 'src/app/core/models/paginated_results_model';
import { PaginationOptions } from 'src/app/core/models/pagination_options';
import { appRoutes } from 'src/app/core/routes-list';
import { UnitOfMeasureService } from 'src/app/core/services/unit-of-measure.service';
import { AlertService } from 'src/app/core/services/alert.service';
import { ConfirmDialogService } from 'src/app/core/services/confirm-dialog.service';
import * as saveAs from 'file-saver';
import * as printJS from 'print-js';
import { UnitOfMeasure } from 'src/app/core/models/unit-of-measure';
import { ToastService } from 'src/app/core/services/toast-service.service';
import * as moment from 'moment';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class IndexComponent implements OnInit {
  public loading = true;
  public unit_of_measuresList!: Array<UnitOfMeasure>;
  public paginatedResults!: PaginatedResults;
  public paginationOptions = new PaginationOptions(
    { sort: 'unit', direction: 'asc' },
    'unit_of_measures'
  );

  public routes = appRoutes;

  public searchKey = '';

  public sortColumns = [
    'unit',
    'physical_quantity',
    'symbol',
    'date_created',
    'date_updated',
  ];

  constructor(
    private unitOfMeasureService: UnitOfMeasureService,
    private alertService: AlertService,
    private toastService: ToastService,
    private confirmDialogService: ConfirmDialogService
  ) {
    this.getunit_of_measuresList();
  }

  private getunit_of_measuresList() {
    this.loading = true;
    this.unitOfMeasureService
      .get(this.paginationOptions)
      .subscribe((res: PaginatedResults) => {
        this.paginatedResults = res;

        this.unit_of_measuresList = res.data.map((u) => new UnitOfMeasure(u));
        this.loading = false;
      });
  }

  ngOnInit(): void {}

  confirmDelete(unitofmeasure: UnitOfMeasure) {
    this.confirmDialogService.showConfirmDialog({
      title: 'Confirm Delete',
      message: `Are you sure you want to delete ${unitofmeasure.physical_quantity}`,
      actionText: 'Delete',
      actionBtnClass: 'btn-danger',
      action: () => {
        this.loading = true;
        this.unitOfMeasureService.delete(unitofmeasure.uuid).subscribe({
          next: (res: UnitOfMeasure) => {
            this.unit_of_measuresList = this.unit_of_measuresList.filter(
              (u) => u.uuid != unitofmeasure.uuid
            );
            this.toastService.showSuccess(
              `UnitOfMeasure '${res.physical_quantity}' has been deleted successfully.`
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
      this.getunit_of_measuresList();
    }
  }

  search() {
    if (this.searchKey.trim().length === 0) {
      this.getunit_of_measuresList();
    } else {
      this.loading = true;
      this.unitOfMeasureService
        .search(this.searchKey, this.paginationOptions)
        .subscribe((res: PaginatedResults) => {
          this.paginatedResults = res;
          this.unit_of_measuresList = res.data.map((u) => new UnitOfMeasure(u));
          this.loading = false;
        });
    }
  }

  exportData(type: string) {
    this.loading = true;
    this.unitOfMeasureService
      .export(type, this.searchKey, this.paginationOptions)
      .subscribe({
        next: (data) => {
          saveAs(
            data as Blob,
            `Unit Of Measures Exported - ${moment()}.${type}`
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
