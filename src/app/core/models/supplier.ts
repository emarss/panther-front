
import { User } from "./user";

export class Supplier {
  user_uuid!: string;
  name!: string;
  type!: string;
  details?: string;
  physical_address?: string;
  contact_name?: string;
  email?: string;
  website?: string;
  phone_number?: string;
  bp_number?: string;
  vat_number?: string;
  uuid!: string;
  date_created!: number;
  date_updated!: number;
  converted_current_balance!: number;


  user?: User;
  purchase_orders_count?: number;


  constructor(data: any) {
    this.date_created = data.date_created;
    this.date_updated = data.date_updated;
    this.user_uuid = data.user_uuid;
    this.name = data.name;
    this.type = data.type;
    this.details = data.details;
    this.physical_address = data.physical_address;
    this.contact_name = data.contact_name;
    this.email = data.email;
    this.website = data.website;
    this.phone_number = data.phone_number
    this.bp_number = data.bp_number;
    this.vat_number = data.vat_number;
    this.converted_current_balance = data.converted_current_balance;
    this.uuid = data.uuid;
    this.purchase_orders_count = data.purchase_orders_count;

    if (data.user) {
      this.user = new User(data.user);
    }
  }
}
