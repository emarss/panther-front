import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Supplier } from 'src/app/core/models/supplier';
import { SupplierService } from 'src/app/core/services/supplier.service';
import { Location } from '@angular/common';
import { appRoutes } from 'src/app/core/routes-list';

@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.scss'],
})
export class ShowComponent implements OnInit {
  uuid!: string;
  supplier!: Supplier;
  public sub: any;
  public loading = false;

  public routes = appRoutes;

  constructor(
    private router: Router,
    private supplierService: SupplierService,
    private _location: Location
  ) {}

  ngOnInit(): void {
    this.uuid = this.router.url.split('/').slice(-1)[0];
    this.fetchSupplier();
  }

  fetchSupplier() {
    this.supplierService.show(this.uuid).subscribe({
      next: (res: any) => {
        this.supplier = new Supplier(res);
      },
      error: (err: any) => {},
    });
  }

  onOutletLoaded(component: any) {
    component.supplier = this.supplier;
  }

  backClicked() {
    this._location.back();
  }
}
