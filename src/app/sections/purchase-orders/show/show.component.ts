import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PurchaseOrder } from 'src/app/core/models/purchase-order';
import { PurchaseOrderService } from 'src/app/core/services/purchase-order.service';
import { Location } from '@angular/common';
import { appRoutes } from 'src/app/core/routes-list';

@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.scss'],
})
export class ShowComponent implements OnInit {
  uuid!: string;
  purchaseOrder!: PurchaseOrder;
  public sub: any;
  public loading = false;

  public routes = appRoutes;

  constructor(
    private router: Router,
    private purchaseOrderService: PurchaseOrderService,
    private _location: Location
  ) {}

  ngOnInit(): void {
    this.uuid = this.router.url.split('/').slice(-1)[0];
    this.fetchPurchaseOrder();
  }

  fetchPurchaseOrder() {
    this.purchaseOrderService.show(this.uuid).subscribe({
      next: (res: any) => {
        this.purchaseOrder = new PurchaseOrder(res);
      },
      error: (err: any) => {},
    });
  }

  onOutletLoaded(component: any) {
    component.purchaseOrder = this.purchaseOrder;
  }

  backClicked() {
    this._location.back();
  }
}
