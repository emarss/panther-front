import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AccountService } from 'src/app/core/services/account.service';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Account } from 'src/app/core/models/account';
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
  public accountToEdit?: Account;
  uuid?: string;

  public routes = appRoutes;

  public sub: any;
  private loadingReqestSubject = new BehaviorSubject<number>(0);
  private completedRequests = 0;

  public showValidationErrors = false;
  public loading = true;
  currencies: Array<CustomSelectOption> = [];

  constructor(
    private route: ActivatedRoute,
    public fb: FormBuilder,
    private router: Router,
    private accountService: AccountService,
    private _location: Location,
    private alertService: AlertService,
    private toastService: ToastService,
    private settingService: SettingService
  ) {
    this.initializeCreateForm();

    this.settingService.getCurrencies().subscribe({
      next: (value) => {
        this.currencies = value.map((el) => {
          return {
            value: el.short,
            name: `${el.name} (${el.short})`,
          };
        });
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
          this.fetchAccount();
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
      description: ['', [Validators.required, Validators.maxLength(199)]],
      exchange_rate: ['1.00', [Validators.required, Validators.maxLength(199)]],
      currency: [null, [Validators.required, Validators.maxLength(199)]],
    });
  }

  private initializeEditForm() {
    this.form = this.fb.group({
      name: [
        this.accountToEdit?.name,
        [Validators.required, Validators.maxLength(199)],
      ],
      description: [
        this.accountToEdit?.description,
        [Validators.required, Validators.maxLength(199)],
      ],
      exchange_rate: [
        this.accountToEdit?.exchange_rate,
        [Validators.required, Validators.maxLength(199)],
      ],

      currency: [
        this.findCurrencyOption(this.accountToEdit!.currency),
        [Validators.required, Validators.maxLength(199)],
      ],
    });
  }

  fetchAccount() {
    this.accountService.show(this.uuid!).subscribe({
      next: (res: any) => {
        this.accountToEdit = res;
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

  findCurrencyOption(currency_short: string): any {
    return this.currencies.find((el) => {
      return el.value === currency_short;
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

    if (this.isEditForm()) {
      this.update();
    } else {
      this.store();
    }
  }

  public isEditForm() {
    return this.accountToEdit !== undefined;
  }

  getPageTitle(): string {
    return this.isEditForm()
      ? `Edit ${this.accountToEdit?.name}`
      : 'Create Account';
  }

  private store() {
    const data = {
      name: this.form.get('name')?.value,
      description: this.form.get('description')?.value,
      exchange_rate: this.form.get('exchange_rate')?.value,
      currency: this.form.get('currency')?.value.value,
    };

    this.loading = true;
    this.accountService.store(data).subscribe({
      next: (res: Account) => {
        this.toastService.showSuccess(
          `Account '${res.name}' has been added successfully.`
        );
        this.router.navigateByUrl(this.routes.administration.accounts.index);
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
      exchange_rate: this.form.get('exchange_rate')?.value,
      currency: this.form.get('currency')?.value.value,
    };

    this.loading = true;
    this.accountService.update(data, this.uuid!).subscribe({
      next: (res: any) => {
        this.toastService.showSuccess(
          `Account '${this.accountToEdit?.name}' has been updated successfully.`
        );
        this.router.navigateByUrl(this.routes.administration.accounts.index);
      },
      error: (err: any) => {
        this.loading = false;
        this.alertService.showNotificationForHttpError(err);
      },
    });
  }
}
