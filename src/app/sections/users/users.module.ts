import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { IndexComponent } from './index/index.component';
import { SharedModule } from '../../shared/shared.module';
import { ShowComponent } from './show/show.component';
import { FormComponent } from './form/form.component';
import { ProfileComponent } from './profile/profile.component';
import { ProfileEditComponent } from './profile-edit/profile-edit.component';
import { ProfilePasswordComponent } from './profile-password/profile-password.component';
import { UserPermissionsComponent } from './user-permissions/user-permissions.component';
import { UserShowMenuComponent } from './user-show-menu/user-show-menu.component';
import { DetailsComponent } from './details/details.component';
import { InventoryStatementComponent } from './inventory-statement/inventory-statement.component';
import { LogsComponent } from './logs/logs.component';
import { ChangeUserPasswordComponent } from './change-user-password/change-user-password.component';

@NgModule({
  declarations: [
    IndexComponent,
    ShowComponent,
    FormComponent,
    ProfileComponent,
    ProfileEditComponent,
    ProfilePasswordComponent,
    UserPermissionsComponent,
    UserShowMenuComponent,
    DetailsComponent,
    InventoryStatementComponent,
    LogsComponent,
    ChangeUserPasswordComponent,
  ],
  imports: [CommonModule, UsersRoutingModule, SharedModule],
})
export class UsersModule {}
