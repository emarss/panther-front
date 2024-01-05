import { Component, OnInit } from '@angular/core';
import { Supplier } from 'src/app/core/models/supplier';
import { PaginatedResults } from 'src/app/core/models/paginated_results_model';
import { PaginationOptions } from 'src/app/core/models/pagination_options';
import { appRoutes } from 'src/app/core/routes-list';
import { SupplierService } from 'src/app/core/services/supplier.service';
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
  public suppliersList!: Array<Supplier>;
  public paginatedResults!: PaginatedResults;
  public paginationOptions = new PaginationOptions(
    { sort: 'name', direction: 'asc' },
    'suppliers'
  );

  public routes = appRoutes;

  public searchKey = '';

  public sortColumns = [
    'name',
    'type',
    'details',
    'physical_address',
    'contact_name',
    'email',
    'phone_number',
    'bp_number',
    'vat_number',
    'date_created',
    'date_updated',
  ];

  constructor(
    private supplierService: SupplierService,
    private alertService: AlertService,
    private toastService: ToastService,
    private confirmDialogService: ConfirmDialogService
  ) {
    this.getSuppliersList();
  }

  private getSuppliersList() {
    this.loading = true;
    this.supplierService
      .get(this.paginationOptions)
      .subscribe((res: PaginatedResults) => {
        this.paginatedResults = res;
        this.suppliersList = res.data.map((u) => new Supplier(u));
        this.loading = false;
      });
  }

  ngOnInit(): void {}

  confirmDelete(supplier: Supplier) {
    this.confirmDialogService.showConfirmDialog({
      title: 'Confirm Delete',
      message: `Are you sure you want to delete ${supplier.name}`,
      actionText: 'Delete',
      actionBtnClass: 'btn-danger',
      action: () => {
        this.loading = true;
        this.supplierService.delete(supplier.uuid).subscribe({
          next: (res: Supplier) => {
            this.suppliersList = this.suppliersList.filter(
              (u) => u.uuid != supplier.uuid
            );
            this.toastService.showSuccess(
              `Supplier '${res.name}' has been deleted successfully.`
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
      this.getSuppliersList();
    }
  }

  search() {
    if (this.searchKey.trim().length === 0) {
      this.getSuppliersList();
    } else {
      this.loading = true;
      this.supplierService
        .search(this.searchKey, this.paginationOptions)
        .subscribe((res: PaginatedResults) => {
          this.paginatedResults = res;

          this.suppliersList = res.data.map((u) => new Supplier(u));
          this.loading = false;
        });
    }
  }

  exportData(type: string) {
    this.loading = true;
    this.supplierService
      .export(type, this.searchKey, this.paginationOptions)
      .subscribe({
        next: (data) => {
          saveAs(data as Blob, `Suppliers Exported - ${moment()}.${type}`);
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
