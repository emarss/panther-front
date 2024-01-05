import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from '../../core/services/auth-guard.service';
import { MasterLayoutComponent } from '../../layouts/master-layout/master-layout.component';
import { DetailsComponent } from './details/details.component';
import { FormComponent } from './form/form.component';
import { IndexComponent } from './index/index.component';
import { InventoryStatementComponent } from './inventory-statement/inventory-statement.component';
import { LogsComponent } from './logs/logs.component';
import { ProfileEditComponent } from './profile-edit/profile-edit.component';
import { ProfilePasswordComponent } from './profile-password/profile-password.component';
import { ProfileComponent } from './profile/profile.component';
import { ShowComponent } from './show/show.component';
import { UserPermissionsComponent } from './user-permissions/user-permissions.component';
import { ChangeUserPasswordComponent } from './change-user-password/change-user-password.component';

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
        path: 'profile',
        component: ProfileComponent,
      },
      {
        path: 'profile/edit',
        component: ProfileEditComponent,
      },
      {
        path: 'profile/password',
        component: ProfilePasswordComponent,
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
            path: 'inventory-statement/:uuid',
            component: InventoryStatementComponent,
          },
          {
            path: 'logs/:uuid',
            component: LogsComponent,
          },
        ],
      },
      {
        path: 'edit/:uuid',
        component: FormComponent,
      },
      {
        path: 'permissions/:uuid',
        component: UserPermissionsComponent,
      },
      {
        path: 'change-password/:uuid',
        component: ChangeUserPasswordComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersRoutingModule {}
