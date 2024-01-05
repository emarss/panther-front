import { Component, OnInit } from '@angular/core';
import { PaginatedResults } from 'src/app/core/models/paginated_results_model';
import { PaginationOptions } from 'src/app/core/models/pagination_options';
import { appRoutes } from 'src/app/core/routes-list';
import { ContactPersonService } from 'src/app/core/services/contact-person.service';
import { AlertService } from 'src/app/core/services/alert.service';
import { ConfirmDialogService } from 'src/app/core/services/confirm-dialog.service';
import { ContactPerson } from 'src/app/core/models/contact-person';
import * as saveAs from 'file-saver';
import { ToastService } from 'src/app/core/services/toast-service.service';
import * as moment from 'moment';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class IndexComponent implements OnInit {
  public loading = true;
  public contactPersonsList!: Array<ContactPerson>;
  public paginatedResults!: PaginatedResults;
  public paginationOptions = new PaginationOptions(
    { sort: 'contact_name', direction: 'desc' },
    'contact_people'
  );

  public routes = appRoutes;

  public searchKey = '';

  public sortColumns = [
    'supplier',
    'contact_name',
    'type',
    'comments',
    'email',
    'phone_number',
    'date_created',
    'date_updated',
  ];

  constructor(
    private contactPersonService: ContactPersonService,
    private alertService: AlertService,
    private toastService: ToastService,
    private confirmDialogService: ConfirmDialogService
  ) {
    this.getContactPersonsList();
  }

  private getContactPersonsList() {
    this.loading = true;
    this.contactPersonService
      .get(this.paginationOptions)
      .subscribe((res: PaginatedResults) => {
        this.paginatedResults = res;
        this.contactPersonsList = res.data.map((u) => new ContactPerson(u));
        this.loading = false;
      });
  }

  ngOnInit(): void {}

  confirmDelete(contactPerson: ContactPerson) {
    this.confirmDialogService.showConfirmDialog({
      title: 'Confirm Delete',
      message: `Are you sure you want to delete contact person ${contactPerson.contact_name}`,
      actionText: 'Delete',
      actionBtnClass: 'btn-danger',
      action: () => {
        this.loading = true;
        this.contactPersonService.delete(contactPerson.uuid).subscribe({
          next: (res: ContactPerson) => {
            this.contactPersonsList = this.contactPersonsList.filter(
              (u) => u.uuid != contactPerson.uuid
            );
            this.toastService.showSuccess(
              `Contact Person ${contactPerson.contact_name} has been deleted successfully.`
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
      this.getContactPersonsList();
    }
  }

  search() {
    if (this.searchKey.trim().length === 0) {
      this.getContactPersonsList();
    } else {
      this.loading = true;
      this.contactPersonService
        .search(this.searchKey, this.paginationOptions)
        .subscribe((res: PaginatedResults) => {
          this.paginatedResults = res;

          this.contactPersonsList = res.data.map((u) => new ContactPerson(u));
          this.loading = false;
        });
    }
  }

  exportData(type: string) {
    this.loading = true;
    this.contactPersonService
      .export(type, this.searchKey, this.paginationOptions)
      .subscribe({
        next: (data) => {
          saveAs(
            data as Blob,
            `Contact Persons Exported - ${moment()}.${type}`
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
