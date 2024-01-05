import { Item } from "./item";
import { User } from "./user";

export class UnitOfMeasure {
  user_uuid!: string;
  physical_quantity!: string;
  unit!: string;
  symbol!: string;
  uuid!: string;
  date_created!: number;
  date_updated!: number;

  user?: User;
  items?: Array<Item>;

  constructor(data: any) {
    this.date_created = data.date_created;
    this.date_updated = data.date_updated;
    this.user_uuid = data.user_uuid;
    this.unit = data.unit;
    this.physical_quantity = data.physical_quantity;
    this.symbol = data.symbol;
    this.uuid = data.uuid;

    if (data.user) {
      this.user = new User(data.user);
    }
  }
}
