import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ItemGroup } from 'src/app/core/models/item-group';
import { ItemGroupService } from 'src/app/core/services/item-group.service';
import { Location } from '@angular/common';
import { appRoutes } from 'src/app/core/routes-list';

@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.scss'],
})
export class ShowComponent implements OnInit {
  uuid!: string;
  itemGroup!: ItemGroup;
  public sub: any;
  public loading = false;

  public routes = appRoutes;

  constructor(
    private router: Router,
    private ItemGroupService: ItemGroupService,
    private _location: Location
  ) {}

  ngOnInit(): void {
    this.uuid = this.router.url.split('/').slice(-1)[0];
    this.fetchItemGroup();
  }

  fetchItemGroup() {
    this.ItemGroupService.show(this.uuid).subscribe({
      next: (res: any) => {
        this.itemGroup = res;
      },
      error: (err: any) => {},
    });
  }

  backClicked() {
    this._location.back();
  }

  onOutletLoaded(component: any) {
    component.itemGroup = this.itemGroup;
  }
}
