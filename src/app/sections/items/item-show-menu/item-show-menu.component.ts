import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Item } from 'src/app/core/models/item';
import { appRoutes } from 'src/app/core/routes-list';
import { Location } from '@angular/common';

@Component({
  selector: 'app-item-show-menu',
  templateUrl: './item-show-menu.component.html',
  styleUrls: ['./item-show-menu.component.scss'],
})
export class ItemShowMenuComponent {
  @Input()
  item!: Item;

  public routes = appRoutes;

  constructor(private router: Router, private _location: Location) {}

  pageIsShow() {
    return this.router.url.split('/')[4] == 'details';
  }

  pageIsPurchaseOrderItems() {
    return this.router.url.split('/')[4] == 'purchase-order-items';
  }

  pageIsStockReturns() {
    return this.router.url.split('/')[4] == 'stock-returns';
  }

  pageIsStockIssues() {
    return this.router.url.split('/')[4] == 'stock-issues';
  }

  pageIsStatement() {
    return this.router.url.split('/')[4] == 'statement';
  }

  backClicked() {
    this._location.back();
  }
}
