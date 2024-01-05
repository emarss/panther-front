import { Component } from '@angular/core';
import { StockAdjustmentService } from 'src/app/core/services/stock-adjustment.service';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'src/app/core/services/alert.service';
import { ActivatedRoute, Router } from '@angular/router';
import { appRoutes } from '../../../core/routes-list';
import { SettingService } from 'src/app/core/services/setting.service';
import { CustomSelectOption } from 'src/app/core/interfaces/custom-select-option';

import { Item } from 'src/app/core/models/item';
import { ItemService } from 'src/app/core/services/item.service';
import * as moment from 'moment';
import { User } from 'src/app/core/models/user';
import { UserService } from 'src/app/core/services/user.service';
import { BehaviorSubject } from 'rxjs';
import { StockAdjustment } from 'src/app/core/models/stock-adjustment';
import { ToastService } from 'src/app/core/services/toast-service.service';
import { AddItemModalComponent } from '../../items/add-item-modal/add-item-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent {
  public form!: FormGroup;
  public stockAdjustmentToEdit?: StockAdjustment;
  uuid?: string;

  public routes = appRoutes;

  public sub: any;
  private loadingReqestSubject = new BehaviorSubject<number>(0);
  private completedRequests = 0;

  public showValidationErrors = false;
  public loading = true;
  itemsList: Array<CustomSelectOption> = [];
  typesList: Array<string> = [];

  constructor(
    private route: ActivatedRoute,
    public fb: FormBuilder,
    private router: Router,
    private stockAdjustmentService: StockAdjustmentService,
    private _location: Location,
    private alertService: AlertService,
    private toastService: ToastService,
    private itemService: ItemService,
    private modalService: NgbModal,
    private settingService: SettingService
  ) {
    this.initializeCreateForm();

    this.itemService.all().subscribe({
      next: (value) => {
        this.itemsList = value.map((el: Item) => {
          return {
            value: el.uuid,
            name: el.description,
          };
        });
        this.route.params.subscribe({
          next: (params) => {
            if (params['item_uuid']) {
              this.form
                .get('item')
                ?.setValue(
                  this.itemsList.find((el) => el.value === params['item_uuid'])
                );
            }
          },
        });
        this.updateNumberOfCompletedRequests();
      },
      error: (err: any) => {
        this.loading = false;
        this.alertService.showNotificationForHttpError(err);
      },
    });

    this.settingService.getAdjustmentTypes().subscribe({
      next: (value) => {
        this.typesList = value;
        this.updateNumberOfCompletedRequests();
      },
      error: (err: any) => {
        this.loading = false;
        this.alertService.showNotificationForHttpError(err);
      },
    });

    this.sub = this.route.params.subscribe({
      next: (params) => {
        this.uuid = params['uuid'];
        if (this.uuid) {
          this.fetchStockAdjustment();
        }
        this.updateNumberOfCompletedRequests();
      },
      error: (err: any) => {
        this.loading = false;
        this.alertService.showNotificationForHttpError(err);
      },
    });

    this.loadingReqestSubject.subscribe({
      next: (val: number) => {
        if ((!this.uuid && val === 3) || (this.uuid && val === 4)) {
          // requests to be performed
          this.loading = false;
        }
      },
    });
  }

  createNewItem() {
    const modalRef = this.modalService.open(AddItemModalComponent, {
      centered: true,
      size: 'lg',
    });
    modalRef.result.then(() => {
      let createdItemString = localStorage.getItem('created-item');

      if (createdItemString) {
        localStorage.removeItem('created-item');
        let createdItem = new Item(JSON.parse(createdItemString)!);
        this.itemsList.push(this.mapItem(createdItem));
        this.form.get('item')?.setValue(this.mapItem(createdItem));
      }
    });
  }

  private updateNumberOfCompletedRequests() {
    this.completedRequests = this.completedRequests + 1;
    this.loadingReqestSubject.next(this.completedRequests);
  }

  private initializeCreateForm() {
    this.form = this.fb.group({
      date: [this.mapDate(), [Validators.required, Validators.maxLength(199)]],
      quantity: ['', [Validators.required, Validators.maxLength(199)]],
      comments: ['', [Validators.required, Validators.maxLength(200)]],
      item: ['', [Validators.required]],
      type: ['', [Validators.required]],
    });
  }

  mapItem(el?: Item): any {
    return {
      value: el?.uuid,
      name: el?.description,
    };
  }

  mapType(el?: User): any {
    return {
      value: el?.uuid,
      name: el?.name,
    };
  }

  private initializeEditForm() {
    this.form = this.fb.group({
      date: [
        this.mapDate(this.stockAdjustmentToEdit?.date),
        [Validators.required, Validators.maxLength(199)],
      ],
      quantity: [
        this.stockAdjustmentToEdit?.quantity,
        [Validators.required, Validators.maxLength(199)],
      ],
      comments: [
        this.stockAdjustmentToEdit?.comments,
        [Validators.required, Validators.maxLength(199)],
      ],
      item: [
        this.mapItem(this.stockAdjustmentToEdit?.item),
        [Validators.required],
      ],
      type: [this.stockAdjustmentToEdit?.type, [Validators.required]],
    });
  }

  fetchStockAdjustment() {
    this.stockAdjustmentService.show(this.uuid!).subscribe({
      next: (res: any) => {
        this.stockAdjustmentToEdit = res;
        this.initializeEditForm();
        this.updateNumberOfCompletedRequests();
      },
      error: (err: any) => {
        this.loading = false;
      },
    });
  }

  backClicked() {
    this._location.back();
  }

  public save() {
    if (this.loading) {
      return;
    }

    if (!this.form.valid) {
      this.toastService.showError(
        'Please, fill up all required form fields.',
        'Validation Error'
      );
      this.showValidationErrors = true;
      return;
    }

    if (this.isEditForm()) {
      this.update();
    } else {
      this.store();
    }
  }

  public isEditForm() {
    return this.stockAdjustmentToEdit !== undefined;
  }

  getPageTitle(): string {
    return this.isEditForm()
      ? `Edit ${this.stockAdjustmentToEdit?.item?.description}`
      : 'Create Stock adjustment';
  }

  mapDate(date?: number): string {
    let dateString = moment(date).format('YYYY-MM-DD');
    return dateString;
  }

  private store() {
    const data = {
      date: moment(this.form.get('date')?.value).format('x'),
      quantity: this.form.get('quantity')?.value,
      comments: this.form.get('comments')?.value,
      item_uuid: this.form.get('item')?.value.value,
      type: this.form.get('type')?.value,
    };

    this.loading = true;
    this.stockAdjustmentService.store(data).subscribe({
      next: (res: StockAdjustment) => {
        this.toastService.showSuccess(
          `Stock adjustment for item '${res.item?.description}' has been added successfully.`
        );
        this.loading = false;
        this.router.navigateByUrl(
          this.routes.inventory.stock_adjustments.index
        );
      },
      error: (err: any) => {
        this.loading = false;
        this.alertService.showNotificationForHttpError(err);
      },
    });
  }

  private update() {
    const data = {
      date: moment(this.form.get('date')?.value).format('x'),
      quantity: this.form.get('quantity')?.value,
      comments: this.form.get('comments')?.value,
      item_uuid: this.form.get('item')?.value.value,
      type: this.form.get('type')?.value,
    };

    this.loading = true;
    this.stockAdjustmentService.update(data, this.uuid!).subscribe({
      next: (res: any) => {
        this.toastService.showSuccess(
          `Stock adjustment for item '${this.stockAdjustmentToEdit?.item?.description}' has been updated successfully.`
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
  }
}
