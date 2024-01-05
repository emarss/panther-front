import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StockIssue } from 'src/app/core/models/stock-issue';
import { StockIssueService } from 'src/app/core/services/stock-issue.service';
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
  stockIssue!: StockIssue;
  public sub: any;
  public loading = false;

  public routes = appRoutes;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private stockIssueService: StockIssueService,
    private _location: Location,
    private alertService: AlertService,
    private toastService: ToastService,
    private confirmDialogService: ConfirmDialogService
  ) {}

  ngOnInit(): void {
    this.sub = this.route.params.subscribe((params) => {
      this.uuid = params['uuid'];
      this.fetchStockIssue();
    });
  }

  fetchStockIssue() {
    this.stockIssueService.show(this.uuid).subscribe({
      next: (res: any) => {
        this.stockIssue = new StockIssue(res);
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
      message: `Are you sure you want to delete Stock issue for item ${this.stockIssue.item?.description}`,
      actionText: 'Delete',
      actionBtnClass: 'btn-danger',
      action: () => {
        this.loading = true;
        this.stockIssueService.delete(this.stockIssue.uuid).subscribe({
          next: (res: StockIssue) => {
            this.loading = false;
            this.toastService.showSuccess(
              `Stock issue for item ${this.stockIssue.item?.description} has been deleted successfully.`
            );
            this.router.navigateByUrl(this.routes.inventory.stock_issues.index);
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
