import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { MasterLayoutComponent } from 'src/app/layouts/master-layout/master-layout.component';
import { FormComponent } from './form/form.component';
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
        path: 'show/:uuid',
        component: ShowComponent,
      },
      {
        path: 'edit/:uuid',
        component: FormComponent,
      },
      {
        path: 'create/for-supplier/:supplier_uuid',
        component: FormComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContactPersonsRoutingModule {}
