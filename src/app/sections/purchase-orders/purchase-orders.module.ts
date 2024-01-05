import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PurchaseOrdersRoutingModule } from './purchase-orders-routing.module';
import { ShowComponent } from './show/show.component';
import { FormComponent } from './form/form.component';
import { IndexComponent } from './index/index.component';
import { SharedModule } from '../../shared/shared.module';
import { DetailsComponent } from './details/details.component';
import { PaymentsComponent } from './payments/payments.component';
import { RefundsComponent } from './refunds/refunds.component';
import { PurchaseOrderShowMenuComponent } from './purchase-order-show-menu/purchase-order-show-menu.component';
import { AddRefundComponent } from './add-refund/add-refund.component';
import { AddPaymentComponent } from './add-payment/add-payment.component';

@NgModule({
  declarations: [
    ShowComponent,
    FormComponent,
    IndexComponent,
    DetailsComponent,
    PaymentsComponent,
    RefundsComponent,
    PurchaseOrderShowMenuComponent,
    AddRefundComponent,
    AddPaymentComponent,
  ],
  imports: [CommonModule, PurchaseOrdersRoutingModule, SharedModule],
})
export class PurchaseOrdersModule {}
