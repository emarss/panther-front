import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ItemGroup } from 'src/app/core/models/item-group';
import { ItemGroupService } from 'src/app/core/services/item-group.service';
import { Location } from '@angular/common';
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
  itemGroup!: ItemGroup;
  public loading = false;

  public routes = appRoutes;

  constructor(
    private router: Router,
    private ItemGroupService: ItemGroupService,
    private _location: Location,
    private alertService: AlertService,
    private toastService: ToastService,
    private confirmDialogService: ConfirmDialogService
  ) {}

  ngOnInit(): void {}

  backClicked() {
    this._location.back();
  }

  confirmDelete() {
    this.confirmDialogService.showConfirmDialog({
      title: 'Confirm Delete',
      message: `Are you sure you want to delete ${this.itemGroup.name}`,
      actionText: 'Delete',
      actionBtnClass: 'btn-danger',
      action: () => {
        this.loading = true;
        this.ItemGroupService.delete(this.itemGroup.uuid).subscribe({
          next: (res: ItemGroup) => {
            this.loading = false;
            this.toastService.showSuccess(
              `Item Group '${res.name}' has been deleted successfully.`
            );
            this.router.navigateByUrl(
              this.routes.administration.item_groups.index
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
