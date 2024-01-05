import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StockIssuesRoutingModule } from './stock-issues-routing.module';
import { FormComponent } from './form/form.component';
import { ShowComponent } from './show/show.component';
import { IndexComponent } from './index/index.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [FormComponent, ShowComponent, IndexComponent],
  imports: [CommonModule, StockIssuesRoutingModule, SharedModule],
})
export class StockIssuesModule {}
