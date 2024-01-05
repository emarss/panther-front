import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'src/app/core/services/alert.service';
import { ActivatedRoute, Router } from '@angular/router';
import { appRoutes } from '../../../core/routes-list';
import { SettingService } from 'src/app/core/services/setting.service';
import { CustomSelectOption } from 'src/app/core/interfaces/custom-select-option';

import { Account } from 'src/app/core/models/account';
import { AccountService } from 'src/app/core/services/account.service';
import * as moment from 'moment';
import { Receipt } from 'src/app/core/models/receipt';
import { BehaviorSubject } from 'rxjs';
import { PurchaseOrder } from 'src/app/core/models/purchase-order';
import { PurchaseOrderService } from 'src/app/core/services/purchase-order.service';
import { ReceiptService } from 'src/app/core/services/receipt.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from 'src/app/core/services/toast-service.service';
import { AddAccountModalComponent } from '../../accounts/add-account-modal/add-account-modal.component';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent {
  public form!: FormGroup;
  public receiptToEdit?: Receipt;
  uuid?: string;

  public routes = appRoutes;

  private loadingReqestSubject = new BehaviorSubject<number>(0);
  private completedRequests = 0;

  public showValidationErrors = false;
  public loading = true;
  accountsOptionsList: Array<CustomSelectOption> = [];
  accountsList: Array<Account> = [];
  purchaseOrdersList: Array<CustomSelectOption> = [];
  purchaseOrdersModelList: Array<PurchaseOrder> = [];
  receiptCategoriesList: Array<string> = [];
  currency!: string;
  current_currency!: string;

  constructor(
    private route: ActivatedRoute,
    public fb: FormBuilder,
    private router: Router,
    private receiptService: ReceiptService,
    private _location: Location,
    private alertService: AlertService,
    private toastService: ToastService,
    private modalService: NgbModal,
    private accountService: AccountService,
    private purchaseOrderService: PurchaseOrderService,
    private settingService: SettingService
  ) {
    this.initializeCreateForm();
    this.current_currency = this.settingService.getCurrentCompanyCurrency();
    this.currency = this.settingService.getCurrentCompanyCurrency();

    this.settingService.getReceiptCategories().subscribe({
      next: (value: Array<string>) => {
        this.receiptCategoriesList = value;
      },
      error: (err: any) => {
        this.loading = false;
        this.alertService.showNotificationForHttpError(err);
      },
    });

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

    this.purchaseOrderService.all().subscribe({
      next: (value) => {
        this.purchaseOrdersModelList = value;
        this.purchaseOrdersList = value.map((el: PurchaseOrder) =>
          this.mapPurchaseOrder(el)
        );
        this.updateNumberOfCompletedRequests();
      },
      error: (err: any) => {
        this.loading = false;
        this.alertService.showNotificationForHttpError(err);
      },
    });

    this.route.params.subscribe({
      next: (params) => {
        this.uuid = params['uuid'];
        if (this.uuid) {
          this.fetchReceipt();
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
        if ((!this.uuid && val === 3) || (this.uuid && val === 4)) {
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
      category: ['', [Validators.required]],
      purchase_order: ['', []],
    });
  }

  private initializeEditForm() {
    this.form = this.fb.group({
      date: [
        this.mapDate(this.receiptToEdit?.date),
        [Validators.required, Validators.maxLength(199)],
      ],
      amount: [
        this.receiptToEdit?.amount,
        [Validators.required, Validators.maxLength(199)],
      ],
      comments: [this.receiptToEdit?.comments, [Validators.maxLength(199)]],
      account: [
        this.mapAccount(this.receiptToEdit?.account),
        [Validators.required],
      ],
      exchange_rate: [
        this.receiptToEdit?.exchange_rate,
        [Validators.required, Validators.maxLength(199)],
      ],
      category: [this.receiptToEdit?.category, [Validators.required]],
      purchase_order: [
        this.mapPurchaseOrder(this.receiptToEdit?.purchase_order),
        [],
      ],
    });
    this.currency = this.receiptToEdit?.currency!;
  }

  mapAccount(el?: Account): any {
    return {
      value: el?.uuid,
      name: `${el?.name} (${el?.currency})`,
    };
  }

  mapPurchaseOrder(el?: PurchaseOrder): any {
    return {
      value: el?.uuid,
      name: this.isEditForm()
        ? `Purchase Order #${el?.number} - ${this.receiptToEdit?.supplier?.name}`
        : `Purchase Order #${el?.number} - ${el?.supplier?.name}`,
    };
  }

  fetchReceipt() {
    this.receiptService.show(this.uuid!).subscribe({
      next: (res: any) => {
        this.receiptToEdit = res;
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
    return this.receiptToEdit !== undefined;
  }

  getPageTitle(): string {
    return this.isEditForm()
      ? `Edit #${this.receiptToEdit?.number}`
      : 'Create Receipt';
  }

  mapDate(date?: number): string {
    let dateString = moment(date).format('YYYY-MM-DD');
    return dateString;
  }

  isPurchaseOrderRefund() {
    return this.form.get('category')?.value === 'Purchase Order Refund';
  }

  getSelectedSupplierUuid() {
    if (this.isPurchaseOrderRefund()) {
      return this.purchaseOrdersModelList.find(
        (el) => el.uuid == this.form.get('purchase_order')?.value.value
      )?.supplier_uuid;
    } else {
      return null;
    }
  }

  private store() {
    const data = {
      date: moment(this.form.get('date')?.value).format('x'),
      amount: this.form.get('amount')?.value,
      comments: this.form.get('comments')?.value,
      category: this.form.get('category')?.value,
      exchange_rate: this.form.get('exchange_rate')?.value,
      account_uuid: this.form.get('account')?.value.value,
      supplier_uuid: this.getSelectedSupplierUuid(),
      purchase_order_uuid: this.getPurchaseOrderUuid(),
      currency: this.currency,
    };

    this.loading = true;
    this.receiptService.store(data).subscribe({
      next: (res: Receipt) => {
        this.toastService.showSuccess(
          `Receipt number #'${res.number}' been added successfully.`
        );
        this.router.navigateByUrl(this.routes.financials.receipts.index);
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
      comments: this.form.get('comments')?.value,
      category: this.form.get('category')?.value,
      exchange_rate: this.form.get('exchange_rate')?.value,
      account_uuid: this.form.get('account')?.value.value,
      supplier_uuid: this.getSelectedSupplierUuid(),
      purchase_order_uuid: this.getPurchaseOrderUuid(),
      currency: this.currency,
    };

    this.loading = true;
    this.receiptService.update(data, this.uuid!).subscribe({
      next: (res: any) => {
        this.toastService.showSuccess(
          `Receipt number #'${this.receiptToEdit?.number}' has been updated successfully.`
        );
        this.router.navigateByUrl(this.routes.financials.receipts.index);
      },
      error: (err: any) => {
        this.loading = false;
        this.alertService.showNotificationForHttpError(err);
      },
    });
  }

  private getPurchaseOrderUuid() {
    return this.isPurchaseOrderRefund()
      ? this.form.get('purchase_order')?.value.value
      : null;
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
