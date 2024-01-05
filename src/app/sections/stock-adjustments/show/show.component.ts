import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StockAdjustmentService } from 'src/app/core/services/stock-adjustment.service';
import { Location } from '@angular/common';
import { AlertService } from 'src/app/core/services/alert.service';
import { ConfirmDialogService } from 'src/app/core/services/confirm-dialog.service';
import { appRoutes } from 'src/app/core/routes-list';
import { StockAdjustment } from 'src/app/core/models/stock-adjustment';
import { ToastService } from 'src/app/core/services/toast-service.service';

@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.scss'],
})
export class ShowComponent implements OnInit {
  uuid!: string;
  stockAdjustment!: StockAdjustment;
  public sub: any;
  public loading = false;

  public routes = appRoutes;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private stockAdjustmentService: StockAdjustmentService,
    private _location: Location,
    private alertService: AlertService,
    private toastService: ToastService,
    private confirmDialogService: ConfirmDialogService
  ) {}

  ngOnInit(): void {
    this.sub = this.route.params.subscribe((params) => {
      this.uuid = params['uuid'];
      this.fetchStockAdjustment();
    });
  }

  fetchStockAdjustment() {
    this.stockAdjustmentService.show(this.uuid).subscribe({
      next: (res: any) => {
        this.stockAdjustment = new StockAdjustment(res);
      },
      error: (err: any) => {},
    });
  }

  backClicked() {
    this._location.back();
  }

  confirmDelete() {
    this.confirmDialogService.showConfirmDialog({
      title: 'Confirm Delete',
      message: `Are you sure you want to delete Stock adjustment for item ${this.stockAdjustment.item?.description}`,
      actionText: 'Delete',
      actionBtnClass: 'btn-danger',
      action: () => {
        this.loading = true;
        this.stockAdjustmentService
          .delete(this.stockAdjustment.uuid)
          .subscribe({
            next: (res: StockAdjustment) => {
              this.loading = false;
              this.toastService.showSuccess(
                `Stock adjustment for item ${this.stockAdjustment.item?.description} has been deleted successfully.`
              );
              this.router.navigateByUrl(
                this.routes.inventory.stock_adjustments.index
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
