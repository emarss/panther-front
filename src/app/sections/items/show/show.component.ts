import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Item } from 'src/app/core/models/item';
import { appRoutes } from 'src/app/core/routes-list';
import { AlertService } from 'src/app/core/services/alert.service';
import { ItemService } from 'src/app/core/services/item.service';

@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.scss'],
})
export class ShowComponent {
  uuid!: string;
  item!: Item;
  public sub: any;
  public loading = false;

  public routes = appRoutes;

  constructor(
    private router: Router,
    private itemService: ItemService,
    private alertService: AlertService
  ) {
    this.uuid = this.router.url.split('/').slice(-1)[0];
    this.fetchItem();
  }

  onOutletLoaded(component: any) {
    component.item = this.item;
  }

  fetchItem() {
    this.itemService.show(this.uuid).subscribe({
      next: (res: any) => {
        this.item = new Item(res);
      },
      error: (err: any) => {},
    });
  }
}
