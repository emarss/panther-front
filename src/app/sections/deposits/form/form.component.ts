import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DepositService } from 'src/app/core/services/deposit.service';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Deposit } from 'src/app/core/models/deposit';
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
import { AddAccountModalComponent } from '../../accounts/add-account-modal/add-account-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent {
  public form!: FormGroup;
  public depositToEdit?: Deposit;
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
    private depositService: DepositService,
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
          this.fetchDeposit();
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
      name: `${el?.name} (${el?.currency})`,
    };
  }

  private initializeEditForm() {
    this.form = this.fb.group({
      date: [
        this.mapDate(this.depositToEdit?.date),
        [Validators.required, Validators.maxLength(199)],
      ],
      amount: [
        this.depositToEdit?.amount,
        [Validators.required, Validators.maxLength(199)],
      ],
      exchange_rate: [
        this.depositToEdit?.exchange_rate,
        [Validators.required, Validators.maxLength(199)],
      ],
      narration: [
        this.depositToEdit?.narration,
        [Validators.required, Validators.maxLength(199)],
      ],
      account: [
        this.mapAccount(this.depositToEdit?.account),
        [Validators.required],
      ],
    });
    this.currency = this.depositToEdit?.currency!;
  }

  fetchDeposit() {
    this.depositService.show(this.uuid!).subscribe({
      next: (res: any) => {
        this.depositToEdit = res;
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
    return this.depositToEdit !== undefined;
  }

  getPageTitle(): string {
    return this.isEditForm()
      ? `Edit ${this.depositToEdit?.narration}`
      : 'Create Deposit';
  }

  mapDate(date?: number): string {
    let dateString = moment(date).format('YYYY-MM-DD');
    return dateString;
  }

  private store() {
    const data = {
      date: moment(this.form.get('date')?.value).format('x'),
      amount: this.form.get('amount')?.value,
      exchange_rate: this.form.get('exchange_rate')?.value,
      narration: this.form.get('narration')?.value,
      account_uuid: this.form.get('account')?.value.value,
      currency: this.currency,
    };
    this.loading = true;
    this.depositService.store(data).subscribe({
      next: (res: Deposit) => {
        this.toastService.showSuccess(
          `Deposit with narration '${res.narration}' has been added successfully.`
        );
        this.router.navigateByUrl(this.routes.financials.deposits.index);
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
      exchange_rate: this.form.get('exchange_rate')?.value,
      narration: this.form.get('narration')?.value,
      account_uuid: this.form.get('account')?.value.value,
      currency: this.currency,
    };

    this.loading = true;
    this.depositService.update(data, this.uuid!).subscribe({
      next: (res: any) => {
        this.toastService.showSuccess(
          `Deposit with narration '${this.depositToEdit?.narration}' has been updated successfully.`
        );
        this.router.navigateByUrl(this.routes.financials.deposits.index);
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
