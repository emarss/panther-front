import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Item } from 'src/app/core/models/item';
import { appRoutes } from 'src/app/core/routes-list';
import { Location } from '@angular/common';
import { AlertService } from 'src/app/core/services/alert.service';
import { ItemService } from 'src/app/core/services/item.service';
import { CustomSelectOption } from 'src/app/shared/custom-multi-select/custom-multi-select.component';
import { ItemGroupService } from 'src/app/core/services/item-group.service';
import { ItemGroup } from 'src/app/core/models/item-group';
import { BehaviorSubject } from 'rxjs';
import { UnitOfMeasureService } from 'src/app/core/services/unit-of-measure.service';
import { UnitOfMeasure } from 'src/app/core/models/unit-of-measure';
import { ToastService } from 'src/app/core/services/toast-service.service';
import { TaxService } from 'src/app/core/services/tax.service';
import { Tax } from 'src/app/core/models/tax';
import { AddItemGroupModalComponent } from '../../item-groups/add-item-group-modal/add-item-group-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddTaxModalComponent } from '../../taxes/add-tax-modal/add-tax-modal.component';
import { AddUnitOfMeasureModalComponent } from '../../unit-of-measures/add-unit-of-measure-modal/add-unit-of-measure-modal.component';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent {
  public form!: FormGroup;
  public itemToEdit?: Item;
  uuid?: string;

  public routes = appRoutes;

  public sub: any;
  private loadingReqestSubject = new BehaviorSubject<number>(0);
  private completedRequests = 0;

  public showValidationErrors = false;
  public loading = true;

  itemTypesList: Array<CustomSelectOption> = [];
  itemGroupsList: Array<CustomSelectOption> = [];
  taxesList: Array<CustomSelectOption> = [];
  unitOfMeasuresList: Array<CustomSelectOption> = [];

  constructor(
    private route: ActivatedRoute,
    public fb: FormBuilder,
    private router: Router,
    private itemService: ItemService,
    private itemGroupService: ItemGroupService,
    private taxService: TaxService,
    private modalService: NgbModal,
    private unitofMeasureService: UnitOfMeasureService,
    private _location: Location,
    private toastService: ToastService,
    private alertService: AlertService
  ) {
    this.initializeCreateForm();

    //getting item groups list
    this.itemGroupService.all().subscribe({
      next: (value) => {
        this.itemGroupsList = value.map((el: ItemGroup) => {
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

    this.taxService.all().subscribe({
      next: (value) => {
        this.taxesList = value.map((el: Tax) => {
          return {
            value: el.uuid,
            name: `${el.name} - ${el.rate}%`,
          };
        });
        this.updateNumberOfCompletedRequests();
      },
      error: (err: any) => {
        this.loading = false;
        this.alertService.showNotificationForHttpError(err);
      },
    });

    //getting unit of measures list
    this.unitofMeasureService.all().subscribe({
      next: (value) => {
        this.unitOfMeasuresList = value.map((el: UnitOfMeasure) => {
          return {
            value: el.uuid,
            name: `${el?.unit} - ${el?.symbol}`,
          };
        });
        this.updateNumberOfCompletedRequests();
      },
      error: (err: any) => {
        this.loading = false;
        this.alertService.showNotificationForHttpError(err);
      },
    });

    //getting item types list
    this.itemService.getItemTypes().subscribe({
      next: (value) => {
        this.itemTypesList = value.map((el: string) => {
          return {
            value: el,
            name: el,
          };
        });
        if (!this.form.get('type')?.value) {
          this.form.get('type')?.setValue(this.itemTypesList[0]);
        }
        this.updateNumberOfCompletedRequests();
      },
      error: (err: any) => {
        this.loading = false;
        this.alertService.showNotificationForHttpError(err);
      },
    });

    //getting item to edit if is editing
    this.sub = this.route.params.subscribe({
      next: (params) => {
        this.uuid = params['uuid'];
        if (this.uuid) {
          this.fetchItem();
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
        if ((!this.uuid && val === 5) || (this.uuid && val === 6)) {
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

  ngOnInit(): void {}

  private initializeCreateForm() {
    this.form = this.fb.group({
      description: ['', [Validators.required, Validators.maxLength(199)]],
      code: ['', []],
      unit_selling_price: ['', [Validators.required]],
      unit_buying_price: ['', []],
      type: ['', [Validators.required]],
      low_stock_number: ['', [Validators.required]],
      unit_of_measure: [[], []],
      tax: [[], []],
      item_groups: [[], []],
    });
  }

  private initializeEditForm() {
    this.form = this.fb.group({
      description: [
        this.itemToEdit?.description,
        [Validators.required, Validators.maxLength(199)],
      ],
      code: [this.itemToEdit?.code, []],
      unit_selling_price: [
        this.itemToEdit?.unit_selling_price,
        [Validators.required],
      ],
      unit_buying_price: [this.itemToEdit?.unit_buying_price, []],
      type: [this.mapItemType(this.itemToEdit?.type), [Validators.required]],
      low_stock_number: [
        this.itemToEdit?.low_stock_number,
        [Validators.required],
      ],
      unit_of_measure: [
        this.mapUnitOfMeasure(this.itemToEdit!.unit_of_measure),
        [],
      ],
      tax: [this.mapTax(this.itemToEdit!.tax), []],
      item_groups: [this.mapItemGroupOptions(this.itemToEdit!.item_groups), []],
    });
  }

  fetchItem() {
    this.itemService.show(this.uuid!).subscribe({
      next: (res: any) => {
        this.itemToEdit = res;
        this.initializeEditForm();
        this.updateNumberOfCompletedRequests();
      },
      error: (err: any) => {
        this.loading = false;
      },
    });
  }

  mapItemGroupOptions(item_groups?: Array<ItemGroup>) {
    return item_groups?.map((el) => {
      return { value: el.uuid, name: el.name };
    });
  }

  mapItemType(el?: string) {
    return {
      value: el,
      name: el,
    };
  }

  mapUnitOfMeasure(el?: UnitOfMeasure) {
    return {
      value: el?.uuid,
      name: `${el?.unit} - ${el?.symbol}`,
    };
  }

  mapTax(el?: Tax) {
    return {
      value: el?.uuid,
      name: `${el?.name} - ${el?.rate}%`,
    };
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
    return this.itemToEdit !== undefined;
  }

  getPageTitle(): string {
    return this.isEditForm()
      ? `Edit ${this.itemToEdit?.description}`
      : 'Create Item';
  }

  public itemIsService() {
    let isService =
      this.form.get('type')?.value?.value?.toLowerCase() === 'service';
    if (isService) {
      this.form.get('low_stock_number')?.setValue(0);
    }
    return isService;
  }

  private getUnitBuyingPrice() {
    return this.form.get('unit_buying_price')?.value == ''
      ? 0
      : this.form.get('unit_buying_price')?.value;
  }

  createNewItemGroup() {
    const modalRef = this.modalService.open(AddItemGroupModalComponent, {
      centered: true,
      size: 'lg',
    });
    modalRef.result.then(() => {
      let createdItemGroupString = localStorage.getItem('created-item-group');
      if (createdItemGroupString) {
        localStorage.removeItem('created-item-group');
        let createdItemGroup = new ItemGroup(
          JSON.parse(createdItemGroupString)!
        );
        this.itemGroupsList.push(this.mapItemGroup(createdItemGroup));
        let currentItemGroups: Array<CustomSelectOption> =
          this.form.get('item_groups')?.value;
        currentItemGroups.push(this.mapItemGroup(createdItemGroup));
        console.log(currentItemGroups);
        this.form.get('item_groups')?.setValue(currentItemGroups);
      }
    });
  }

  createNewTax() {
    const modalRef = this.modalService.open(AddTaxModalComponent, {
      centered: true,
      size: 'lg',
    });
    modalRef.result.then(() => {
      let createdTaxString = localStorage.getItem('created-tax');

      if (createdTaxString) {
        localStorage.removeItem('created-tax');
        let createdTax = new Tax(JSON.parse(createdTaxString)!);
        this.taxesList.push(this.mapTax(createdTax));
        this.form.get('tax')?.setValue(this.mapTax(createdTax));
      }
    });
  }

  createNewUnitOfMeasure() {
    const modalRef = this.modalService.open(AddUnitOfMeasureModalComponent, {
      centered: true,
      size: 'lg',
    });
    modalRef.result.then(() => {
      let createdUnitOfMeasureString = localStorage.getItem('created-unitOfMeasure');

      if (createdUnitOfMeasureString) {
        localStorage.removeItem('created-unitOfMeasure');
        let createdUnitOfMeasure = new UnitOfMeasure(
          JSON.parse(createdUnitOfMeasureString)!
        );
        this.unitOfMeasuresList.push(
          this.mapUnitOfMeasure(createdUnitOfMeasure)
        );
        this.form
          .get('unit_of_measure')
          ?.setValue(this.mapUnitOfMeasure(createdUnitOfMeasure));
      }
    });
  }

  mapItemGroup(el?: ItemGroup): any {
    return {
      value: el?.uuid,
      name: el?.name,
    };
  }

  private store() {
    const data = {
      description: this.form.get('description')?.value,
      code: this.form.get('code')?.value,
      unit_selling_price: this.form.get('unit_selling_price')?.value,
      unit_buying_price: this.getUnitBuyingPrice(),
      type: this.form.get('type')?.value.value,
      low_stock_number: this.form.get('low_stock_number')?.value ?? 0,
      tax_uuid: this.form.get('tax')?.value.value,
      unit_of_measure_uuid: this.form.get('unit_of_measure')?.value.value,
      item_groups: this.form
        .get('item_groups')
        ?.value.map((el: CustomSelectOption) => {
          return el.value;
        }),
    };

    this.loading = true;
    this.itemService.store(data).subscribe({
      next: (res: Item) => {
        this.toastService.showSuccess(
          `Item '${res.description}' has been added successfully.`
        );
        this.router.navigateByUrl(this.routes.inventory.items.index);
      },
      error: (err: any) => {
        this.loading = false;
        this.alertService.showNotificationForHttpError(err);
      },
    });
  }

  private update() {
    const data = {
      description: this.form.get('description')?.value,
      code: this.form.get('code')?.value,
      unit_buying_price: this.getUnitBuyingPrice(),
      unit_selling_price: this.form.get('unit_selling_price')?.value,
      type: this.form.get('type')?.value.value,
      low_stock_number: this.form.get('low_stock_number')?.value ?? 0,
      tax_uuid: this.form.get('tax')?.value.value,
      unit_of_measure_uuid: this.form.get('unit_of_measure')?.value.value,
      item_groups: this.form
        .get('item_groups')
        ?.value.map((el: CustomSelectOption) => {
          return el.value;
        }),
    };

    this.loading = true;
    this.itemService.update(data, this.uuid!).subscribe({
      next: (res: any) => {
        this.toastService.showSuccess(
          `Item '${this.itemToEdit?.description}' has been updated successfully.`
        );
        this.router.navigateByUrl(this.routes.inventory.items.index);
      },
      error: (err: any) => {
        this.loading = false;
        this.alertService.showNotificationForHttpError(err);
      },
    });
  }
}
