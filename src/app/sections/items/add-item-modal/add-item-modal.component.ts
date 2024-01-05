import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Item } from 'src/app/core/models/item';

import { appRoutes } from 'src/app/core/routes-list';
import { AlertService } from 'src/app/core/services/alert.service';
import { ItemService } from 'src/app/core/services/item.service';
import { CustomSelectOption } from 'src/app/shared/custom-multi-select/custom-multi-select.component';
import { ItemGroupService } from 'src/app/core/services/item-group.service';
import { ItemGroup } from 'src/app/core/models/item-group';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject } from 'rxjs';
import { ToastService } from 'src/app/core/services/toast-service.service';
import { UnitOfMeasureService } from 'src/app/core/services/unit-of-measure.service';
import { UnitOfMeasure } from 'src/app/core/models/unit-of-measure';
import { TaxService } from 'src/app/core/services/tax.service';
import { Tax } from 'src/app/core/models/tax';
import { AddItemGroupModalComponent } from '../../item-groups/add-item-group-modal/add-item-group-modal.component';
import { AddTaxModalComponent } from '../../taxes/add-tax-modal/add-tax-modal.component';
import { AddUnitOfMeasureModalComponent } from '../../unit-of-measures/add-unit-of-measure-modal/add-unit-of-measure-modal.component';

@Component({
  selector: 'app-add-item-modal',
  templateUrl: './add-item-modal.component.html',
  styleUrls: ['./add-item-modal.component.scss'],
})
export class AddItemModalComponent {
  public form!: FormGroup;
  public routes = appRoutes;
  private loadingReqestSubject = new BehaviorSubject<number>(0);
  private completedRequests = 0;

  public showValidationErrors = false;
  public loading = true;

  taxesList: Array<CustomSelectOption> = [];
  itemTypesList: Array<CustomSelectOption> = [];
  itemGroupsList: Array<CustomSelectOption> = [];
  unitOfMeasuresList: Array<CustomSelectOption> = [];

  constructor(
    public fb: FormBuilder,
    private itemService: ItemService,
    private unitofMeasureService: UnitOfMeasureService,
    private itemGroupService: ItemGroupService,
    public activeModal: NgbActiveModal,
    private taxService: TaxService,
    private modalService: NgbModal,
    private toastService: ToastService,
    private alertService: AlertService
  ) {
    this.initializeCreateForm();

    //getting unit of measures list
    this.unitofMeasureService.all().subscribe({
      next: (value) => {
        this.unitOfMeasuresList = value.map((el: UnitOfMeasure) => {
          return this.mapUnitOfMeasure(el);
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

    this.loadingReqestSubject.subscribe({
      next: (val: number) => {
        if (val === 4) {
          // requests to be performed
          this.loading = false;
        }
      },
    });
  }

  private getUnitBuyingPrice() {
    return this.form.get('unit_buying_price')?.value == ''
      ? 0
      : this.form.get('unit_buying_price')?.value;
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
      let createdUnitOfMeasureString = localStorage.getItem('created-item');

      if (createdUnitOfMeasureString) {
        localStorage.removeItem('created-item');
        let createdUnitOfMeasure = new UnitOfMeasure(
          JSON.parse(createdUnitOfMeasureString)!
        );
        this.unitOfMeasuresList.push(
          this.mapUnitOfMeasure(createdUnitOfMeasure)
        );
        this.form
          .get('UnitOfMeasure')
          ?.setValue(this.mapUnitOfMeasure(createdUnitOfMeasure));
      }
    });
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

  mapItemGroup(el?: ItemGroup): any {
    return {
      value: el?.uuid,
      name: el?.name,
    };
  }

  mapTax(el?: Tax) {
    return {
      value: el?.uuid,
      name: `${el?.name} - ${el?.rate}%`,
    };
  }

  mapUnitOfMeasure(el?: UnitOfMeasure) {
    return {
      value: el?.uuid,
      name: `${el?.unit} - ${el?.symbol}`,
    };
  }

  public itemIsService() {
    let isService =
      this.form.get('type')?.value?.value?.toLowerCase() === 'service';
    if (isService) {
      this.form.get('low_stock_number')?.setValue(0);
    }
    return isService;
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

    const data = {
      description: this.form.get('description')?.value,
      code: this.form.get('code')?.value,
      unit_selling_price: this.form.get('unit_selling_price')?.value,
      unit_buying_price: this.getUnitBuyingPrice(),
      type: this.form.get('type')?.value.value,
      low_stock_number: this.form.get('low_stock_number')?.value ?? 0,
      vat: this.form.get('vat')?.value,
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
        localStorage.setItem('created-item', JSON.stringify(res));
        this.activeModal.close(res);
      },
      error: (err: any) => {
        this.loading = false;

        this.alertService.showNotificationForHttpError(err);
      },
    });
  }
}
