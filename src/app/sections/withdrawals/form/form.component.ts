import { Component } from '@angular/core';
import { WithdrawalService } from 'src/app/core/services/withdrawal.service';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Withdrawal } from 'src/app/core/models/withdrawal';
import { AlertService } from 'src/app/core/services/alert.service';
import { ActivatedRoute, Router } from '@angular/router';
import { appRoutes } from '../../../core/routes-list';
import { SettingService } from 'src/app/core/services/setting.service';
import { CustomSelectOption } from 'src/app/core/interfaces/custom-select-option';

import { Account } from 'src/app/core/models/account';
import { AccountService } from 'src/app/core/services/account.service';
import * as moment from 'moment';
import { BehaviorSubject } from 'rxjs';
import { ToastService } from 'src/app/core/services/toast-service.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddAccountModalComponent } from '../../accounts/add-account-modal/add-account-modal.component';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent {
  public form!: FormGroup;
  public withdrawalToEdit?: Withdrawal;
  uuid?: string;

  public routes = appRoutes;

  public sub: any;
  private loadingReqestSubject = new BehaviorSubject<number>(0);
  private completedRequests = 0;

  public showValidationErrors = false;
  public loading = true;
  accountsOptionsList: Array<CustomSelectOption> = [];
  accountsList: Array<Account> = [];
  itemsList: Array<CustomSelectOption> = [];
  currency!: string;
  current_currency!: string;

  constructor(
    private route: ActivatedRoute,
    public fb: FormBuilder,
    private router: Router,
    private withdrawalService: WithdrawalService,
    private _location: Location,
    private alertService: AlertService,
    private toastService: ToastService,
    private modalService: NgbModal,
    private accountService: AccountService,
    private settingService: SettingService
  ) {
    this.initializeCreateForm();
    this.current_currency = this.settingService.getCurrentSchoolCurrency();
    this.currency = this.settingService.getCurrentSchoolCurrency();

    this.accountService.all().subscribe({
      next: (value) => {
        this.accountsList = value.map((el: Account) => new Account(el));
        this.accountsOptionsList = value.map((el: Account) =>
          this.mapAccount(el)
        );
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
          this.fetchWithdrawal();
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

  public getConvertedAmount() {
    const exchangeRate = this.form.get('exchange_rate')?.value;
    const amount = this.form.get('amount')?.value;
    if (exchangeRate && amount) {
      return amount * exchangeRate;
    }
    return '0';
  }

  private initializeCreateForm() {
    this.form = this.fb.group({
      date: [this.mapDate(), [Validators.required, Validators.maxLength(199)]],
      amount: ['', [Validators.required, Validators.maxLength(199)]],
      exchange_rate: ['1.00', [Validators.required, Validators.maxLength(199)]],
      narration: ['', [Validators.required, Validators.maxLength(199)]],
      account: ['', [Validators.required]],
    });
  }

  mapAccount(el?: Account): any {
    return {
      value: el?.uuid,
      name: el?.name,
    };
  }

  private initializeEditForm() {
    this.form = this.fb.group({
      date: [
        this.mapDate(this.withdrawalToEdit?.date),
        [Validators.required, Validators.maxLength(199)],
      ],
      amount: [
        this.withdrawalToEdit?.amount,
        [Validators.required, Validators.maxLength(199)],
      ],
      narration: [
        this.withdrawalToEdit?.narration,
        [Validators.required, Validators.maxLength(199)],
      ],
      exchange_rate: [
        this.withdrawalToEdit?.exchange_rate,
        [Validators.required, Validators.maxLength(199)],
      ],
      account: [
        this.mapAccount(this.withdrawalToEdit?.account),
        [Validators.required],
      ],
    });
    this.currency = this.withdrawalToEdit?.currency!;
  }

  fetchWithdrawal() {
    this.withdrawalService.show(this.uuid!).subscribe({
      next: (res: any) => {
        this.withdrawalToEdit = res;
        this.initializeEditForm();
        this.updateNumberOfCompletedRequests();
      },
      error: (err: any) => {
        this.loading = false;
      },
    });
  }

  selectedAccountChanged() {
    const selectedAccount = this.accountsList.filter(
      (el) => el.uuid === this.form.get('account')?.value.value
    )[0];
    if (selectedAccount) {
      this.currency = selectedAccount.currency;
      this.form.get('exchange_rate')?.setValue(selectedAccount.exchange_rate);
    }
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
    return this.withdrawalToEdit !== undefined;
  }

  getPageTitle(): string {
    return this.isEditForm()
      ? `Edit ${this.withdrawalToEdit?.narration}`
      : 'Create Withdrawal';
  }

  mapDate(date?: number): string {
    let dateString = moment(date).format('YYYY-MM-DD');
    return dateString;
  }

  private store() {
    const data = {
      date: moment(this.form.get('date')?.value).format('x'),
      amount: this.form.get('amount')?.value,
      narration: this.form.get('narration')?.value,
      account_uuid: this.form.get('account')?.value.value,
      exchange_rate: this.form.get('exchange_rate')?.value,
      currency: this.currency,
    };
    this.loading = true;
    this.withdrawalService.store(data).subscribe({
      next: (res: Withdrawal) => {
        this.toastService.showSuccess(
          `Withdrawal with narration '${res.narration}' has been added successfully.`
        );
        this.router.navigateByUrl(this.routes.financials.withdrawals.index);
      },
      error: (err: any) => {
        this.loading = false;
        this.alertService.showNotificationForHttpError(err);
      },
    });
  }

  private update() {
    const data = {
      date: moment(this.form.get('date')?.value).format('x'),
      amount: this.form.get('amount')?.value,
      narration: this.form.get('narration')?.value,
      account_uuid: this.form.get('account')?.value.value,
      exchange_rate: this.form.get('exchange_rate')?.value,

      currency: this.currency,
    };

    this.loading = true;
    this.withdrawalService.update(data, this.uuid!).subscribe({
      next: (res: any) => {
        this.toastService.showSuccess(
          `Withdrawal with narration '${this.withdrawalToEdit?.narration}' has been updated successfully.`
        );
        this.router.navigateByUrl(this.routes.financials.withdrawals.index);
      },
      error: (err: any) => {
        this.loading = false;
        this.alertService.showNotificationForHttpError(err);
      },
    });
  }

  createNewAccount() {
    const modalRef = this.modalService.open(AddAccountModalComponent, {
      centered: true,
      size: 'lg',
    });
    modalRef.result.then(() => {
      let createdAccountString = localStorage.getItem('created-account');

      if (createdAccountString) {
        localStorage.removeItem('created-account');
        let createdAccount = new Account(JSON.parse(createdAccountString)!);
        this.accountsList.push(this.mapAccount(createdAccount));
        this.form.get('account')?.setValue(this.mapAccount(createdAccount));
      }
    });
  }
}
