import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SuppliersRoutingModule } from './suppliers-routing.module';
import { IndexComponent } from './index/index.component';
import { FormComponent } from './form/form.component';
import { ShowComponent } from './show/show.component';
import { SharedModule } from '../../shared/shared.module';
import { StatementComponent } from './statement/statement.component';
import { SupplierShowMenuComponent } from './supplier-show-menu/supplier-show-menu.component';
import { PaymentsComponent } from './payments/payments.component';
import { RefundsComponent } from './refunds/refunds.component';
import { PurchaseOrdersComponent } from './purchase-orders/purchase-orders.component';
import { DetailsComponent } from './details/details.component';
import { AddSupplierModalComponent } from './add-supplier-modal/add-supplier-modal.component';
import { SupplierContactPersonsComponent } from './supplier-contact-persons/supplier-contact-persons.component';

@NgModule({
  declarations: [
    IndexComponent,
    FormComponent,
    ShowComponent,
    StatementComponent,
    SupplierShowMenuComponent,
    PaymentsComponent,
    RefundsComponent,
    PurchaseOrdersComponent,
    DetailsComponent,
    AddSupplierModalComponent,
    SupplierContactPersonsComponent,
  ],
  imports: [CommonModule, SharedModule, SuppliersRoutingModule],
})
export class SuppliersModule {}
