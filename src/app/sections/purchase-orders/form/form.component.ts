import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PurchaseOrderService } from 'src/app/core/services/purchase-order.service';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PurchaseOrder } from 'src/app/core/models/purchase-order';
import { AlertService } from 'src/app/core/services/alert.service';
import { ActivatedRoute, Router } from '@angular/router';
import { appRoutes } from '../../../core/routes-list';
import { SettingService } from 'src/app/core/services/setting.service';
import { CustomSelectOption } from 'src/app/core/interfaces/custom-select-option';

import { Item } from 'src/app/core/models/item';
import { Supplier } from 'src/app/core/models/supplier';
import { ItemService } from 'src/app/core/services/item.service';
import { SupplierService } from 'src/app/core/services/supplier.service';
import * as moment from 'moment';
import { User } from 'src/app/core/models/user';
import {
  PurchaseOrderItem,
  PurchaseOrderItemInterface,
} from 'src/app/core/models/purchase-order-item';
import { UserService } from 'src/app/core/services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddItemModalComponent } from 'src/app/sections/items/add-item-modal/add-item-modal.component';
import { BehaviorSubject } from 'rxjs';

import { AccountService } from 'src/app/core/services/account.service';
import { Account } from 'src/app/core/models/account';
import { AuthService } from 'src/app/core/services/auth.service';
import { AddSupplierModalComponent } from 'src/app/sections/suppliers/add-supplier-modal/add-supplier-modal.component';
import { Setting } from 'src/app/core/models/setting';
import { ToastService } from 'src/app/core/services/toast-service.service';
import { AddAccountModalComponent } from '../../accounts/add-account-modal/add-account-modal.component';
import { Tax } from 'src/app/core/models/tax';
import { TaxService } from 'src/app/core/services/tax.service';
import { AddTaxModalComponent } from '../../taxes/add-tax-modal/add-tax-modal.component';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent {
  public form!: FormGroup;
  public purchaseOrderToEdit?: PurchaseOrder;
  public user!: User;

  uuid?: string;

  public routes = appRoutes;

  public sub: any;
  private purchaseOrderDays = 15;
  private loadingReqestSubject = new BehaviorSubject<number>(0);
  private completedRequests = 0;

  public showValidationErrors = false;
  public loading = true;
  suppliersList: Array<CustomSelectOption> = [];
  itemsOptionsList: Array<CustomSelectOption> = [];
  itemsList: Array<Item> = [];
  taxesList: Array<Tax> = [];
  purchaseOrderItemsList: Array<PurchaseOrderItemInterface> = [];
  selectedPurchaseOrderItems: Array<PurchaseOrderItemInterface> = [];
  currency!: string;
  current_currency!: string;
  accountsOptionsList: Array<CustomSelectOption> = [];
  accountsList: Array<Account> = [];
  purchaseOrderStatuses: Array<string> = [];

  includeVatOptions: Array<CustomSelectOption> = [
    {
      value: 0,
      name: 'No',
    },
    {
      value: 1,
      name: 'Yes',
    },
  ];

  constructor(
    private route: ActivatedRoute,
    public fb: FormBuilder,
    private router: Router,
    private purchaseOrderService: PurchaseOrderService,
    private _location: Location,
    private alertService: AlertService,
    private toastService: ToastService,
    private itemService: ItemService,
    private accountService: AccountService,
    private supplierService: SupplierService,
    private userService: UserService,
    private authService: AuthService,
    private taxService: TaxService,
    private modalService: NgbModal,
    private settingService: SettingService
  ) {
    this.purchaseOrderDays =
      this.settingService.getPurchaseOrderDueDateDaysFromLocal();

    this.current_currency = this.settingService.getCurrentCompanyCurrency();
    this.currency = this.settingService.getCurrentCompanyCurrency();

    this.initializeCreateForm();
    this.initializeSelectedPurchaseOrderItems();

    this.user = this.authService.getCurrentUserFromLocal();

    this.itemService.all().subscribe({
      next: (value) => {
        this.itemsList = value.map((el) => new Item(el));
        this.itemsOptionsList = value.map((el: Item) => {
          return {
            value: el.uuid,
            name: `${el.description} ${el.code ? '(' + el.code + ')' : ''} - ${
              el.unit_selling_price
            } ${this.current_currency}`,
          };
        });
        this.updateNumberOfCompletedRequests();
      },
      error: (err: any) => {
        this.loading = false;
        this.alertService.showNotificationForHttpError(err);
      },
    });

    this.settingService.getPurchaseOrderStatuses().subscribe({
      next: (value: Array<string>) => {
        this.purchaseOrderStatuses = value;
        this.form.get('purchase_order_status')?.setValue(value[0]);
        this.updateNumberOfCompletedRequests();
      },
      error: (err: any) => {
        this.loading = false;
        this.alertService.showNotificationForHttpError(err);
      },
    });

    this.taxService.all().subscribe({
      next: (value) => {
        this.taxesList = value.map((el) => new Tax(el));
        this.updateNumberOfCompletedRequests();
      },
      error: (err: any) => {
        this.loading = false;
        this.alertService.showNotificationForHttpError(err);
      },
    });

    this.settingService.show().subscribe({
      next: (value: Setting) => {
        this.form.get('notes')?.setValue(value.document_purchase_order_terms);
        this.updateNumberOfCompletedRequests();
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
        this.suppliersList = value.map((el: Supplier) => {
          return {
            value: el.uuid,
            name: el.name,
          };
        });
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

    this.sub = this.route.params.subscribe({
      next: (params) => {
        this.uuid = params['uuid'];
        if (this.uuid) {
          this.fetchPurchaseOrder();
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
        if ((!this.uuid && val === 7) || (this.uuid && val === 8)) {
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
      due_date: [
        this.mapDate(
          moment().add(this.purchaseOrderDays, 'days').unix() * 1000
        ),
        [Validators.required, Validators.maxLength(199)],
      ],
      discount: ['0', [Validators.required, Validators.maxLength(199)]],
      exchange_rate: ['1.00', [Validators.required, Validators.maxLength(199)]],
      account: ['', [Validators.required]],
      reference: ['', [Validators.maxLength(199)]],
      comments: ['', [Validators.maxLength(199)]],
      notes: ['', [Validators.maxLength(199)]],
      supplier: ['', [Validators.required]],
      purchase_order_status: ['', [Validators.required]],
    });
  }

  remapPurchaseOrderItemsAfterRateChange(): any {
    const exchangeRate = this.form.get('exchange_rate')?.value;
    if (exchangeRate) {
      this.selectedPurchaseOrderItems = this.selectedPurchaseOrderItems.map(
        (el: PurchaseOrderItemInterface) => {
          let item = this.itemsList.find((it) => it.uuid === el.item.value);
          return {
            item: el.item,
            unitPrice:
              Math.round((item?.unit_selling_price! / exchangeRate) * 100) /
              100,
            quantity: el.quantity,
            tax: el.tax,
          };
        }
      );
    }
  }

  mapPurchaseOrderItems(itemsList: Array<PurchaseOrderItem>): any {
    this.selectedPurchaseOrderItems = itemsList.map((el: PurchaseOrderItem) => {
      return {
        item: {
          value: el.item!.uuid,
          name: `${el.item?.description} ${
            el.item?.code ? '(' + el.item.code + ')' : ''
          } - ${el.unit_selling_price} ${this.current_currency}`,
        },
        unitPrice: el.unit_selling_price,
        quantity: el.quantity,
        tax: el.tax_model,
      };
    });
  }

  mapSupplier(el?: Supplier): any {
    return {
      value: el?.uuid,
      name: el?.name,
    };
  }

  mapAccount(el?: Account): any {
    return {
      value: el?.uuid,
      name: `${el?.name} (${el?.currency})`,
    };
  }

  mapIncludeVat(value: boolean | number) {
    return { value: value, name: value ? 'Yes' : 'No' };
  }

  mapUser(el?: User): any {
    return {
      value: el?.uuid,
      name: el?.name,
    };
  }

  private initializeEditForm() {
    this.form = this.fb.group({
      date: [
        this.mapDate(this.purchaseOrderToEdit?.date),
        [Validators.required, Validators.maxLength(199)],
      ],
      due_date: [
        this.mapDate(this.purchaseOrderToEdit?.due_date),
        [Validators.required, Validators.maxLength(199)],
      ],
      discount: [
        this.purchaseOrderToEdit?.discount,
        [Validators.required, Validators.maxLength(199)],
      ],
      exchange_rate: [
        this.purchaseOrderToEdit?.exchange_rate,
        [Validators.required, Validators.maxLength(199)],
      ],
      account: [
        this.mapAccount(this.purchaseOrderToEdit?.account),
        [Validators.required],
      ],
      reference: [
        this.purchaseOrderToEdit?.reference,
        [Validators.maxLength(199)],
      ],
      comments: [
        this.purchaseOrderToEdit?.comments,
        [Validators.maxLength(199)],
      ],
      notes: [this.purchaseOrderToEdit?.notes, [Validators.maxLength(199)]],
      supplier: [
        this.mapSupplier(this.purchaseOrderToEdit?.supplier),
        [Validators.required],
      ],
      purchase_order_status: [
        this.purchaseOrderToEdit?.purchase_order_status,
        [Validators.required],
      ],
    });
    this.currency = this.purchaseOrderToEdit?.currency!;
  }

  fetchPurchaseOrder() {
    this.purchaseOrderService.show(this.uuid!).subscribe({
      next: (res: any) => {
        this.purchaseOrderToEdit = res;
        this.initializeEditForm();
        this.mapPurchaseOrderItems(this.purchaseOrderToEdit!.items);
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

  createNewSupplier() {
    const modalRef = this.modalService.open(AddSupplierModalComponent, {
      centered: true,
      size: 'lg',
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

  exchangeRateChanged() {
    this.remapPurchaseOrderItemsAfterRateChange();
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
    return this.purchaseOrderToEdit !== undefined;
  }

  getPageTitle(): string {
    return this.isEditForm()
      ? `Edit Purchase Order #${this.purchaseOrderToEdit?.number}`
      : 'Create Purchase Order';
  }

  mapDate(date?: number): string {
    let dateString = moment(date).format('YYYY-MM-DD');
    return dateString;
  }

  private store() {
    const data = {
      date: moment(this.form.get('date')?.value).format('x'),
      due_date: moment(this.form.get('due_date')?.value).format('x'),
      discount: this.form.get('discount')?.value,
      reference: this.form.get('reference')?.value,
      exchange_rate: this.form.get('exchange_rate')?.value,
      account_uuid: this.form.get('account')?.value.value,
      unit_buying_price: this.form.get('unit_buying_price')?.value,
      comments: this.form.get('comments')?.value,
      notes: this.form.get('notes')?.value,
      number: this.form.get('number')?.value,
      supplier_uuid: this.form.get('supplier')?.value.value,
      currency: this.currency,
      purchase_order_status: this.form.get('purchase_order_status')?.value,
      items: this.selectedPurchaseOrderItems
        .filter((el) => el.item.value !== null)
        .map((el) => {
          return {
            item_uuid: el.item.value,
            unit_selling_price: el.unitPrice,
            quantity: el.quantity,
            tax: el.tax?.rate ?? 0,
            tax_uuid: el.tax?.uuid ?? '',
          };
        }),
    };

    this.loading = true;
    this.purchaseOrderService.store(data).subscribe({
      next: (res: PurchaseOrder) => {
        this.toastService.showSuccess(
          `Purchase Order number #'${res.number}' has been added successfully.`
        );
        this.router.navigateByUrl(this.routes.inventory.purchase_orders.index);
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
      due_date: moment(this.form.get('due_date')?.value).format('x'),
      discount: this.form.get('discount')?.value,
      reference: this.form.get('reference')?.value,
      exchange_rate: this.form.get('exchange_rate')?.value,
      account_uuid: this.form.get('account')?.value.value,
      unit_buying_price: this.form.get('unit_buying_price')?.value,
      comments: this.form.get('comments')?.value,
      notes: this.form.get('notes')?.value,
      number: this.form.get('number')?.value,
      supplier_uuid: this.form.get('supplier')?.value.value,
      currency: this.currency,
      purchase_order_status: this.form.get('purchase_order_status')?.value,
      items: this.selectedPurchaseOrderItems
        .filter((el) => el.item.value !== null)
        .map((el) => {
          return {
            item_uuid: el.item.value,
            unit_selling_price: el.unitPrice,
            quantity: el.quantity,
            tax: el.tax?.rate ?? 0,
            tax_uuid: el.tax?.uuid ?? '',
          };
        }),
    };

    this.loading = true;
    this.purchaseOrderService.update(data, this.uuid!).subscribe({
      next: (res: any) => {
        this.toastService.showSuccess(
          `Purchase Order number #'${this.purchaseOrderToEdit?.number}' has been updated successfully.`
        );
        this.router.navigateByUrl(this.routes.inventory.purchase_orders.index);
      },
      error: (err: any) => {
        this.loading = false;
        this.alertService.showNotificationForHttpError(err);
      },
    });
  }

  private initializeSelectedPurchaseOrderItems() {
    this.addNewPurchaseOrderItem();
  }

  public addNewPurchaseOrderItem() {
    this.selectedPurchaseOrderItems.push({
      item: { value: null, name: null },
      unitPrice: 0,
      quantity: 1,
    });
  }

  removePurchaseOrderItem(index: number) {
    if (this.selectedPurchaseOrderItems.length === 1) {
      this.selectedPurchaseOrderItems[0] = {
        item: { value: null, name: null },
        unitPrice: 0,
        quantity: 1,
      };
    } else {
      this.selectedPurchaseOrderItems.splice(index, 1);
    }
  }

  getNumberOfItems(): number {
    let sum = 0;
    this.selectedPurchaseOrderItems
      .filter((el) => el.item.value !== null)
      .forEach((el) => {
        sum = sum + el.quantity;
      });
    return sum;
  }

  getSubTotal(): number {
    let sum = 0;
    this.selectedPurchaseOrderItems.forEach((el) => {
      sum = sum + el.quantity * el.unitPrice;
    });
    return sum - this.getDiscount();
  }

  getDiscount(): number {
    let value = Number.parseFloat(this.form.get('discount')?.value);
    return isNaN(value) ? 0 : value;
  }

  getTotal(): number {
    return this.getSubTotal() + this.getTaxAmount();
  }

  public getConvertedAmount() {
    const exchangeRate = this.form.get('exchange_rate')?.value;
    const amount = this.getTotal();
    if (exchangeRate && amount) {
      return Math.round(amount * exchangeRate * 100) / 100;
    }
    return '0';
  }

  getTaxAmount(): number {
    let sum = 0;
    this.selectedPurchaseOrderItems
      .filter((el) => el.tax)
      .forEach((el) => {
        sum = sum + (el.quantity * el.unitPrice * el.tax!.rate) / 100;
      });
    return sum;
  }

  purchaseOrderItemChanged(index: number) {
    let itemUuid = this.selectedPurchaseOrderItems[index].item.value;
    let item = this.itemsList.find((el) => el.uuid === itemUuid);
    const exchangeRate = this.form.get('exchange_rate')?.value;
    if (exchangeRate) {
      this.selectedPurchaseOrderItems[index].unitPrice =
        Math.round((item!.unit_selling_price / exchangeRate) * 100) / 100;
    } else {
      this.selectedPurchaseOrderItems[index].unitPrice =
        item!.unit_selling_price;
    }
    this.selectedPurchaseOrderItems[index].tax = item!.tax;
  }

  indexTracker(index: number, value: any) {
    return index;
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

  createNewTax() {
    const modalRef = this.modalService.open(AddTaxModalComponent, {
      centered: true,
      size: 'lg',
    });
    modalRef.result.then(() => {
      let createdTaxString = localStorage.getItem('created-tax');

      if (createdTaxString) {
        localStorage.removeItem('created-tax');
        let createdTax = new Tax(JSON.parse(createdTaxString)!);
        this.taxesList.push(createdTax);
        this.form.get('tax')?.setValue(createdTax);
      }
    });
  }

  createNewItem() {
    const modalRef = this.modalService.open(AddItemModalComponent, {
      centered: true,
      size: 'xl',
    });
    modalRef.result.then(() => {
      let createdItemString = localStorage.getItem('created-item');

      if (createdItemString) {
        localStorage.removeItem('created-item');
        let createdItem = new Item(JSON.parse(createdItemString)!);
        this.itemsList.push(createdItem);
        const exchangeRate = this.form.get('exchange_rate')?.value;
        let itemPrice = createdItem.unit_selling_price;
        if (exchangeRate) {
          itemPrice = itemPrice / exchangeRate;
        }
        let newItem = {
          item: { value: createdItem.uuid, name: createdItem.description },
          unitPrice: itemPrice,
          quantity: 1,
          tax: createdItem!.tax,
        };
        if (
          this.selectedPurchaseOrderItems[
            this.selectedPurchaseOrderItems.length - 1
          ].item.value === null
        ) {
          this.selectedPurchaseOrderItems[
            this.selectedPurchaseOrderItems.length - 1
          ] = newItem;
        } else {
          this.selectedPurchaseOrderItems.push(newItem);
        }
      }
    });
  }
}
