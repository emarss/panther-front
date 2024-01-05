import { User } from "./user";

export class Tax {
  user_uuid!: string;
  name!: string;
  description!: string;
  rate!: number;
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
    this.rate = data.rate;
    this.uuid = data.uuid;

    if (data.user) {
      this.user = new User(data.user);
    }
  }
}
