import { Preference } from './preference';
import { UserPermission } from './user-permission';

export class User {
  user_uuid!: string;
  name!: string;
  email!: string;
  role!: string;
  status!: string;
  whatsapp_number?: string;
  uuid!: string;
  date_created!: number;
  date_updated!: number;

  user?: User;
  preference?: Preference;
  permissions?: UserPermission;

  constructor(data: any) {
    this.date_created = data.date_created;
    this.date_updated = data.date_updated;
    this.user_uuid = data.user_uuid;
    this.name = data.name;
    this.email = data.email;
    this.role = data.role;
    this.status = data.status;
    this.whatsapp_number = data.whatsapp_number;
    this.uuid = data.uuid;

    if (data.user) {
      this.user = new User(data.user);
    }

    if (data.permissions) {
      this.permissions = new UserPermission(data.permissions);
    }

    if (data.preference) {
      this.preference = new Preference(data.preference);
    }
  }

  isAdmin(): boolean {
    return this.role === 'Admin';
  }

  isSuperAdmin(): boolean {
    return this.role === 'Super Admin';
  }

  isGeneral(): boolean {
    return this.role === 'General';
  }

  isSalesperson(): boolean {
    return this.role === 'Salesperson';
  }
}
