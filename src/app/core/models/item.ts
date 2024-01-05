import { ItemGroup } from "./item-group";
import { Tax } from "./tax";
import { UnitOfMeasure } from "./unit-of-measure";
import { User } from "./user";

export class Item {
  user_uuid!: string;
  unit_selling_price!: number;
  unit_buying_price?: number;
  description!: string;
  item_group_uuid!: string;
  code?: string;
  type!: string;
  low_stock_number!: number;
  tax_uuid!: string;
  unit_of_measure_uuid?: string;
  uuid!: string;
  date_created!: number;
  date_updated!: number;

  user?: User;
  tax?: Tax;
  unit_of_measure?: UnitOfMeasure;
  item_groups?: Array<ItemGroup>;
  quantity?: number;

  isService(): boolean {
    return this.type.toLowerCase() === "service";
  }

  constructor(data: any) {
    this.date_created = data.date_created;
    this.date_updated = data.date_updated;
    this.user_uuid = data.user_uuid;
    this.unit_selling_price = data.unit_selling_price;
    this.unit_buying_price = data.unit_buying_price;
    this.description = data.description;
    this.item_group_uuid = data.item_group_uuid;
    this.code = data.code;
    this.quantity = data.quantity;
    this.low_stock_number = data.low_stock_number;
    this.tax_uuid = data.tax_uuid;
    this.type = data.type;
    this.uuid = data.uuid;
    this.unit_of_measure_uuid = data.unit_of_measure_uuid;

    if (data.item_groups) {
      this.item_groups = data.item_groups;
    }
    if (data.user) {
      this.user = new User(data.user);
    }
    if (data.tax) {
      this.tax = new Tax(data.tax);
    }
    if (data.unit_of_measure) {
      this.unit_of_measure = new UnitOfMeasure(data.unit_of_measure);
    }
  }
}
