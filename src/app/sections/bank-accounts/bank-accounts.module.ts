import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BankAccountsRoutingModule } from './bank-accounts-routing.module';
import { IndexComponent } from './index/index.component';
import { ShowComponent } from './show/show.component';
import { FormComponent } from './form/form.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [IndexComponent, ShowComponent, FormComponent],
  imports: [CommonModule, SharedModule, BankAccountsRoutingModule],
})
export class BankAccountsModule {}
