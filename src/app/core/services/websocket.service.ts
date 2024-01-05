
import { Injectable } from "@angular/core";
import Pusher from 'pusher-js';
import { Subject } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  // public whatsappChatsListSubject = new Subject();
  // public whatsappMessageStatusUpdatedSubject = new Subject();
  // public whatsappChatOpenedSubject = new Subject<WhatsappContact>();
  // public facebookChatsListSubject = new Subject();
  // public facebookMessageDeliveredSubject = new Subject();
  // public facebookMessageReadSubject = new Subject();
  // public facebookChatOpenedSubject = new Subject();


  pusher: any = "";

  constructor() {
    Pusher.logToConsole = true;
  }

  connectAndListenToPrivateChannels() {
    if (this.pusher == "") {
      this.pusher = new Pusher(environment.pusher_secret, {
        cluster: environment.pusher_cluster,
        channelAuthorization:
        {
          endpoint: environment.baseURL + "broadcasting/auth",
          transport: "ajax",
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('access_token')
          }
        }
      });

      // let whatsappChatsListChannel = this.pusher.subscribe('private-whatsapp-chats');
      // whatsappChatsListChannel.bind('whatsapp-chats', (data: any) => this.updateWhatsappChatsList(data));

      // let whatsappChatOpenedChannel = this.pusher.subscribe('private-whatsapp-chat-opened')
      // whatsappChatOpenedChannel.bind('whatsapp-chat-opened', (data: any) => this.updateWhatsappChatOpenedList(data));

      // let whatsappStatusUpdatedChannel = this.pusher.subscribe('private-whatsapp-message-status-updated')
      // whatsappStatusUpdatedChannel.bind('whatsapp-message-status-updated', (data: any) => this.updateWhatsappStatusUpdated(data));

      // let facebookChatsListChannel = this.pusher.subscribe('private-facebook-chats');
      // facebookChatsListChannel.bind('facebook-chats', (data: any) => this.updateFacebookChatsList(data));

      // let facebookChatOpenedChannel = this.pusher.subscribe('private-facebook-chat-opened')
      // facebookChatOpenedChannel.bind('facebook-chat-opened', (data: any) => this.updateFacebookChatOpenedList(data));

      // let facebookMessageDeliveredChannel = this.pusher.subscribe('private-facebook-message-delivered')
      // facebookMessageDeliveredChannel.bind('facebook-message-delivered', (data: any) => this.updateFacebookMessageDelivered(data));

      // let facebookMessageReadChannel = this.pusher.subscribe('private-facebook-message-read')
      // facebookMessageReadChannel.bind('facebook-message-read', (data: any) => this.updateFacebookMessageRead(data));
    }

  }


  // updateFacebookMessageDelivered(data: any) {
  //   this.facebookMessageDeliveredSubject.next(data['mid'])
  // }

  // updateFacebookMessageRead(data: any) {
  //   this.facebookMessageReadSubject.next(data['facebook_user_id'])
  // }

  // updateWhatsappChatsList(data: any): any {
  //   this.whatsappChatsListSubject.next(data['chat'])
  // }


  // updateWhatsappChatOpenedList(data: any): any {
  //   this.whatsappChatOpenedSubject.next(data['whatsapp_number'])
  // }

  // updateFacebookChatsList(data: any): any {
  //   this.facebookChatsListSubject.next(data['chat'])
  // }


  // updateFacebookChatOpenedList(data: any): any {
  //   this.facebookChatOpenedSubject.next(data['facebook_user_id'])
  // }

  // updateWhatsappStatusUpdated(data: any): any {
  //   this.whatsappMessageStatusUpdatedSubject.next(data['message_sent'])
  // }
}
