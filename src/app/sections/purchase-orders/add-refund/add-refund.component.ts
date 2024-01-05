import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'src/app/core/services/alert.service';
import { Router } from '@angular/router';
import { appRoutes } from '../../../core/routes-list';
import { SettingService } from 'src/app/core/services/setting.service';
import { CustomSelectOption } from 'src/app/core/interfaces/custom-select-option';

import { Account } from 'src/app/core/models/account';
import { AccountService } from 'src/app/core/services/account.service';
import * as moment from 'moment';
import { Receipt } from 'src/app/core/models/receipt';
import { BehaviorSubject } from 'rxjs';
import { PurchaseOrder } from 'src/app/core/models/purchase-order';
import { ReceiptService } from 'src/app/core/services/receipt.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from 'src/app/core/services/toast-service.service';
import { AddAccountModalComponent } from '../../accounts/add-account-modal/add-account-modal.component';

@Component({
  selector: 'app-add-refund',
  templateUrl: './add-refund.component.html',
  styleUrls: ['./add-refund.component.scss'],
})
export class AddRefundComponent {
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
    private receiptService: ReceiptService,
    private alertService: AlertService,
    private toastService: ToastService,
    private modalService: NgbModal,
    private accountService: AccountService,
    private settingService: SettingService,
    public activeModal: NgbActiveModal
  ) {
    this.initializeCreateForm();
    this.current_currency = this.settingService.getCurrentCompanyCurrency();
    this.currency = this.settingService.getCurrentCompanyCurrency();

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

  public getConvertedAmount() {
    const exchangeRate = this.form.get('exchange_rate')?.value;
    const amount = this.form.get('amount')?.value;
    if (exchangeRate && amount) {
      return amount * exchangeRate;
    }
    return '0';
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

  mapAccount(el?: Account): any {
    return {
      value: el?.uuid,
      name: `${el?.name} (${el?.currency})`,
    };
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
      category: 'Purchase Order Refund',
      exchange_rate: this.form.get('exchange_rate')?.value,
      account_uuid: this.form.get('account')?.value.value,
      supplier_uuid: this.purchaseOrder.supplier_uuid,
      purchase_order_uuid: this.purchaseOrder.uuid,

      currency: this.currency,
    };

    this.loading = true;
    this.receiptService.store(data).subscribe({
      next: (res: Receipt) => {
        this.toastService.showSuccess(
          `Receipt number #'${res.number}' been added successfully.`
        );
        this.activeModal.close('Done');
        if (this.router.url.split('/')[4] == 'refunds') {
          window.location.reload();
        } else {
          this.router.navigate([
            this.routes.inventory.purchase_orders.refunds,
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
