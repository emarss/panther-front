import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { AlertService } from 'src/app/core/services/alert.service';
import { ConfirmDialogService } from 'src/app/core/services/confirm-dialog.service';
import { appRoutes } from 'src/app/core/routes-list';
import { Receipt } from 'src/app/core/models/receipt';
import { ReceiptService } from 'src/app/core/services/receipt.service';
import { ToastService } from 'src/app/core/services/toast-service.service';

@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.scss'],
})
export class ShowComponent implements OnInit {
  uuid!: string;
  receipt!: Receipt;
  public sub: any;
  public loading = false;
  public routes = appRoutes;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private receiptService: ReceiptService,
    private _location: Location,
    private alertService: AlertService,
    private toastService: ToastService,
    private confirmDialogService: ConfirmDialogService
  ) {}

  ngOnInit(): void {
    this.sub = this.route.params.subscribe((params) => {
      this.uuid = params['uuid'];
      this.fetchReceipt();
    });
  }

  fetchReceipt() {
    this.receiptService.show(this.uuid).subscribe({
      next: (res: any) => {
        this.receipt = new Receipt(res);
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
      message: `Are you sure you want to delete receipt for number #${this.receipt.number}`,
      actionText: 'Delete',
      actionBtnClass: 'btn-danger',
      action: () => {
        this.loading = true;
        this.receiptService.delete(this.receipt.uuid).subscribe({
          next: (res: Receipt) => {
            this.loading = false;
            this.toastService.showSuccess(
              `Receipt for number #${this.receipt.number} has been deleted successfully.`
            );
            this.router.navigateByUrl(this.routes.financials.receipts.index);
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
