import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MasterLayoutComponent } from 'src/app/layouts/master-layout/master-layout.component';
import { IndexComponent } from './index/index.component';
import { OverduePurchaseOrdersComponent } from './overdue-purchase-orders/overdue-purchase-orders.component';
import { PurchaseOrdersDueTodayComponent } from './purchase-orders-due-today/purchase-orders-due-today.component';
import { SubscriptionsAboutToExpireComponent } from './subscriptions-about-to-expire/subscriptions-about-to-expire.component';
import { ExpiredSubscriptionsComponent } from './expired-subscriptions/expired-subscriptions.component';

const routes: Routes = [
  {
    path: '',
    component: MasterLayoutComponent,
    children: [
      {
        path: '',
        component: IndexComponent,
      },
      {
        path: 'index',
        component: IndexComponent,
      },
      {
        path: 'purchase-orders-due-today',
        component: PurchaseOrdersDueTodayComponent,
      },
      {
        path: 'overdue-purchase-orders',
        component: OverduePurchaseOrdersComponent,
      },
      {
        path: 'expired-subscriptions',
        component: ExpiredSubscriptionsComponent,
      },
      {
        path: 'subscriptions-about-to-expire',
        component: SubscriptionsAboutToExpireComponent,
      },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NotificationsRoutingModule {}
