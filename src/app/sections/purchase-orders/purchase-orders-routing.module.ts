import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MasterLayoutComponent } from '../../layouts/master-layout/master-layout.component';
import { DetailsComponent } from './details/details.component';
import { FormComponent } from './form/form.component';
import { IndexComponent } from './index/index.component';
import { PaymentsComponent } from './payments/payments.component';
import { RefundsComponent } from './refunds/refunds.component';
import { ShowComponent } from './show/show.component';

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
        ],
      },
      {
        path: 'edit/:uuid',
        component: FormComponent,
      },
      {
        path: 'create/for-item/:item_uuid',
        component: FormComponent,
      },
      {
        path: 'create/for-supplier/:supplier_uuid',
        component: FormComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PurchaseOrdersRoutingModule {}
