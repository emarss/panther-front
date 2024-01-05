import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SupplierService } from 'src/app/core/services/supplier.service';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Supplier } from 'src/app/core/models/supplier';
import { AlertService } from 'src/app/core/services/alert.service';
import { ActivatedRoute, Router } from '@angular/router';
import { appRoutes } from '../../../core/routes-list';
import { SettingService } from 'src/app/core/services/setting.service';
import { BehaviorSubject } from 'rxjs';
import { ToastService } from 'src/app/core/services/toast-service.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent {
  public form!: FormGroup;
  public supplierToEdit?: Supplier;
  uuid?: string;

  public routes = appRoutes;

  public sub: any;
  private loadingReqestSubject = new BehaviorSubject<number>(0);
  private completedRequests = 0;

  public showValidationErrors = false;
  public loading = true;
  supplierTypes: Array<string> = [];

  constructor(
    private route: ActivatedRoute,
    public fb: FormBuilder,
    private router: Router,
    private supplierService: SupplierService,
    private _location: Location,
    private alertService: AlertService,
    private toastService: ToastService,
    private settingService: SettingService
  ) {
    this.initializeCreateForm();

    this.settingService.getSupplierTypes().subscribe({
      next: (value) => {
        this.supplierTypes = value;
        this.form.get('type')?.setValue(this.supplierTypes[0]);
        this.updateNumberOfCompletedRequests();
      },
      error: (err: any) => {
        this.loading = false;
        this.alertService.showNotificationForHttpError(err);
      },
    });

    this.sub = this.route.params.subscribe({
      next: (params) => {
        this.uuid = params['uuid'];
        if (this.uuid) {
          this.fetchSupplier();
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
        if ((!this.uuid && val === 2) || (this.uuid && val === 3)) {
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

  private initializeCreateForm() {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(199)]],
      type: ['', [Validators.required, Validators.maxLength(199)]],
      details: ['', [Validators.maxLength(199)]],
      website: ['', [Validators.maxLength(199)]],
      physical_address: ['', [Validators.maxLength(199)]],
      contact_name: ['', [Validators.maxLength(199)]],
      email: ['', [Validators.maxLength(199)]],
      phone_number: ['', [Validators.maxLength(199)]],
      bp_number: ['', [Validators.maxLength(199)]],
      vat_number: ['', [Validators.maxLength(199)]],
    });
  }

  private initializeEditForm() {
    this.form = this.fb.group({
      name: [
        this.supplierToEdit?.name,
        [Validators.required, Validators.maxLength(199)],
      ],
      type: [
        this.supplierToEdit?.type,
        [Validators.required, Validators.maxLength(199)],
      ],
      details: [this.supplierToEdit?.details, [Validators.maxLength(199)]],
      website: [this.supplierToEdit?.website, [Validators.maxLength(199)]],
      physical_address: [
        this.supplierToEdit?.physical_address,
        [Validators.maxLength(199)],
      ],
      contact_name: [
        this.supplierToEdit?.contact_name,
        [Validators.maxLength(199)],
      ],
      email: [this.supplierToEdit?.email, [Validators.maxLength(199)]],
      phone_number: [
        this.supplierToEdit?.phone_number,
        [Validators.maxLength(199)],
      ],
      bp_number: [
        this.supplierToEdit?.bp_number,
        [Validators.maxLength(199)],
      ],
      vat_number: [
        this.supplierToEdit?.vat_number,
        [Validators.maxLength(199)],
      ],
    });
  }

  fetchSupplier() {
    this.supplierService.show(this.uuid!).subscribe({
      next: (res: any) => {
        this.supplierToEdit = res;
        this.initializeEditForm();
        this.updateNumberOfCompletedRequests();
      },
      error: (err: any) => {
        this.loading = false;
      },
    });
  }

  backClicked() {
    this._location.back();
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
    return this.supplierToEdit !== undefined;
  }

  getPageTitle(): string {
    return this.isEditForm()
      ? `Edit ${this.supplierToEdit?.name}`
      : 'Create Supplier';
  }

  private store() {
    const data = {
      name: this.form.get('name')?.value,
      type: this.form.get('type')?.value,
      details: this.form.get('details')?.value,
      website: this.form.get('website')?.value,
      physical_address: this.form.get('physical_address')?.value,
      contact_name: this.form.get('contact_name')?.value,
      email: this.form.get('email')?.value,
      phone_number: this.form.get('phone_number')?.value,
      bp_number: this.form.get('bp_number')?.value,
      vat_number: this.form.get('vat_number')?.value,
    };

    this.loading = true;
    this.supplierService.store(data).subscribe({
      next: (res: Supplier) => {
        this.toastService.showSuccess(
          `Supplier '${res.name}' has been added successfully.`
        );
        this.router.navigateByUrl(this.routes.people.suppliers.index);
      },
      error: (err: any) => {
        this.loading = false;
        this.alertService.showNotificationForHttpError(err);
      },
    });
  }

  private update() {
    const data = {
      name: this.form.get('name')?.value,
      type: this.form.get('type')?.value,
      details: this.form.get('details')?.value,
      website: this.form.get('website')?.value,
      physical_address: this.form.get('physical_address')?.value,
      contact_name: this.form.get('contact_name')?.value,
      email: this.form.get('email')?.value,
      phone_number: this.form.get('phone_number')?.value,
      bp_number: this.form.get('bp_number')?.value,
      vat_number: this.form.get('vat_number')?.value,
    };

    this.loading = true;
    this.supplierService.update(data, this.uuid!).subscribe({
      next: (res: any) => {
        this.toastService.showSuccess(
          `Supplier '${this.supplierToEdit?.name}' has been updated successfully.`
        );
        this.router.navigateByUrl(this.routes.people.suppliers.index);
      },
      error: (err: any) => {
        this.loading = false;
        this.alertService.showNotificationForHttpError(err);
      },
    });
  }
}
