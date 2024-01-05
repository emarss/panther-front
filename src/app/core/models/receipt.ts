
import { Account } from "./account";
import { User } from "./user";
import { PurchaseOrder } from "./purchase-order";
import { Supplier } from "./supplier";

export class Receipt {
  user_uuid!: string;
  account_uuid!: string;
  purchase_order_uuid?: string;
  supplier_uuid?: string;
  currency!: string;
  number!: number;
  exchange_rate!: number;
  category!: string;
  amount!: number;
  date!: number;
  comments?: string;

  uuid!: string;
  date_created!: number;
  date_updated!: number;

  user?: User;
  account?: Account;
  purchase_order?: PurchaseOrder;
  supplier?: Supplier;

  converted_amount?: number;

  constructor(data: any) {
    this.date_created = data.date_created;
    this.date_updated = data.date_updated;
    this.user_uuid = data.user_uuid;
    this.account_uuid = data.account_uuid;
    this.supplier_uuid = data.supplier_uuid;
    this.purchase_order_uuid = data.purchase_order_uuid;
    this.number = data.number;
    this.exchange_rate = data.exchange_rate;
    this.amount = data.amount;
    this.comments = data.comments;
    this.date = data.date;
    this.currency = data.currency;
    this.category = data.category;
    this.uuid = data.uuid;

    if (data.account) {
      this.account = new Account(data.account);
    }
    if (data.purchase_order) {
      this.purchase_order = new PurchaseOrder(data.purchase_order);
    }
    if (data.supplier) {
      this.supplier = new Supplier(data.supplier);
    }
    if (data.user) {
      this.user = new User(data.user);
    }
  }
}
