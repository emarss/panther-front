import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Item } from 'src/app/core/models/item';
import { appRoutes } from 'src/app/core/routes-list';
import { AlertService } from 'src/app/core/services/alert.service';
import { ConfirmDialogService } from 'src/app/core/services/confirm-dialog.service';
import { ItemService } from 'src/app/core/services/item.service';
import { SettingService } from 'src/app/core/services/setting.service';
import { ToastService } from 'src/app/core/services/toast-service.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent {
  @Input()
  item!: Item;
  public sub: any;
  public loading = false;

  public routes = appRoutes;
  public current_currency: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private itemService: ItemService,
    private alertService: AlertService,
    private toastService: ToastService,
    private settingService: SettingService,
    private confirmDialogService: ConfirmDialogService
  ) {
    this.current_currency = this.settingService.getCurrentCompanyCurrency();
  }

  confirmDelete() {
    this.confirmDialogService.showConfirmDialog({
      title: 'Confirm Delete',
      message: `Are you sure you want to delete ${this.item.description}`,
      actionText: 'Delete',
      actionBtnClass: 'btn-danger',
      action: () => {
        this.loading = true;
        this.itemService.delete(this.item.uuid).subscribe({
          next: (res: Item) => {
            this.loading = false;
            this.toastService.showSuccess(
              `Item '${res.description}' has been deleted successfully.`
            );
            this.router.navigateByUrl(this.routes.inventory.items.index);
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
