import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TaxService } from 'src/app/core/services/tax.service';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Tax } from 'src/app/core/models/tax';
import { AlertService } from 'src/app/core/services/alert.service';
import { ActivatedRoute, Router } from '@angular/router';
import { appRoutes } from '../../../core/routes-list';
import { SettingService } from 'src/app/core/services/setting.service';
import { CustomSelectOption } from 'src/app/core/interfaces/custom-select-option';

import { BehaviorSubject } from 'rxjs';
import { ToastService } from 'src/app/core/services/toast-service.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent {
  public form!: FormGroup;
  public taxToEdit?: Tax;
  uuid?: string;

  public routes = appRoutes;

  public sub: any;
  private loadingReqestSubject = new BehaviorSubject<number>(0);
  private completedRequests = 0;

  public showValidationErrors = false;
  public loading = true;

  constructor(
    private route: ActivatedRoute,
    public fb: FormBuilder,
    private router: Router,
    private taxService: TaxService,
    private _location: Location,
    private alertService: AlertService,
    private toastService: ToastService,
    private settingService: SettingService
  ) {
    this.initializeCreateForm();

    this.sub = this.route.params.subscribe({
      next: (params) => {
        this.uuid = params['uuid'];
        if (this.uuid) {
          this.fetchTax();
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

  private initializeCreateForm() {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(199)]],
      description: ['', [Validators.required, Validators.maxLength(199)]],
      rate: ['', [Validators.required, Validators.maxLength(199)]],
    });
  }

  private initializeEditForm() {
    this.form = this.fb.group({
      name: [
        this.taxToEdit?.name,
        [Validators.required, Validators.maxLength(199)],
      ],
      description: [
        this.taxToEdit?.description,
        [Validators.required, Validators.maxLength(199)],
      ],
      rate: [
        this.taxToEdit?.rate,
        [Validators.required, Validators.maxLength(199)],
      ],
    });
  }

  fetchTax() {
    this.taxService.show(this.uuid!).subscribe({
      next: (res: any) => {
        this.taxToEdit = res;
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
    return this.taxToEdit !== undefined;
  }

  getPageTitle(): string {
    return this.isEditForm() ? `Edit ${this.taxToEdit?.name}` : 'Create Tax';
  }

  private store() {
    const data = {
      name: this.form.get('name')?.value,
      description: this.form.get('description')?.value,
      rate: this.form.get('rate')?.value,
    };

    this.loading = true;
    this.taxService.store(data).subscribe({
      next: (res: Tax) => {
        this.toastService.showSuccess(
          `Tax '${res.name}' has been added successfully.`
        );
        this.router.navigateByUrl(this.routes.administration.taxes.index);
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
      description: this.form.get('description')?.value,
      rate: this.form.get('rate')?.value,
    };

    this.loading = true;
    this.taxService.update(data, this.uuid!).subscribe({
      next: (res: any) => {
        this.toastService.showSuccess(
          `Tax '${this.taxToEdit?.name}' has been updated successfully.`
        );
        this.router.navigateByUrl(this.routes.administration.taxes.index);
      },
      error: (err: any) => {
        this.loading = false;
        this.alertService.showNotificationForHttpError(err);
      },
    });
  }
}
