import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { PurchaseOrder } from 'src/app/core/models/purchase-order';
import { PurchaseOrderService } from 'src/app/core/services/purchase-order.service';
import { AlertService } from 'src/app/core/services/alert.service';
import { ConfirmDialogService } from 'src/app/core/services/confirm-dialog.service';
import { appRoutes } from 'src/app/core/routes-list';
import { ToastService } from 'src/app/core/services/toast-service.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent {
  @Input()
  purchaseOrder!: PurchaseOrder;
  public sub: any;
  public loading = false;

  public routes = appRoutes;

  constructor(
    private router: Router,
    private purchaseOrderService: PurchaseOrderService,
    private alertService: AlertService,
    private toastService: ToastService,
    private confirmDialogService: ConfirmDialogService
  ) {}

  confirmDelete() {
    this.confirmDialogService.showConfirmDialog({
      title: 'Confirm Delete',
      message: `Are you sure you want to delete purchase number #${this.purchaseOrder.number}`,
      actionText: 'Delete',
      actionBtnClass: 'btn-danger',
      action: () => {
        this.loading = true;
        this.purchaseOrderService.delete(this.purchaseOrder.uuid).subscribe({
          next: (res: PurchaseOrder) => {
            this.loading = false;
            this.toastService.showSuccess(
              `Purchase number #${this.purchaseOrder.number} has been deleted successfully.`
            );
            this.router.navigateByUrl(
              this.routes.inventory.purchase_orders.index
            );
          },
          error: (err: any) => {
            this.loading = false;
            this.alertService.showNotificationForHttpError(err);
          },
        });
      },
    });
  }
}
