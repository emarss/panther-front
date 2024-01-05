import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'src/app/core/services/alert.service';
import { Router } from '@angular/router';
import { appRoutes } from '../../../core/routes-list';
import { SettingService } from 'src/app/core/services/setting.service';
import { CustomSelectOption } from 'src/app/core/interfaces/custom-select-option';

import { Account } from 'src/app/core/models/account';
import { AccountService } from 'src/app/core/services/account.service';
import * as moment from 'moment';
import { PaymentService } from 'src/app/core/services/payment.service';
import { BehaviorSubject } from 'rxjs';
import { PurchaseOrder } from 'src/app/core/models/purchase-order';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from 'src/app/core/services/toast-service.service';
import { AddAccountModalComponent } from '../../accounts/add-account-modal/add-account-modal.component';

@Component({
  selector: 'app-add-payment',
  templateUrl: './add-payment.component.html',
  styleUrls: ['./add-payment.component.scss'],
})
export class AddPaymentComponent {
  @Input()
  public purchaseOrder!: PurchaseOrder;
  public form!: FormGroup;

  public routes = appRoutes;

  private loadingReqestSubject = new BehaviorSubject<number>(0);
  private completedRequests = 0;

  public showValidationErrors = false;
  public loading = true;
  accountsOptionsList: Array<CustomSelectOption> = [];
  accountsList: Array<Account> = [];
  currency!: string;
  current_currency!: string;

  constructor(
    public fb: FormBuilder,
    private router: Router,
    private paymentService: PaymentService,
    private _location: Location,
    private alertService: AlertService,
    private modalService: NgbModal,
    private toastService: ToastService,
    private accountService: AccountService,
    public activeModal: NgbActiveModal,
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

  private initializeCreateForm() {
    this.form = this.fb.group({
      date: [this.mapDate(), [Validators.required, Validators.maxLength(199)]],
      amount: ['', [Validators.required, Validators.maxLength(199)]],
      comments: ['', [Validators.maxLength(199)]],
      account: ['', [Validators.required]],
      exchange_rate: ['1.00', [Validators.required, Validators.maxLength(199)]],
    });
  }

  ngOnInit() {
    this.form.get('amount')?.setValue(this.purchaseOrder.converted_amount_due);
  }

  mapAccount(el?: Account): any {
    return {
      value: el?.uuid,
      name: `${el?.name} (${el?.currency})`,
    };
  }

  public getConvertedAmount() {
    const exchangeRate = this.form.get('exchange_rate')?.value;
    const amount = this.form.get('amount')?.value;
    if (exchangeRate && amount) {
      return amount * exchangeRate;
    }
    return '0';
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

    this.store();
  }

  mapDate(date?: number): string {
    let dateString = moment(date).format('YYYY-MM-DD');
    return dateString;
  }

  private store() {
    const data = {
      date: moment(this.form.get('date')?.value).format('x'),
      amount: this.form.get('amount')?.value,
      comments: this.form.get('comments')?.value,
      category: 'Purchase Order Payment',
      account_uuid: this.form.get('account')?.value.value,
      exchange_rate: this.form.get('exchange_rate')?.value,
      supplier_uuid: this.purchaseOrder?.supplier_uuid,
      purchase_order_uuid: this.purchaseOrder?.uuid,
      currency: this.currency,
    };

    this.loading = true;
    this.paymentService.store(data).subscribe({
      next: (res: any) => {
        this.toastService.showSuccess(
          `Payment number #'${res.number}' been added successfully.`
        );
        this.activeModal.close('Done');
        if (this.router.url.split('/')[4] == 'payments') {
          window.location.reload();
        } else {
          this.router.navigate([
            this.routes.inventory.purchase_orders.payments,
            this.purchaseOrder.uuid,
          ]);
        }
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
