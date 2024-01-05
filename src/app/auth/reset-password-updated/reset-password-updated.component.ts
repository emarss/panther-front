import { Component } from '@angular/core';
import { appRoutes } from 'src/app/core/routes-list';

@Component({
  selector: 'app-reset-password-updated',
  templateUrl: './reset-password-updated.component.html',
  styleUrls: ['./reset-password-updated.component.scss']
})
export class ResetPasswordUpdatedComponent {
  public routes = appRoutes;
}
