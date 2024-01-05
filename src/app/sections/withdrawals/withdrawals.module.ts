import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WithdrawalsRoutingModule } from './withdrawals-routing.module';
import { IndexComponent } from './index/index.component';
import { ShowComponent } from './show/show.component';
import { FormComponent } from './form/form.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [IndexComponent, ShowComponent, FormComponent],
  imports: [CommonModule, WithdrawalsRoutingModule, SharedModule],
})
export class WithdrawalsModule {}
