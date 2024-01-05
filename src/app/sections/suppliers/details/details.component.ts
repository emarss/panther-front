import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Supplier } from 'src/app/core/models/supplier';
import { SupplierService } from 'src/app/core/services/supplier.service';
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
  supplier!: Supplier;
  public sub: any;
  public loading = false;

  public routes = appRoutes;

  constructor(
    private router: Router,
    private supplierService: SupplierService,
    private alertService: AlertService,
    private toastService: ToastService,
    private confirmDialogService: ConfirmDialogService
  ) {}

  confirmDelete() {
    this.confirmDialogService.showConfirmDialog({
      title: 'Confirm Delete',
      message: `Are you sure you want to delete ${this.supplier.name}`,
      actionText: 'Delete',
      actionBtnClass: 'btn-danger',
      action: () => {
        this.loading = true;
        this.supplierService.delete(this.supplier.uuid).subscribe({
          next: (res: Supplier) => {
            this.loading = false;
            this.toastService.showSuccess(
              `Supplier '${res.name}' has been deleted successfully.`
            );
            this.router.navigateByUrl(this.routes.people.suppliers.index);
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
