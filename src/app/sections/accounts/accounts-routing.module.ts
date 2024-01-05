import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MasterLayoutComponent } from '../../layouts/master-layout/master-layout.component';
import { DepositsComponent } from './deposits/deposits.component';
import { DetailsComponent } from './details/details.component';
import { FormComponent } from './form/form.component';
import { IndexComponent } from './index/index.component';
import { PaymentsComponent } from './payments/payments.component';
import { ReceiptsComponent } from './receipts/receipts.component';
import { ShowComponent } from './show/show.component';
import { StatementComponent } from './statement/statement.component';
import { WithdrawalsComponent } from './withdrawals/withdrawals.component';

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
            path: 'receipts/:uuid',
            component: ReceiptsComponent,
          },
          {
            path: 'payments/:uuid',
            component: PaymentsComponent,
          },
          {
            path: 'deposits/:uuid',
            component: DepositsComponent,
          },
          {
            path: 'withdrawals/:uuid',
            component: WithdrawalsComponent,
          },
          {
            path: 'statement/:uuid',
            component: StatementComponent,
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
export class AccountsRoutingModule {}
