import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountsRoutingModule } from './accounts-routing.module';
import { ShowComponent } from './show/show.component';
import { IndexComponent } from './index/index.component';
import { FormComponent } from './form/form.component';
import { SharedModule } from '../../shared/shared.module';
import { AccountShowMenuComponent } from './account-show-menu/account-show-menu.component';
import { DetailsComponent } from './details/details.component';
import { StatementComponent } from './statement/statement.component';
import { ReceiptsComponent } from './receipts/receipts.component';
import { PaymentsComponent } from './payments/payments.component';
import { DepositsComponent } from './deposits/deposits.component';
import { WithdrawalsComponent } from './withdrawals/withdrawals.component';
import { AddAccountModalComponent } from './add-account-modal/add-account-modal.component';

@NgModule({
  declarations: [
    ShowComponent,
    IndexComponent,
    FormComponent,
    AccountShowMenuComponent,
    DetailsComponent,
    StatementComponent,
    ReceiptsComponent,
    PaymentsComponent,
    DepositsComponent,
    WithdrawalsComponent,
    AddAccountModalComponent,
  ],
  imports: [CommonModule, AccountsRoutingModule, SharedModule],
})
export class AccountsModule {}
