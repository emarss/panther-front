import { CustomSelectOption } from 'src/app/core/interfaces/custom-select-option';

import { Account } from "./account";
import { PurchaseOrder } from "./purchase-order";
import { Item } from "./item";
import { User } from "./user";
import { Tax } from './tax';

export interface PurchaseOrderItemInterface {
  item: CustomSelectOption;
  unitPrice: number;
  quantity: number;
  tax?: Tax;
}


export class PurchaseOrderItem {
  item_uuid!: string;
  date!: number;
  unit_selling_price!: number;
  tax_uuid?: string;
  tax: number;
  exchange_rate!: number;
  purchase_order_uuid!: string;
  currency!: string;
  account_uuid!: string;
  purchase_order_status!: string;
  quantity!: number;
  uuid!: string;
  date_created!: number;
  date_updated!: number;

  purchase_order?: PurchaseOrder;
  account?: Account;
  item?: Item;
  tax_model?: Tax;
  purchaseperson?: User;
  total_amount?: number;
  converted_total_amount?: number;

  constructor(data: any) {
    this.date_created = data.date_created;
    this.date_updated = data.date_updated;
    this.item_uuid = data.item_uuid;
    this.purchase_order_uuid = data.purchase_order_uuid;
    this.date = data.date;
    this.quantity = data.quantity;
    this.tax = data.tax;
    this.purchase_order_status = data.purchase_order_status;
    this.tax_uuid = data.tax_uuid;
    this.exchange_rate = data.exchange_rate;
    this.account_uuid = data.account_uuid;
    this.currency = data.currency;
    this.unit_selling_price = data.unit_selling_price;
    this.total_amount = data.total_amount;
    this.uuid = data.uuid;

    this.converted_total_amount = data.converted_total_amount;

    if (data.purchase_order) {
      this.purchase_order = new PurchaseOrder(data.purchase_order);
    }
    if (data.item) {
      this.item = new Item(data.item);
    }
    if (data.purchaseperson) {
      this.purchaseperson = new User(data.purchaseperson);
    }
    if (data.account) {
      this.account = new Account(data.account);
    }
    if (data.tax_model) {
      this.tax_model = new Tax(data.tax_model);
    }
  }
}
