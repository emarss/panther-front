import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { appRoutes } from 'src/app/core/routes-list';
import { Location } from '@angular/common';
import { User } from 'src/app/core/models/user';

@Component({
  selector: 'app-user-show-menu',
  templateUrl: './user-show-menu.component.html',
  styleUrls: ['./user-show-menu.component.scss'],
})
export class UserShowMenuComponent {
  @Input()
  user!: User;

  public routes = appRoutes;
  constructor(private router: Router, private _location: Location) {}

  pageIsShow() {
    return this.router.url.split('/')[4] == 'details';
  }

  pageIsInventoryStatement() {
    return this.router.url.split('/')[4] == 'inventory-statement';
  }

  pageIsLogs() {
    return this.router.url.split('/')[4] == 'logs';
  }

  backClicked() {
    this._location.back();
  }
}
