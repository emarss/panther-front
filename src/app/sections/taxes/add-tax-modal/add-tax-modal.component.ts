import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { appRoutes } from 'src/app/core/routes-list';
import { AlertService } from 'src/app/core/services/alert.service';
import { TaxService } from 'src/app/core/services/tax.service';
import { Tax } from 'src/app/core/models/tax';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from 'src/app/core/services/toast-service.service';

@Component({
  selector: 'app-add-tax-modal',
  templateUrl: './add-tax-modal.component.html',
  styleUrls: ['./add-tax-modal.component.scss'],
})
export class AddTaxModalComponent {
  public form!: FormGroup;
  public routes = appRoutes;

  public showValidationErrors = false;
  public loading = false;

  constructor(
    public fb: FormBuilder,
    private taxService: TaxService,
    public activeModal: NgbActiveModal,
    private toastService: ToastService,
    private alertService: AlertService
  ) {
    this.initializeCreateForm();
  }

  ngOnInit(): void {}

  private initializeCreateForm() {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(199)]],
      description: ['', [Validators.required, Validators.maxLength(199)]],
      rate: ['', [Validators.required, Validators.maxLength(199)]],
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
      description: this.form.get('description')?.value,
      rate: this.form.get('rate')?.value,
    };

    this.loading = true;
    this.taxService.store(data).subscribe({
      next: (res: Tax) => {
        this.toastService.showSuccess(
          `Item Group '${res.name}' has been added successfully.`
        );
        localStorage.setItem('created-tax', JSON.stringify(res));
        this.activeModal.close(res);
      },
      error: (err: any) => {
        this.loading = false;
        this.alertService.showNotificationForHttpError(err);
      },
    });
  }
}
