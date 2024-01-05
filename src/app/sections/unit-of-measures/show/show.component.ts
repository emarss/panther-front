import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UnitOfMeasure } from 'src/app/core/models/unit-of-measure';
import { UnitOfMeasureService } from 'src/app/core/services/unit-of-measure.service';
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
  unitOfMeasure!: UnitOfMeasure;
  public sub: any;
  public loading = false;

  public routes = appRoutes;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private unitOfMeasureService: UnitOfMeasureService,
    private _location: Location,
    private alertService: AlertService,
    private toastService: ToastService,
    private confirmDialogService: ConfirmDialogService
  ) {}

  ngOnInit(): void {
    this.sub = this.route.params.subscribe((params) => {
      this.uuid = params['uuid'];
      this.fetchUnitOfMeasure();
    });
  }

  fetchUnitOfMeasure() {
    this.unitOfMeasureService.show(this.uuid).subscribe({
      next: (res: any) => {
        this.unitOfMeasure = new UnitOfMeasure(res);
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
      message: `Are you sure you want to delete Unit Of Measure for item ${this.unitOfMeasure.physical_quantity}`,
      actionText: 'Delete',
      actionBtnClass: 'btn-danger',
      action: () => {
        this.loading = true;
        this.unitOfMeasureService.delete(this.unitOfMeasure.uuid).subscribe({
          next: (res: UnitOfMeasure) => {
            this.loading = false;
            this.toastService.showSuccess(
              `Unit Of Measure for item ${this.unitOfMeasure.physical_quantity} has been deleted successfully.`
            );
            this.router.navigateByUrl(
              this.routes.administration.unit_of_measures.index
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
