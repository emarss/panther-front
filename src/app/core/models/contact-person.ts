import { Supplier } from './supplier';
import { User } from './user';

export class ContactPerson {
  email?: string;
  phone_number?: string;
  contact_name!: string;
  type!: string;
  comments?: string;
  supplier_uuid?: string;
  uuid!: string;
  user_uuid!: string;
  date_created!: number;
  date_updated!: number;

  supplier?: Supplier;
  user?: User;

  getContactName() {
    return this.supplier?.name;
  }

  constructor(data: any) {
    this.date_created = data.date_created;
    this.date_updated = data.date_updated;
    this.type = data.type;
    this.comments = data.comments;
    this.supplier_uuid = data.supplier_uuid;
    this.email = data.email;
    this.phone_number = data.phone_number;
    this.contact_name = data.contact_name;
    this.uuid = data.uuid;
    this.user_uuid = data.user_uuid;

    if (data.supplier) {
      this.supplier = new Supplier(data.supplier);
    }

    if (data.user) {
      this.user = new User(data.user);
    }
  }
}
