import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'src/app/core/services/alert.service';
import { Location } from '@angular/common';
import { ContactPerson } from 'src/app/core/models/contact-person';
import { appRoutes } from 'src/app/core/routes-list';
import { ContactPersonService } from 'src/app/core/services/contact-person.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from 'src/app/core/services/toast-service.service';
import { Supplier } from 'src/app/core/models/supplier';
import { SupplierService } from 'src/app/core/services/supplier.service';
import { CustomSelectOption } from 'src/app/core/interfaces/custom-select-option';
import { BehaviorSubject } from 'rxjs';
import { AddSupplierModalComponent } from '../../suppliers/add-supplier-modal/add-supplier-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent {
  public form!: FormGroup;
  uuid?: string;

  public routes = appRoutes;

  private loadingReqestSubject = new BehaviorSubject<number>(0);
  private completedRequests = 0;

  @Input() contactPersonToEdit?: ContactPerson;

  public showValidationErrors = false;
  public loading = true;

  contactPersonTypes: Array<string> = ['Supplier'];

  suppliersList: Array<CustomSelectOption> = [];

  constructor(
    public fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private contactPersonService: ContactPersonService,
    private supplierService: SupplierService,
    private modalService: NgbModal,
    private _location: Location,
    private toastService: ToastService,
    private alertService: AlertService
  ) {
    this.initializeCreateForm();
  }

  ngOnInit(): void {
    this.supplierService.all().subscribe({
      next: (value) => {
        this.suppliersList = value.map((el: Supplier) => this.mapSupplier(el));
        this.route.params.subscribe({
          next: (params) => {
            if (params['supplier_uuid']) {
              this.form
                .get('supplier')
                ?.setValue(
                  this.suppliersList.find(
                    (el) => el.value === params['supplier_uuid']
                  )
                );
              this.form.get('type')?.setValue(this.contactPersonTypes[1]);
            }
          },
        });
        this.updateNumberOfCompletedRequests();
      },
      error: (err: any) => {
        this.loading = false;
        this.alertService.showNotificationForHttpError(err);
      },
    });

    this.route.params.subscribe({
      next: (params) => {
        this.uuid = params['uuid'];
        if (this.uuid) {
          this.fetchContactPerson();
        }
        this.updateNumberOfCompletedRequests();
      },
      error: (err: any) => {
        this.loading = false;
        this.alertService.showNotificationForHttpError(err);
      },
    });

    this.loadingReqestSubject.subscribe({
      next: (val: number) => {
        if ((!this.uuid && val === 3) || (this.uuid && val === 4)) {
          // requests to be performed
          this.loading = false;
        }
      },
    });
  }

  private updateNumberOfCompletedRequests() {
    this.completedRequests = this.completedRequests + 1;
    this.loadingReqestSubject.next(this.completedRequests);
  }

  fetchContactPerson() {
    this.contactPersonService.show(this.uuid!).subscribe({
      next: (res: any) => {
        this.contactPersonToEdit = res;
        this.initializeEditForm();
        this.updateNumberOfCompletedRequests();
        this.form.get('type')?.setValue(this.contactPersonTypes[0]);
        this.form
          .get('supplier')
          ?.setValue(
            this.suppliersList.find(
              (el) => el.value === this.contactPersonToEdit?.supplier_uuid
            )
          );
      },
      error: (err: any) => {
        this.loading = false;
      },
    });
  }

  private initializeCreateForm() {
    this.form = this.fb.group({
      contact_name: ['', [Validators.required, Validators.maxLength(199)]],
      email: ['', [Validators.maxLength(199)]],
      phone_number: ['', [Validators.maxLength(199)]],
      type: [this.contactPersonTypes[0], []],
      supplier: ['', []],
      comments: ['', []],
    });
  }

  private initializeEditForm() {
    this.form = this.fb.group({
      contact_name: [
        this.contactPersonToEdit?.contact_name,
        [Validators.required, Validators.maxLength(199)],
      ],
      email: [this.contactPersonToEdit?.email, [Validators.maxLength(199)]],
      phone_number: [
        this.contactPersonToEdit?.phone_number,
        [Validators.maxLength(199)],
      ],
      type: [this.contactPersonToEdit?.type, [Validators.maxLength(199)]],
      supplier: [
        this.mapSupplier(this.contactPersonToEdit?.supplier),
        [Validators.maxLength(199)],
      ],
      comments: [this.contactPersonToEdit?.comments, []],
    });
  }

  backClicked() {
    this._location.back();
  }

  mapSupplier(el?: Supplier): any {
    return {
      value: el?.uuid,
      name: el?.name,
    };
  }

  public save() {
    if (this.loading) {
      return;
    }

    if (!this.form.valid) {
      this.toastService.showError(
        'Please, fill up all required form fields.',
        'Validation Error'
      );
      this.showValidationErrors = true;
      return;
    }

    if (this.isEditForm()) {
      this.update();
    } else {
      this.store();
    }
  }

  public isEditForm() {
    return this.contactPersonToEdit !== undefined;
  }

  getPageTitle(): string {
    return this.isEditForm()
      ? `Edit ${this.contactPersonToEdit?.contact_name}`
      : 'Create Contact Person';
  }

  private store() {
    const data = {
      contact_name: this.form.get('contact_name')?.value,
      email: this.form.get('email')?.value,
      phone_number: this.form.get('phone_number')?.value,
      supplier_uuid: this.form.get('supplier')?.value.value,
      type: this.form.get('type')?.value,
      comments: this.form.get('comments')?.value,
    };

    this.loading = true;
    this.contactPersonService.store(data).subscribe({
      next: (res: ContactPerson) => {
        this.toastService.showSuccess(
          `Contact Person '${res.contact_name}' has been added successfully.`
        );
        this.router.navigate([
          this.routes.people.suppliers.contact_persons,
          res.supplier_uuid,
        ]);
      },
      error: (err: any) => {
        this.loading = false;
        this.alertService.showNotificationForHttpError(err);
      },
    });
  }

  createNewSupplier() {
    const modalRef = this.modalService.open(AddSupplierModalComponent, {
      centered: true,
      size: 'xl',
    });
    modalRef.result.then(() => {
      let createdSupplierString = localStorage.getItem('created-supplier');

      if (createdSupplierString) {
        localStorage.removeItem('created-supplier');
        let createdSupplier = new Supplier(JSON.parse(createdSupplierString)!);
        this.suppliersList.push(this.mapSupplier(createdSupplier));
        this.form.get('supplier')?.setValue(this.mapSupplier(createdSupplier));
      }
    });
  }


  private update() {
    const data = {
      contact_name: this.form.get('contact_name')?.value,
      email: this.form.get('email')?.value,
      phone_number: this.form.get('phone_number')?.value,
      supplier_uuid: this.form.get('supplier')?.value.value,
      type: this.form.get('type')?.value,
      comments: this.form.get('comments')?.value,
    };

    this.loading = true;
    this.contactPersonService
      .update(data, this.contactPersonToEdit?.uuid!)
      .subscribe({
        next: (res: any) => {
          this.toastService.showSuccess(
            `Contact Person '${res.contact_name}' has been added successfully.`
          );
          this.router.navigate([
            this.routes.people.suppliers.contact_persons,
            res.supplier_uuid,
          ]);
        },
        error: (err: any) => {
          this.loading = false;
          this.alertService.showNotificationForHttpError(err);
        },
      });
  }
}
