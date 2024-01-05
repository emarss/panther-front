export class School {
  school_name?: string;
  email?: string;
  physical_address?: string;
  phone_number?: string;
  whatsapp_number!: string;
  category!: string;
  bp_number?: string;
  vat_number?: string;
  status!: string;
  logo_path?: string;
  logo_url?: string;
  settings_updated?: boolean;
  said_hi_to_rose?: boolean;
  has_subscribed?: boolean;
  verification_token?: string;
  verification_token_expiry_date?: number;
  uuid!: string;
  date_created!: number;
  date_updated!: number;

  constructor(data: any) {
    this.school_name = data.school_name;
    this.whatsapp_number = data.whatsapp_number;
    this.email = data.email;
    this.physical_address = data.physical_address;
    this.category = data.category;
    this.bp_number = data.bp_number;
    this.vat_number = data.vat_number;
    this.phone_number = data.phone_number;
    this.status = data.status;
    this.logo_path = data.logo_path;
    this.logo_url = data.logo_url;
    this.uuid = data.uuid;
    this.settings_updated = data.settings_updated;
    this.said_hi_to_rose = data.said_hi_to_rose;
    this.has_subscribed = data.has_subscribed;
    this.verification_token = data.verification_token;
    this.verification_token_expiry_date = data.verification_token_expiry_date;
    this.date_created = data.date_created;
    this.date_updated = data.date_updated;
  }

  isUnverified() {
    return this.status.toLocaleLowerCase() == 'unverified';
  }

  settingsUpdated() {
    return this.settings_updated;
  }
  saidHiToRose() {
    return this.said_hi_to_rose;
  }
  hasSubscribed() {
    return this.has_subscribed;
  }
}
