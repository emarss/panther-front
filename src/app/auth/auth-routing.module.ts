import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { GuestGuardService } from '../core/services/guest-guard.service';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ResetPasswordSentComponent } from './reset-password-sent/reset-password-sent.component';
import { ResetPasswordUpdatedComponent } from './reset-password-updated/reset-password-updated.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [GuestGuardService],
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
    canActivate: [GuestGuardService],
  },
  {
    path: 'reset-password/:token',
    component: ResetPasswordComponent,
    canActivate: [GuestGuardService],
  },
  {
    path: 'reset-password-sent/:email_address',
    component: ResetPasswordSentComponent,
    canActivate: [GuestGuardService],
  },
  {
    path: 'reset-password-updated',
    component: ResetPasswordUpdatedComponent,
    canActivate: [GuestGuardService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
