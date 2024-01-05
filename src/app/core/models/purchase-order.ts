import { Supplier } from "./supplier";
import { User } from "./user";
import { PurchaseOrderItem } from "./purchase-order-item";
import { Account } from "./account";

export class PurchaseOrder {
  user_uuid!: string;
  due_date!: number;
  date!: number;
  exchange_rate!: number;
  gross_total_amount!: number;
  converted_gross_total_amount!: number;
  discount!: number;
  supplier_uuid!: string;
  currency!: string;
  number!: string;
  account_uuid!: string;
  reference?: string;
  purchase_order_status!: string;
  comments?: number;
  notes?: number;


  uuid!: string;
  date_created!: number;
  date_updated!: number;

  user?: User;
  supplier?: Supplier;

  account?: Account;
  converted_sub_total_amount?: number;
  converted_total_payments_amount?: number;
  converted_total_receipts_amount?: number;
  converted_discount?: number;
  converted_tax?: number;
  payment_status!: string;
  items!: Array<PurchaseOrderItem>;
  converted_amount_due!: number;

  constructor(data: any) {
    this.date_created = data.date_created;
    this.date_updated = data.date_updated;
    this.user_uuid = data.user_uuid;
    this.purchase_order_status = data.purchase_order_status;
    this.reference = data.reference;
    this.supplier_uuid = data.supplier_uuid;
    this.payment_status = data.payment_status;
    this.comments = data.comments;
    this.date = data.date;
    this.exchange_rate = data.exchange_rate;
    this.due_date = data.due_date;
    this.number = data.number;
    this.account_uuid = data.account_uuid;
    this.currency = data.currency;
    this.notes = data.notes;
    this.converted_sub_total_amount = data.converted_sub_total_amount;
    this.converted_total_payments_amount = data.converted_total_payments_amount;
    this.converted_total_receipts_amount = data.converted_total_receipts_amount;
    this.converted_discount = data.converted_discount;
    this.converted_tax = data.converted_tax;
    this.discount = data.discount;
    this.gross_total_amount = data.gross_total_amount;
    this.converted_gross_total_amount = data.converted_gross_total_amount;
    this.converted_amount_due = data.converted_amount_due;
    this.uuid = data.uuid;

    if (data.supplier) {
      this.supplier = new Supplier(data.supplier);
    }

    if (data.account) {
      this.account = new Account(data.account);
    }

    if (data.user) {
      this.user = new User(data.user);
    }

    if (data.items) {
      this.items = data.items.map((el: any) => { return new PurchaseOrderItem(el) })
    }
  }

  isPaid() {
    return this.payment_status.toLowerCase() == "paid";
  }
  isNotPaid() {
    return this.payment_status.toLowerCase() == "not paid";
  }
  isPartiallyPaid() {
    return this.payment_status.toLowerCase() == "partially paid";
  }
  isOverPaid() {
    return this.payment_status.toLowerCase() == "over paid";
  }

  isPending() {
    return this.purchase_order_status.toLowerCase() == "pending";
  }
  isCancelled() {
    return this.purchase_order_status.toLowerCase() == "cancelled";
  }
  isCompleted() {
    return this.purchase_order_status.toLowerCase() == "completed";
  }
}
