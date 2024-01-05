import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Supplier } from 'src/app/core/models/supplier';
import { appRoutes } from 'src/app/core/routes-list';
import { AlertService } from 'src/app/core/services/alert.service';
import { SupplierService } from 'src/app/core/services/supplier.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject } from 'rxjs';
import { SettingService } from 'src/app/core/services/setting.service';
import { ToastService } from 'src/app/core/services/toast-service.service';

@Component({
  selector: 'app-add-supplier-modal',
  templateUrl: './add-supplier-modal.component.html',
  styleUrls: ['./add-supplier-modal.component.scss'],
})
export class AddSupplierModalComponent {
  public form!: FormGroup;
  public routes = appRoutes;
  private loadingReqestSubject = new BehaviorSubject<number>(0);
  private completedRequests = 0;

  public showValidationErrors = false;
  public loading = true;
  public showAdditionInfo = false;

  supplierTypes: Array<string> = [];

  constructor(
    public fb: FormBuilder,
    private supplierService: SupplierService,
    private settingService: SettingService,
    public activeModal: NgbActiveModal,
    private toastService: ToastService,
    private alertService: AlertService
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

    this.loadingReqestSubject.subscribe({
      next: (val: number) => {
        if (val === 1) {
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

  ngOnInit(): void {}

  private initializeCreateForm() {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(199)]],
      type: ['', [Validators.required, Validators.maxLength(199)]],
      details: ['', [Validators.maxLength(199)]],
      physical_address: ['', [Validators.maxLength(199)]],
      contact_name: ['', [Validators.maxLength(199)]],
      email: ['', [Validators.maxLength(199)]],
      phone_number: ['', [Validators.maxLength(199)]],
      bp_number: ['', [Validators.maxLength(199)]],
      vat_number: ['', [Validators.maxLength(199)]],
    });
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

    const data = {
      name: this.form.get('name')?.value,
      type: this.form.get('type')?.value,
      details: this.form.get('details')?.value,
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
        localStorage.setItem('created-supplier', JSON.stringify(res));
        this.activeModal.close(res);
      },
      error: (err: any) => {
        this.loading = false;
        this.alertService.showNotificationForHttpError(err);
      },
    });
  }
}
