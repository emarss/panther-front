import { Component } from '@angular/core';
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
import { Payment } from 'src/app/core/models/payment';
import { PaymentService } from 'src/app/core/services/payment.service';
import { BehaviorSubject } from 'rxjs';
import { PurchaseOrder } from 'src/app/core/models/purchase-order';
import { Supplier } from 'src/app/core/models/supplier';
import { SupplierService } from 'src/app/core/services/supplier.service';
import { PurchaseOrderService } from 'src/app/core/services/purchase-order.service';
import { AddSupplierModalComponent } from 'src/app/sections/suppliers/add-supplier-modal/add-supplier-modal.component';
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
  public paymentToEdit?: Payment;
  uuid?: string;

  public routes = appRoutes;

  private loadingReqestSubject = new BehaviorSubject<number>(0);
  private completedRequests = 0;

  public showValidationErrors = false;
  public loading = true;
  accountsOptionsList: Array<CustomSelectOption> = [];
  accountsList: Array<Account> = [];
  purchaseOrdersList: Array<CustomSelectOption> = [];
  suppliersList: Array<CustomSelectOption> = [];
  purchaseOrdersModelList: Array<PurchaseOrder> = [];
  suppliersModelList: Array<Supplier> = [];
  paymentCategoriesList: Array<string> = [];
  currency!: string;
  current_currency!: string;

  constructor(
    private route: ActivatedRoute,
    public fb: FormBuilder,
    private router: Router,
    private paymentService: PaymentService,
    private _location: Location,
    private alertService: AlertService,
    private toastService: ToastService,
    private accountService: AccountService,
    private purchaseOrderService: PurchaseOrderService,
    private supplierService: SupplierService,
    private modalService: NgbModal,
    private settingService: SettingService
  ) {
    this.initializeCreateForm();
    this.current_currency = this.settingService.getCurrentSchoolCurrency();
    this.currency = this.settingService.getCurrentSchoolCurrency();

    this.settingService.getPaymentCategories().subscribe({
      next: (value: Array<string>) => {
        this.paymentCategoriesList = value;
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

    this.supplierService.all().subscribe({
      next: (value) => {
        this.suppliersModelList = value;
        this.suppliersList = value.map((el: Supplier) => this.mapSupplier(el));
        this.route.params.subscribe({
          next: (params) => {
            if (params['supplier_uuid']) {
              this.form
                .get('supplier')
                ?.setValue(
                  this.suppliersList.find(
                    (el) => el.value === params['supplier_uuid']
                  )
                );
              this.form.get('category')?.setValue('Supplier Prepayment');
            }
          },
        });
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
          this.fetchPayment();
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
        if ((!this.uuid && val === 4) || (this.uuid && val === 5)) {
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
      category: ['', [Validators.required]],
      supplier: ['', []],
      purchase_order: ['', []],
    });
  }

  private initializeEditForm() {
    this.form = this.fb.group({
      date: [
        this.mapDate(this.paymentToEdit?.date),
        [Validators.required, Validators.maxLength(199)],
      ],
      amount: [
        this.paymentToEdit?.amount,
        [Validators.required, Validators.maxLength(199)],
      ],
      comments: [this.paymentToEdit?.comments, [Validators.maxLength(199)]],
      account: [
        this.mapAccount(this.paymentToEdit?.account),
        [Validators.required],
      ],
      exchange_rate: [
        this.paymentToEdit?.exchange_rate,
        [Validators.required, Validators.maxLength(199)],
      ],
      category: [this.paymentToEdit?.category, [Validators.required]],
      supplier: [this.mapSupplier(this.paymentToEdit?.supplier), []],
      purchase_order: [
        this.mapPurchaseOrder(this.paymentToEdit?.purchase_order),
        [],
      ],
    });
    this.currency = this.paymentToEdit?.currency!;
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
        ? `Purchase Order #${el?.number} - ${this.paymentToEdit?.supplier?.name}`
        : `Purchase Order #${el?.number} - ${el?.supplier?.name}`,
    };
  }

  mapSupplier(el?: Supplier): any {
    return {
      value: el?.uuid,
      name: el?.name,
    };
  }

  fetchPayment() {
    this.paymentService.show(this.uuid!).subscribe({
      next: (res: any) => {
        this.paymentToEdit = res;
        this.initializeEditForm();
        this.updateNumberOfCompletedRequests();
      },
      error: (err: any) => {
        this.loading = false;
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

  onCategoryChange() {
    if (this.isExpense()) {
      this.form.get('comments')?.addValidators([Validators.required]);
      this.form.get('comments')?.updateValueAndValidity();
    } else {
      this.form.get('comments')?.removeValidators([Validators.required]);
      this.form.get('comments')?.updateValueAndValidity();
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

    if (this.isEditForm()) {
      this.update();
    } else {
      this.store();
    }
  }

  public isEditForm() {
    return this.paymentToEdit !== undefined;
  }

  getPageTitle(): string {
    return this.isEditForm()
      ? `Edit #${this.paymentToEdit?.number}`
      : 'Create Payment';
  }

  mapDate(date?: number): string {
    let dateString = moment(date).format('YYYY-MM-DD');
    return dateString;
  }

  isSupplierPrepayment() {
    return this.form.get('category')?.value === 'Supplier Prepayment';
  }

  isServicePayment() {
    return this.form.get('category')?.value === 'Service Payment';
  }

  isPurchaseOrderPayment() {
    return this.form.get('category')?.value === 'Purchase Order Payment';
  }

  isExpense() {
    return this.form.get('category')?.value === 'Expense';
  }

  getSelectedSupplierUuid() {
    if (this.isSupplierPrepayment() || this.isServicePayment()) {
      return this.form.get('supplier')?.value.value;
    } else if (this.isPurchaseOrderPayment()) {
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
      account_uuid: this.form.get('account')?.value.value,
      exchange_rate: this.form.get('exchange_rate')?.value,
      supplier_uuid: this.getSelectedSupplierUuid(),
      purchase_order_uuid: this.getPurchaseOrderUuid(),
      currency: this.currency,
    };

    this.loading = true;
    this.paymentService.store(data).subscribe({
      next: (res: any) => {
        this.toastService.showSuccess(
          `Payment number #'${res.number}' been added successfully.`
        );
        this.router.navigateByUrl(this.routes.financials.payments.index);
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
      account_uuid: this.form.get('account')?.value.value,
      exchange_rate: this.form.get('exchange_rate')?.value,
      supplier_uuid: this.getSelectedSupplierUuid(),
      purchase_order_uuid: this.getPurchaseOrderUuid(),
      currency: this.currency,
    };

    this.loading = true;
    this.paymentService.update(data, this.uuid!).subscribe({
      next: (res: any) => {
        this.toastService.showSuccess(
          `Payment number #'${this.paymentToEdit?.number}' has been updated successfully.`
        );
        this.router.navigateByUrl(this.routes.financials.payments.index);
      },
      error: (err: any) => {
        this.loading = false;
        this.alertService.showNotificationForHttpError(err);
      },
    });
  }


  private getPurchaseOrderUuid() {
    return this.isPurchaseOrderPayment()
      ? this.form.get('purchase_order')?.value.value
      : null;
  }

  createNewSupplier() {
    const modalRef = this.modalService.open(AddSupplierModalComponent, {
      centered: true,
      size: 'xl',
    });
    modalRef.result.then(() => {
      let createdSupplierString = localStorage.getItem('created-supplier');

      if (createdSupplierString) {
        localStorage.removeItem('created-supplier');
        let createdSupplier = new Supplier(JSON.parse(createdSupplierString)!);
        this.suppliersList.push(this.mapSupplier(createdSupplier));
        this.form.get('supplier')?.setValue(this.mapSupplier(createdSupplier));
      }
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
