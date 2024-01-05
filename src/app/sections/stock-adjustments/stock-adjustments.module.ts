import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormComponent } from './form/form.component';
import { ShowComponent } from './show/show.component';
import { IndexComponent } from './index/index.component';
import { SharedModule } from '../../shared/shared.module';
import { StockAdjustmentsRoutingModule } from './stock-adjustments-routing.module';

@NgModule({
  declarations: [FormComponent, ShowComponent, IndexComponent],
  imports: [CommonModule, StockAdjustmentsRoutingModule, SharedModule],
})
export class StockAdjustmentsModule {}
