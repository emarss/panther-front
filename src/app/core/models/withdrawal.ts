import { Item } from "./item";

import { Account } from "./account";
import { User } from "./user";

export class Withdrawal {
  user_uuid!: string;
  account_uuid!: string;
  currency: string;
  amount!: number;
  date!: number;
  exchange_rate!: number;
  narration!: number;

  uuid!: string;
  date_created!: number;
  date_updated!: number;

  user?: User;
  account?: Account;


  constructor(data: any) {
    this.date_created = data.date_created;
    this.date_updated = data.date_updated;
    this.user_uuid = data.user_uuid;
    this.account_uuid = data.account_uuid;
    this.amount = data.amount;
    this.narration = data.narration;
    this.date = data.date;
    this.exchange_rate = data.exchange_rate;
    this.currency = data.currency;
    this.uuid = data.uuid;

    if (data.account) {
      this.account = new Account(data.account);
    }
    if (data.user) {
      this.user = new User(data.user);
    }
  }
}
