import { Component, Input } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Supplier } from 'src/app/core/models/supplier';
import { appRoutes } from 'src/app/core/routes-list';
import { AlertService } from 'src/app/core/services/alert.service';
import { ConfirmDialogService } from 'src/app/core/services/confirm-dialog.service';
import { ContactPerson } from 'src/app/core/models/contact-person';
import { PaginationOptions } from 'src/app/core/models/pagination_options';
import { PaginatedResults } from 'src/app/core/models/paginated_results_model';
import { ContactPersonService } from 'src/app/core/services/contact-person.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SupplierService } from 'src/app/core/services/supplier.service';
import { ToastService } from 'src/app/core/services/toast-service.service';
import * as saveAs from 'file-saver';
import * as moment from 'moment';

@Component({
  selector: 'app-supplier-contact-persons',
  templateUrl: './supplier-contact-persons.component.html',
  styleUrls: ['./supplier-contact-persons.component.scss'],
})
export class SupplierContactPersonsComponent {
  @Input()
  supplier!: Supplier;

  supplierContactPersonsList!: Array<ContactPerson>;
  public sub: any;
  public loading = false;
  public paginatedResults!: PaginatedResults;
  public paginationOptions = new PaginationOptions(
    { sort: 'contact_name', direction: 'desc' },
    'contact_people'
  );

  public searchKey = '';

  public routes = appRoutes;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private supplierService: SupplierService,
    private _location: Location,
    private modalService: NgbModal,
    private contactPersonService: ContactPersonService,
    private alertService: AlertService,
    private toastService: ToastService,
    private confirmDialogService: ConfirmDialogService
  ) {}

  ngOnInit() {
    this.getSupplierContactPersons();
  }

  getSupplierContactPersons() {
    this.loading = true;
    this.supplierService
      .getSupplierContactPersons(this.supplier.uuid, this.paginationOptions)
      .subscribe((res: PaginatedResults) => {
        this.paginatedResults = res;
        this.supplierContactPersonsList = res.data.map(
          (u) => new ContactPerson(u)
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
      this.getSupplierContactPersons();
    }
  }

  search() {
    if (this.searchKey.trim().length === 0) {
      this.getSupplierContactPersons();
    } else {
      this.loading = true;
      this.supplierService
        .searchSupplierContactPersons(
          this.supplier.uuid,
          this.searchKey,
          this.paginationOptions
        )
        .subscribe((res: PaginatedResults) => {
          this.paginatedResults = res;

          this.supplierContactPersonsList = res.data.map(
            (u) => new ContactPerson(u)
          );
          this.loading = false;
        });
    }
  }

  confirmDeleteContactPerson(contactPerson: ContactPerson) {
    this.confirmDialogService.showConfirmDialog({
      title: 'Confirm Delete',
      message: `Are you sure you want to delete ${contactPerson.contact_name}`,
      actionText: 'Delete',
      actionBtnClass: 'btn-danger',
      action: () => {
        this.loading = true;
        this.contactPersonService.delete(contactPerson.uuid).subscribe({
          next: (res: ContactPerson) => {
            this.supplierContactPersonsList =
              this.supplierContactPersonsList.filter(
                (u) => u.uuid != contactPerson.uuid
              );
            this.toastService.showSuccess(
              `Contact Person ${contactPerson.contact_name} has been deleted successfully.`
            );
            this.loading = false;
            this.router.onSameUrlNavigation = 'reload';
            this.router.navigate([
              this.routes.people.suppliers.contact_persons,
              this.supplier.uuid,
            ]);
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
    this.supplierService
      .exportSupplierContactPersons(
        this.supplier?.uuid,
        type,
        this.searchKey,
        this.paginationOptions
      )
      .subscribe({
        next: (data) => {
          saveAs(
            data as Blob,
            `Supplier Contact Persons for ${
              this.supplier?.name
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
