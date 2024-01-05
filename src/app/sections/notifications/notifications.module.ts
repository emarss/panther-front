import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotificationsRoutingModule } from './notifications-routing.module';
import { IndexComponent } from './index/index.component';
import { PurchaseOrdersDueTodayComponent } from './purchase-orders-due-today/purchase-orders-due-today.component';
import { OverduePurchaseOrdersComponent } from './overdue-purchase-orders/overdue-purchase-orders.component';
import { ExpiredSubscriptionsComponent } from './expired-subscriptions/expired-subscriptions.component';
import { SubscriptionsAboutToExpireComponent } from './subscriptions-about-to-expire/subscriptions-about-to-expire.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { LoadingWidgetComponent } from './loading-widget/loading-widget.component';

@NgModule({
  declarations: [
    IndexComponent,
    PurchaseOrdersDueTodayComponent,
    OverduePurchaseOrdersComponent,
    ExpiredSubscriptionsComponent,
    SubscriptionsAboutToExpireComponent,
    LoadingWidgetComponent,
  ],
  imports: [CommonModule, NotificationsRoutingModule, SharedModule],
})
export class NotificationsModule {}
