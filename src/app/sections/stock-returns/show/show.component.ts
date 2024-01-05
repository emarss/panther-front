import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StockReturn } from 'src/app/core/models/stock-return';
import { StockReturnService } from 'src/app/core/services/stock-return.service';
import { Location } from '@angular/common';
import { AlertService } from 'src/app/core/services/alert.service';
import { ConfirmDialogService } from 'src/app/core/services/confirm-dialog.service';
import { appRoutes } from 'src/app/core/routes-list';
import { ToastService } from 'src/app/core/services/toast-service.service';

@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.scss'],
})
export class ShowComponent implements OnInit {
  uuid!: string;
  stockReturn!: StockReturn;
  public sub: any;
  public loading = false;

  public routes = appRoutes;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private stockReturnService: StockReturnService,
    private _location: Location,
    private alertService: AlertService,
    private toastService: ToastService,
    private confirmDialogService: ConfirmDialogService
  ) {}

  ngOnInit(): void {
    this.sub = this.route.params.subscribe((params) => {
      this.uuid = params['uuid'];
      this.fetchStockReturn();
    });
  }

  fetchStockReturn() {
    this.stockReturnService.show(this.uuid).subscribe({
      next: (res: any) => {
        this.stockReturn = new StockReturn(res);
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
      message: `Are you sure you want to delete Stock return for item ${this.stockReturn.item?.description}`,
      actionText: 'Delete',
      actionBtnClass: 'btn-danger',
      action: () => {
        this.loading = true;
        this.stockReturnService.delete(this.stockReturn.uuid).subscribe({
          next: (res: StockReturn) => {
            this.loading = false;
            this.toastService.showSuccess(
              `Stock return for item ${this.stockReturn.item?.description} has been deleted successfully.`
            );
            this.router.navigateByUrl(
              this.routes.inventory.stock_returns.index
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
