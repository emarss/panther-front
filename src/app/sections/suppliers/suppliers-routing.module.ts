import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from '../../core/services/auth-guard.service';
import { MasterLayoutComponent } from '../../layouts/master-layout/master-layout.component';
import { DetailsComponent } from './details/details.component';
import { FormComponent } from './form/form.component';
import { IndexComponent } from './index/index.component';
import { PaymentsComponent } from './payments/payments.component';
import { PurchaseOrdersComponent } from './purchase-orders/purchase-orders.component';
import { RefundsComponent } from './refunds/refunds.component';
import { ShowComponent } from './show/show.component';
import { StatementComponent } from './statement/statement.component';
import { SupplierContactPersonsComponent } from './supplier-contact-persons/supplier-contact-persons.component';

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
        path: 'create',
        component: FormComponent,
      },
      {
        path: 'show',
        component: ShowComponent,
        children: [
          {
            path: 'details/:uuid',
            component: DetailsComponent,
          },
          {
            path: 'payments/:uuid',
            component: PaymentsComponent,
          },
          {
            path: 'refunds/:uuid',
            component: RefundsComponent,
          },
          {
            path: 'purchase-orders/:uuid',
            component: PurchaseOrdersComponent,
          },
          {
            path: 'statement/:uuid',
            component: StatementComponent,
          },
          {
            path: 'contact-persons/:uuid',
            component: SupplierContactPersonsComponent,
          },
        ],
      },
      {
        path: 'edit/:uuid',
        component: FormComponent,
      },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SuppliersRoutingModule {}
