import { User } from "./user";

export class Notification {
  user_uuid!: string;
  notification!: string;
  type!: string;
  seen!: boolean;
  read!: boolean;
  uuid!: string;
  date_created!: number;
  date_updated!: number;

  user?: User;

  constructor(data: any) {
    this.date_created = data.date_created;
    this.date_updated = data.date_updated;
    this.user_uuid = data.user_uuid;
    this.notification = data.notification;
    this.type = data.type;
    this.seen = data.seen;
    this.read = data.read;
    this.uuid = data.uuid;

    if (data.user) {
      this.user = new User(data.user);
    }
  }
}
