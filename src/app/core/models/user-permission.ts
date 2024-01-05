import { User } from "./user";

export class UserPermission {
  user_uuid!: string;
  items!: number;
  purchase_orders!: number;
  stock_issues!: number;
  stock_adjustments!: number;
  stock_returns!: number;
  payments!: number;
  receipts!: number;
  deposits!: number;
  withdrawals!: number;
  suppliers!: number;
  contact_persons!: number;
  users!: number;
  accounts!: number;
  settings!: number;
  item_groups!: number;
  user_logs!: number;
  documents!: number;
  exchange_rates!: number;
  bank_accounts!: number;
  unit_of_measures!: number;
  taxes!: number;

  user!: User;

  constructor(data: any) {
    this.user_uuid = data.user_uuid;
    this.items = data.items;
    this.purchase_orders = data.purchase_orders;
    this.stock_issues = data.stock_issues;
    this.stock_adjustments = data.stock_adjustments;
    this.stock_returns = data.stock_returns;
    this.payments = data.payments;
    this.receipts = data.receipts;
    this.deposits = data.deposits;
    this.withdrawals = data.withdrawals;
    this.suppliers = data.suppliers;
    this.contact_persons = data.contact_persons;
    this.users = data.users;
    this.accounts = data.accounts;
    this.settings = data.settings;
    this.item_groups = data.item_groups;
    this.user_logs = data.user_logs;
    this.documents = data.documents;
    this.unit_of_measures = data.unit_of_measures;
    this.exchange_rates = data.exchange_rates;
    this.bank_accounts = data.bank_accounts;
    this.taxes = data.taxes;

    if (data.user) {
      this.user = new User(data.user);
    }
  }
}
