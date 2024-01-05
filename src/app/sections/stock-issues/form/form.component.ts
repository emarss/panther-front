import { Component } from '@angular/core';
import { StockIssueService } from 'src/app/core/services/stock-issue.service';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StockIssue } from 'src/app/core/models/stock-issue';
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
import { ToastService } from 'src/app/core/services/toast-service.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddItemModalComponent } from '../../items/add-item-modal/add-item-modal.component';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent {
  public form!: FormGroup;
  public stockIssueToEdit?: StockIssue;
  uuid?: string;

  public routes = appRoutes;

  public sub: any;
  private loadingReqestSubject = new BehaviorSubject<number>(0);
  private completedRequests = 0;

  public showValidationErrors = false;
  public loading = true;
  itemsList: Array<CustomSelectOption> = [];
  salespersonsList: Array<CustomSelectOption> = [];

  constructor(
    private route: ActivatedRoute,
    public fb: FormBuilder,
    private router: Router,
    private stockIssueService: StockIssueService,
    private _location: Location,
    private alertService: AlertService,
    private toastService: ToastService,
    private modalService: NgbModal,
    private itemService: ItemService,
    private userService: UserService,
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

    this.userService.getSalespersons().subscribe({
      next: (value) => {
        this.salespersonsList = value.map((el: User) => {
          return {
            value: el.uuid,
            name: el.name,
          };
        });
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
          this.fetchStockIssue();
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

  private updateNumberOfCompletedRequests() {
    this.completedRequests = this.completedRequests + 1;
    this.loadingReqestSubject.next(this.completedRequests);
  }

  private initializeCreateForm() {
    this.form = this.fb.group({
      date: [this.mapDate(), [Validators.required, Validators.maxLength(199)]],
      quantity: ['', [Validators.required, Validators.maxLength(199)]],
      comments: ['', [Validators.maxLength(200)]],
      item: ['', [Validators.required]],
      salesperson: ['', [Validators.required]],
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


  mapItem(el?: Item): any {
    return {
      value: el?.uuid,
      name: el?.description,
    };
  }

  mapSalesperson(el?: User): any {
    return {
      value: el?.uuid,
      name: el?.name,
    };
  }

  private initializeEditForm() {
    this.form = this.fb.group({
      date: [
        this.mapDate(this.stockIssueToEdit?.date),
        [Validators.required, Validators.maxLength(199)],
      ],
      quantity: [
        this.stockIssueToEdit?.quantity,
        [Validators.required, Validators.maxLength(199)],
      ],
      comments: [this.stockIssueToEdit?.comments, [Validators.maxLength(199)]],
      item: [this.mapItem(this.stockIssueToEdit?.item), [Validators.required]],
      salesperson: [
        this.mapSalesperson(this.stockIssueToEdit?.salesperson),
        [Validators.required],
      ],
    });
  }

  fetchStockIssue() {
    this.stockIssueService.show(this.uuid!).subscribe({
      next: (res: any) => {
        this.stockIssueToEdit = res;
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
    return this.stockIssueToEdit !== undefined;
  }

  getPageTitle(): string {
    return this.isEditForm()
      ? `Edit ${this.stockIssueToEdit?.item?.description}`
      : 'Create Stock issue';
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
      salesperson_uuid: this.form.get('salesperson')?.value.value,
    };
    this.loading = true;
    this.stockIssueService.store(data).subscribe({
      next: (res: StockIssue) => {
        this.toastService.showSuccess(
          `Stock issue for item '${res.item?.description}' has been added successfully.`
        );
        this.router.navigateByUrl(this.routes.inventory.stock_issues.index);
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
      salesperson_uuid: this.form.get('salesperson')?.value.value,
    };

    this.loading = true;
    this.stockIssueService.update(data, this.uuid!).subscribe({
      next: (res: any) => {
        this.toastService.showSuccess(
          `Stock issue for item '${this.stockIssueToEdit?.item?.description}' has been updated successfully.`
        );
        this.router.navigateByUrl(this.routes.inventory.stock_issues.index);
      },
      error: (err: any) => {
        this.loading = false;
        this.alertService.showNotificationForHttpError(err);
      },
    });
  }
}
