import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { appRoutes } from 'src/app/core/routes-list';
import { AlertService } from 'src/app/core/services/alert.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject } from 'rxjs';
import { ToastService } from 'src/app/core/services/toast-service.service';
import { UnitOfMeasureService } from 'src/app/core/services/unit-of-measure.service';
import { UnitOfMeasure } from 'src/app/core/models/unit-of-measure';

@Component({
  selector: 'app-add-unit-of-measure-modal',
  templateUrl: './add-unit-of-measure-modal.component.html',
  styleUrls: ['./add-unit-of-measure-modal.component.scss'],
})
export class AddUnitOfMeasureModalComponent {
  public form!: FormGroup;
  public routes = appRoutes;

  public showValidationErrors = false;
  public loading = false;

  constructor(
    public fb: FormBuilder,
    private unitOfMeasureService: UnitOfMeasureService,
    public activeModal: NgbActiveModal,
    private toastService: ToastService,
    private alertService: AlertService
  ) {
    this.initializeCreateForm();
  }

  ngOnInit(): void {}

  private initializeCreateForm() {
    this.form = this.fb.group({
      physical_quantity: ['', [Validators.required, Validators.maxLength(199)]], //optional
      unit: ['', [Validators.required, Validators.maxLength(199)]], //optional
      symbol: ['', [Validators.required, Validators.maxLength(199)]], //optional
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
      physical_quantity: this.form.get('physical_quantity')?.value,
      unit: this.form.get('unit')?.value,
      symbol: this.form.get('symbol')?.value,
    };

    this.loading = true;
    this.unitOfMeasureService.store(data).subscribe({
      next: (res: UnitOfMeasure) => {
        this.toastService.showSuccess(
          `Unit of Measure '${res.unit}' has been added successfully.`
        );
        localStorage.setItem('created-unitOfMeasure', JSON.stringify(res));
        this.activeModal.close(res);
      },
      error: (err: any) => {
        this.loading = false;

        this.alertService.showNotificationForHttpError(err);
      },
    });
  }
}
