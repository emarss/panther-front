import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItemsRoutingModule } from './items-routing.module';
import { IndexComponent } from './index/index.component';
import { FormComponent } from './form/form.component';
import { ShowComponent } from './show/show.component';
import { SharedModule } from '../../shared/shared.module';
import { ItemShowMenuComponent } from './item-show-menu/item-show-menu.component';
import { ItemPurchaseOrderItemsComponent } from './item-purchase-order-items/item-purchase-order-items.component';
import { ItemStockIssuesComponent } from './item-stock-issues/item-stock-issues.component';
import { ItemStockReturnsComponent } from './item-stock-returns/item-stock-returns.component';
import { AddItemModalComponent } from './add-item-modal/add-item-modal.component';
import { DetailsComponent } from './details/details.component';
import { ItemStatementComponent } from './item-statement/item-statement.component';

@NgModule({
  declarations: [
    IndexComponent,
    FormComponent,
    ShowComponent,
    ItemShowMenuComponent,
    ItemPurchaseOrderItemsComponent,
    ItemStockIssuesComponent,
    ItemStockReturnsComponent,
    AddItemModalComponent,
    DetailsComponent,
    ItemStatementComponent,
  ],
  imports: [CommonModule, ItemsRoutingModule, SharedModule],
})
export class ItemsModule {}
