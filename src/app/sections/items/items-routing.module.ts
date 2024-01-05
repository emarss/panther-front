import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MasterLayoutComponent } from '../../layouts/master-layout/master-layout.component';
import { DetailsComponent } from './details/details.component';
import { FormComponent } from './form/form.component';
import { IndexComponent } from './index/index.component';
import { ItemPurchaseOrderItemsComponent } from './item-purchase-order-items/item-purchase-order-items.component';
import { ItemStockIssuesComponent } from './item-stock-issues/item-stock-issues.component';
import { ItemStockReturnsComponent } from './item-stock-returns/item-stock-returns.component';
import { ShowComponent } from './show/show.component';
import { ItemStatementComponent } from './item-statement/item-statement.component';

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
            path: 'purchase-order-items/:uuid',
            component: ItemPurchaseOrderItemsComponent,
          },
          {
            path: 'stock-returns/:uuid',
            component: ItemStockReturnsComponent,
          },
          {
            path: 'stock-issues/:uuid',
            component: ItemStockIssuesComponent,
          },
          {
            path: 'statement/:uuid',
            component: ItemStatementComponent,
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
export class ItemsRoutingModule {}
