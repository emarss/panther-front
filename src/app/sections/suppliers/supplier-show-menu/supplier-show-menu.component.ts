import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Supplier } from 'src/app/core/models/supplier';
import { appRoutes } from 'src/app/core/routes-list';
import { Location } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from 'src/app/core/services/toast-service.service';

@Component({
  selector: 'app-supplier-show-menu',
  templateUrl: './supplier-show-menu.component.html',
  styleUrls: ['./supplier-show-menu.component.scss'],
})
export class SupplierShowMenuComponent {
  @Input()
  supplier!: Supplier;

  public routes = appRoutes;

  constructor(
    private router: Router,
    private toastService: ToastService,
    private modalService: NgbModal,
    private _location: Location
  ) {}

  pageIsContactPersons() {
    return this.router.url.split('/')[4] == 'contact-persons';
  }

  pageIsShow() {
    return this.router.url.split('/')[4] == 'details';
  }

  pageIsStatement() {
    return this.router.url.split('/')[4] == 'statement';
  }
  pageIsPayments() {
    return this.router.url.split('/')[4] == 'payments';
  }
  pageIsRefunds() {
    return this.router.url.split('/')[4] == 'refunds';
  }
  pageIsPurchaseOrders() {
    return this.router.url.split('/')[4] == 'purchase-orders';
  }

  backClicked() {
    this._location.back();
  }
}
