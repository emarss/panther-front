import { Component, ElementRef, ViewChild } from '@angular/core';
import { UnitOfMeasureService } from 'src/app/core/services/unit-of-measure.service';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'src/app/core/services/alert.service';
import { ActivatedRoute, Router } from '@angular/router';
import { appRoutes } from '../../../core/routes-list';
import { BehaviorSubject } from 'rxjs';
import { UnitOfMeasure } from 'src/app/core/models/unit-of-measure';
import { ToastService } from 'src/app/core/services/toast-service.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent {
  public form!: FormGroup;
  public unitOfMeasureToEdit?: UnitOfMeasure;
  uuid?: string;

  public routes = appRoutes;

  public sub: any;
  private loadingReqestSubject = new BehaviorSubject<number>(0);
  unitOfMeasureStatusesList: Array<string> = [];

  private completedRequests = 0;

  public showValidationErrors = false;
  public loading = true;

  constructor(
    private route: ActivatedRoute,
    public fb: FormBuilder,
    private router: Router,
    private UnitOfMeasureService: UnitOfMeasureService,
    private _location: Location,
    private toastService: ToastService,
    private alertService: AlertService
  ) {
    this.initializeCreateForm();

    this.sub = this.route.params.subscribe({
      next: (params) => {
        this.uuid = params['uuid'];
        if (this.uuid) {
          this.fetchUnitOfMeasure();
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
        if ((!this.uuid && val === 1) || (this.uuid && val === 2)) {
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
      physical_quantity: ['', [Validators.required, Validators.maxLength(199)]], //optional
      unit: ['', [Validators.required, Validators.maxLength(199)]], //optional
      symbol: ['', [Validators.required, Validators.maxLength(199)]], //optional
    });
  }

  private initializeEditForm() {
    this.form = this.fb.group({
      physical_quantity: [
        this.unitOfMeasureToEdit?.physical_quantity,
        [Validators.required, Validators.maxLength(199)],
      ], //optional
      unit: [
        this.unitOfMeasureToEdit?.unit,
        [Validators.required, Validators.maxLength(199)],
      ], //optional
      symbol: [
        this.unitOfMeasureToEdit?.symbol,
        [Validators.required, Validators.maxLength(199)],
      ], //optional
    });
  }

  fetchUnitOfMeasure() {
    this.UnitOfMeasureService.show(this.uuid!).subscribe({
      next: (res: any) => {
        this.unitOfMeasureToEdit = res;
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
    return this.unitOfMeasureToEdit !== undefined;
  }

  getPageTitle(): string {
    return this.isEditForm()
      ? `Edit ${this.unitOfMeasureToEdit?.physical_quantity}`
      : 'Create Unit Of Measure';
  }

  private store() {
    const data = {
      physical_quantity: this.form.get('physical_quantity')?.value,
      unit: this.form.get('unit')?.value,
      symbol: this.form.get('symbol')?.value,
    };

    this.loading = true;
    this.UnitOfMeasureService.store(data).subscribe({
      next: (res: UnitOfMeasure) => {
        this.toastService.showSuccess(
          `Unit Of Measure '${res.physical_quantity}' has been added successfully.`
        );
        this.router.navigateByUrl(
          this.routes.administration.unit_of_measures.index
        );
      },
      error: (err: any) => {
        this.loading = false;
        this.alertService.showNotificationForHttpError(err);
      },
    });
  }

  private update() {
    const data = {
      physical_quantity: this.form.get('physical_quantity')?.value,
      unit: this.form.get('unit')?.value,
      symbol: this.form.get('symbol')?.value,
    };

    this.loading = true;
    this.UnitOfMeasureService.update(data, this.uuid!).subscribe({
      next: (res: any) => {
        this.toastService.showSuccess(
          `Unit Of Measure '${this.unitOfMeasureToEdit?.physical_quantity}' has been updated successfully.`
        );
        this.router.navigateByUrl(
          this.routes.administration.unit_of_measures.index
        );
      },
      error: (err: any) => {
        this.loading = false;
        this.alertService.showNotificationForHttpError(err);
      },
    });
  }
}
