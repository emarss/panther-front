import { Item } from "./item";
import { User } from "./user";

export class BankAccount {
  user_uuid!: string;
  bank_name!: string;
  account_holder!: string;
  title!: string;
  bank_branch?: string;
  bank_account!: string;
  status!: string;
  priority!: number;
  uuid!: string;
  date_created!: number;
  date_updated!: number;

  user?: User;
  items?: Array<Item>;

  constructor(data: any) {
    this.date_created = data.date_created;
    this.date_updated = data.date_updated;
    this.user_uuid = data.user_uuid;
    this.title = data.title;
    this.account_holder = data.account_holder;
    this.bank_name = data.bank_name;
    this.bank_branch = data.bank_branch;
    this.bank_account = data.bank_account;
    this.status = data.status;
    this.priority = data.priority;
    this.uuid = data.uuid;

    if (data.user) {
      this.user = new User(data.user);
    }
  }
}
