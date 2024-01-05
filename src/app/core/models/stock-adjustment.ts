import { Item } from "./item";

import { User } from "./user";

export class StockAdjustment {
  user_uuid!: string;
  item_uuid!: string;
  type!: string;
  quantity!: number;
  date!: number;
  comments?: string;

  uuid!: string;
  date_created!: number;
  date_updated!: number;

  user?: User;
  item?: Item;


  constructor(data: any) {
    this.date_created = data.date_created;
    this.date_updated = data.date_updated;
    this.user_uuid = data.user_uuid;
    this.item_uuid = data.item_uuid;
    this.type = data.type;
    this.comments = data.comments;
    this.date = data.date;
    this.quantity = data.quantity;
    this.uuid = data.uuid;

    if (data.item) {
      this.item = new Item(data.item);
    }
    if (data.user) {
      this.user = new User(data.user);
    }
  }
}
