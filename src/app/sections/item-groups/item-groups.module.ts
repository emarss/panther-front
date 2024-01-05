import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItemGroupsRoutingModule } from './item-groups-routing.module';
import { FormComponent } from './form/form.component';
import { IndexComponent } from './index/index.component';
import { ShowComponent } from './show/show.component';
import { SharedModule } from '../../shared/shared.module';
import { ItemGroupShowMenuComponent } from './item-group-show-menu/item-group-show-menu.component';
import { DetailsComponent } from './details/details.component';
import { ItemsComponent } from './items/items.component';
import { AddItemGroupModalComponent } from './add-item-group-modal/add-item-group-modal.component';

@NgModule({
  declarations: [
    FormComponent,
    IndexComponent,
    ShowComponent,
    ItemGroupShowMenuComponent,
    DetailsComponent,
    ItemsComponent,
    AddItemGroupModalComponent,
  ],
  imports: [CommonModule, ItemGroupsRoutingModule, SharedModule],
})
export class ItemGroupsModule {}
