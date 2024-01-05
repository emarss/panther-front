import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { appRoutes } from 'src/app/core/routes-list';
import { Location } from '@angular/common';
import { ItemGroup } from 'src/app/core/models/item-group';

@Component({
  selector: 'app-item-group-show-menu',
  templateUrl: './item-group-show-menu.component.html',
  styleUrls: ['./item-group-show-menu.component.scss'],
})
export class ItemGroupShowMenuComponent {
  @Input()
  itemGroup!: ItemGroup;

  public routes = appRoutes;
  constructor(private router: Router, private _location: Location) {}

  pageIsShow() {
    return this.router.url.split('/')[4] == 'details';
  }

  pageIsItems() {
    return this.router.url.split('/')[4] == 'items';
  }

  backClicked() {
    this._location.back();
  }
}
