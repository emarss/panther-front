import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { PurchaseOrder } from 'src/app/core/models/purchase-order';
import { appRoutes } from 'src/app/core/routes-list';
import { Location } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddRefundComponent } from '../add-refund/add-refund.component';
import { AddPaymentComponent } from '../add-payment/add-payment.component';

@Component({
  selector: 'app-purchase-order-show-menu',
  templateUrl: './purchase-order-show-menu.component.html',
  styleUrls: ['./purchase-order-show-menu.component.scss'],
})
export class PurchaseOrderShowMenuComponent {
  @Input()
  purchaseOrder!: PurchaseOrder;

  public routes = appRoutes;

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private _location: Location
  ) {}

  pageIsShow() {
    return this.router.url.split('/')[4] == 'details';
  }

  pageIsSummary() {
    return this.router.url.split('/')[4] == 'summary';
  }
  pageIsPayments() {
    return this.router.url.split('/')[4] == 'payments';
  }
  pageIsRefunds() {
    return this.router.url.split('/')[4] == 'refunds';
  }

  backClicked() {
    this._location.back();
  }

  public addPurchaseRefund() {
    const modalRef = this.modalService.open(AddRefundComponent, {
      centered: true,
      size: 'lg',
    });
    modalRef.componentInstance.purchaseOrder = this.purchaseOrder;
  }

  public addPurchasePayment() {
    const modalRef = this.modalService.open(AddPaymentComponent, {
      centered: true,
      size: 'lg',
    });
    modalRef.componentInstance.purchaseOrder = this.purchaseOrder;
  }
}
