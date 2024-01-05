import { Component, ElementRef, ViewChild } from '@angular/core';
import { ItemGroupService } from 'src/app/core/services/item-group.service';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ItemGroup } from 'src/app/core/models/item-group';
import { AlertService } from 'src/app/core/services/alert.service';
import { ActivatedRoute, Router } from '@angular/router';
import { appRoutes } from '../../../core/routes-list';
import { BehaviorSubject } from 'rxjs';
import { ToastService } from 'src/app/core/services/toast-service.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent {
  public form!: FormGroup;
  public itemGroupToEdit?: ItemGroup;
  uuid?: string;

  public routes = appRoutes;

  public sub: any;
  private loadingReqestSubject = new BehaviorSubject<number>(0);
  private completedRequests = 0;

  public showValidationErrors = false;
  public loading = true;

  constructor(
    private route: ActivatedRoute,
    public fb: FormBuilder,
    private router: Router,
    private ItemGroupService: ItemGroupService,
    private _location: Location,
    private toastService: ToastService,
    private alertService: AlertService
  ) {
    this.initializeCreateForm();

    this.sub = this.route.params.subscribe({
      next: (params) => {
        this.uuid = params['uuid'];
        if (this.uuid) {
          this.fetchItemGroup();
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
        if ((!this.uuid && val === 1) || (this.uuid && val === 2)) {
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
      name: ['', [Validators.required, Validators.maxLength(199)]],
      description: ['', [Validators.required, Validators.maxLength(199)]],
    });
  }

  private initializeEditForm() {
    this.form = this.fb.group({
      name: [
        this.itemGroupToEdit?.name,
        [Validators.required, Validators.maxLength(199)],
      ],
      description: [
        this.itemGroupToEdit?.description,
        [Validators.required, Validators.maxLength(199)],
      ],
    });
  }

  fetchItemGroup() {
    this.ItemGroupService.show(this.uuid!).subscribe({
      next: (res: any) => {
        this.itemGroupToEdit = res;
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
    return this.itemGroupToEdit !== undefined;
  }

  getPageTitle(): string {
    return this.isEditForm()
      ? `Edit ${this.itemGroupToEdit?.name}`
      : 'Create ItemGroup';
  }

  private store() {
    const data = {
      name: this.form.get('name')?.value,
      description: this.form.get('description')?.value,
    };

    this.loading = true;
    this.ItemGroupService.store(data).subscribe({
      next: (res: ItemGroup) => {
        this.toastService.showSuccess(
          `Item Group '${res.name}' has been added successfully.`
        );
        this.router.navigateByUrl(this.routes.administration.item_groups.index);
      },
      error: (err: any) => {
        this.loading = false;
        this.alertService.showNotificationForHttpError(err);
      },
    });
  }

  private update() {
    const data = {
      name: this.form.get('name')?.value,
      description: this.form.get('description')?.value,
    };

    this.loading = true;
    this.ItemGroupService.update(data, this.uuid!).subscribe({
      next: (res: any) => {
        this.toastService.showSuccess(
          `Item Group '${this.itemGroupToEdit?.name}' has been updated successfully.`
        );
        this.router.navigateByUrl(this.routes.administration.item_groups.index);
      },
      error: (err: any) => {
        this.loading = false;
        this.alertService.showNotificationForHttpError(err);
      },
    });
  }
}
