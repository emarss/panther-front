import { Component, ElementRef, ViewChild } from '@angular/core';
import { BankAccountService } from 'src/app/core/services/bank-account.service';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'src/app/core/services/alert.service';
import { ActivatedRoute, Router } from '@angular/router';
import { appRoutes } from '../../../core/routes-list';
import { BehaviorSubject } from 'rxjs';
import { BankAccount } from 'src/app/core/models/bank-account';
import { SettingService } from 'src/app/core/services/setting.service';
import { ToastService } from 'src/app/core/services/toast-service.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent {
  public form!: FormGroup;
  public bankAccountToEdit?: BankAccount;
  uuid?: string;

  public routes = appRoutes;

  public sub: any;
  private loadingReqestSubject = new BehaviorSubject<number>(0);
  bankAccountStatusesList: Array<string> = [];

  private completedRequests = 0;

  public showValidationErrors = false;
  public loading = true;

  constructor(
    private route: ActivatedRoute,
    public fb: FormBuilder,
    private router: Router,
    private BankAccountService: BankAccountService,
    private _location: Location,
    private settingService: SettingService,
    private toastService: ToastService,
    private alertService: AlertService
  ) {
    this.initializeCreateForm();

    this.settingService.getBankAccountStatuses().subscribe({
      next: (value) => {
        this.bankAccountStatusesList = value;
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
          this.fetchBankAccount();
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

  ngOnInit(): void {}

  private initializeCreateForm() {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(199)]], //optional
      account_holder: ['', [Validators.required, Validators.maxLength(199)]], //optional
      bank_name: ['', [Validators.required, Validators.maxLength(199)]], //optional
      status: ['', [Validators.required, Validators.maxLength(199)]], //optional
      priority: ['', [Validators.required, Validators.maxLength(199)]], //optional
      bank_branch: ['', [Validators.maxLength(199)]], //optional
      bank_account: ['', [Validators.required, Validators.maxLength(199)]], //optional
    });
  }

  private initializeEditForm() {
    this.form = this.fb.group({
      title: [
        this.bankAccountToEdit?.title,
        [Validators.required, Validators.maxLength(199)],
      ], //optional
      bank_name: [
        this.bankAccountToEdit?.bank_name,
        [Validators.required, Validators.maxLength(199)],
      ], //optional
      account_holder: [
        this.bankAccountToEdit?.account_holder,
        [Validators.required, Validators.maxLength(199)],
      ], //optional
      status: [
        this.bankAccountToEdit?.status,
        [Validators.required, Validators.maxLength(199)],
      ], //optional
      priority: [
        this.bankAccountToEdit?.priority,
        [Validators.required, Validators.maxLength(199)],
      ], //optional
      bank_branch: [
        this.bankAccountToEdit?.bank_branch,
        [Validators.maxLength(199)],
      ], //optional
      bank_account: [
        this.bankAccountToEdit?.bank_account,
        [Validators.required, Validators.maxLength(199)],
      ], //optional
    });
  }

  fetchBankAccount() {
    this.BankAccountService.show(this.uuid!).subscribe({
      next: (res: any) => {
        this.bankAccountToEdit = res;
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
    return this.bankAccountToEdit !== undefined;
  }

  getPageTitle(): string {
    return this.isEditForm()
      ? `Edit ${this.bankAccountToEdit?.title}`
      : 'Create BankAccount';
  }

  private store() {
    const data = {
      title: this.form.get('title')?.value,
      bank_name: this.form.get('bank_name')?.value,
      account_holder: this.form.get('account_holder')?.value,
      bank_branch: this.form.get('bank_branch')?.value,
      bank_account: this.form.get('bank_account')?.value,
      status: this.form.get('status')?.value,
      priority: this.form.get('priority')?.value,
    };

    this.loading = true;
    this.BankAccountService.store(data).subscribe({
      next: (res: BankAccount) => {
        this.toastService.showSuccess(
          `Bank Account '${res.title}' has been added successfully.`
        );
        this.router.navigateByUrl(
          this.routes.administration.bank_accounts.index
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
      title: this.form.get('title')?.value,
      bank_name: this.form.get('bank_name')?.value,
      account_holder: this.form.get('account_holder')?.value,
      bank_branch: this.form.get('bank_branch')?.value,
      bank_account: this.form.get('bank_account')?.value,
      status: this.form.get('status')?.value,
      priority: this.form.get('priority')?.value,
    };

    this.loading = true;
    this.BankAccountService.update(data, this.uuid!).subscribe({
      next: (res: any) => {
        this.toastService.showSuccess(
          `Bank Account '${this.bankAccountToEdit?.title}' has been updated successfully.`
        );
        this.router.navigateByUrl(
          this.routes.administration.bank_accounts.index
        );
      },
      error: (err: any) => {
        this.loading = false;
        this.alertService.showNotificationForHttpError(err);
      },
    });
  }
}
