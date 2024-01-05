import { User } from "./user";

export class Account {
  user_uuid!: string;
  name!: string;
  description!: string;
  exchange_rate!: number;
  currency!: string;
  uuid!: string;
  date_created!: number;
  date_updated!: number;

  user?: User;

  constructor(data: any) {
    this.date_created = data.date_created;
    this.date_updated = data.date_updated;
    this.user_uuid = data.user_uuid;
    this.name = data.name;
    this.description = data.description;
    this.exchange_rate = data.exchange_rate;
    this.currency = data.currency;
    this.uuid = data.uuid;

    if (data.user) {
      this.user = new User(data.user);
    }
  }
}
