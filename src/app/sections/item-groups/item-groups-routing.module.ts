import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MasterLayoutComponent } from '../../layouts/master-layout/master-layout.component';
import { DetailsComponent } from './details/details.component';
import { FormComponent } from './form/form.component';
import { IndexComponent } from './index/index.component';
import { ItemsComponent } from './items/items.component';
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
            path: 'items/:uuid',
            component: ItemsComponent,
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
export class ItemGroupsRoutingModule {}
