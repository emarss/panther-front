import { User } from "./user";

export class Preference {
  user_uuid!: string;
  receive_whatsapp_notifications!: boolean;
  morning_notifications_time!: string;
  evening_notifications_time!: string;
  uuid!: string;
  date_created!: number;
  date_updated!: number;
  school_uuid!: string;

  user!: User;

  constructor(data: any) {
    this.user_uuid = data.user_uuid;
    this.receive_whatsapp_notifications = data.receive_whatsapp_notifications;
    this.morning_notifications_time = data.morning_notifications_time;
    this.evening_notifications_time = data.evening_notifications_time;
    this.uuid = data.uuid;
    this.date_created = data.date_created;
    this.date_updated = data.date_updated;
    this.school_uuid = data.school_uuid;

    if (data.user) {
      this.user = new User(data.user);
    }
  }
}
