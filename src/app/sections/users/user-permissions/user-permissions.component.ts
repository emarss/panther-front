import { Component } from '@angular/core';
import { UserService } from 'src/app/core/services/user.service';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/core/models/user';
import { AlertService } from 'src/app/core/services/alert.service';
import { ActivatedRoute, Router } from '@angular/router';
import { appRoutes } from '../../../core/routes-list';
import { CustomSelectOption } from 'src/app/shared/custom-multi-select/custom-multi-select.component';
import { BehaviorSubject } from 'rxjs';
import { SettingService } from 'src/app/core/services/setting.service';
import { UserPermissionType } from 'src/app/core/models/user-permission-type';
import { ToastService } from 'src/app/core/services/toast-service.service';

@Component({
  selector: 'app-user-permissions',
  templateUrl: './user-permissions.component.html',
  styleUrls: ['./user-permissions.component.scss'],
})
export class UserPermissionsComponent {
  public form!: FormGroup;
  public userToEdit!: User;
  uuid?: string;

  public routes = appRoutes;

  public sub: any;
  private loadingReqestSubject = new BehaviorSubject<number>(0);
  private completedRequests = 0;
  public permissionsOptions: Array<CustomSelectOption> = [];
  private userPermissionTypes: Array<UserPermissionType> = [];

  public showValidationErrors = false;
  public loading = true;

  constructor(
    private route: ActivatedRoute,
    public fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private settingService: SettingService,
    private _location: Location,
    private toastService: ToastService,
    private alertService: AlertService
  ) {
    this.settingService.getUserPermissionTypes().subscribe({
      next: (value) => {
        this.userPermissionTypes = value;
        this.permissionsOptions = value.map((el: UserPermissionType) =>
          this.mapPermissionType(el)
        );
        this.updateNumberOfCompletedRequests();
      },
      error: (err: any) => {
        this.loading = false;
        this.alertService.showNotificationForHttpError(err);
      },
    });

    this.fetchUser();

    this.loadingReqestSubject.subscribe({
      next: (val: number) => {
        if (val === 3) {
          // requests to be performed
          this.loading = false;
          this.initializeEditForm();
        }
      },
    });
  }

  private updateNumberOfCompletedRequests() {
    this.completedRequests = this.completedRequests + 1;
    this.loadingReqestSubject.next(this.completedRequests);
  }

  ngOnInit(): void {}

  private initializeEditForm() {
    this.form = this.fb.group({
      items: [
        this.mapPermission(this.userToEdit.permissions?.items),
        [Validators.required],
      ],
      purchase_orders: [
        this.mapPermission(this.userToEdit.permissions?.purchase_orders),
        [Validators.required],
      ],
      stock_issues: [
        this.mapPermission(this.userToEdit.permissions?.stock_issues),
        [Validators.required],
      ],
      stock_adjustments: [
        this.mapPermission(this.userToEdit.permissions?.stock_adjustments),
        [Validators.required],
      ],
      stock_returns: [
        this.mapPermission(this.userToEdit.permissions?.stock_returns),
        [Validators.required],
      ],
      payments: [
        this.mapPermission(this.userToEdit.permissions?.payments),
        [Validators.required],
      ],
      receipts: [
        this.mapPermission(this.userToEdit.permissions?.receipts),
        [Validators.required],
      ],
      deposits: [
        this.mapPermission(this.userToEdit.permissions?.deposits),
        [Validators.required],
      ],
      withdrawals: [
        this.mapPermission(this.userToEdit.permissions?.withdrawals),
        [Validators.required],
      ],
      suppliers: [
        this.mapPermission(this.userToEdit.permissions?.suppliers),
        [Validators.required],
      ],
      contact_persons: [
        this.mapPermission(this.userToEdit.permissions?.contact_persons),
        [Validators.required],
      ],
      users: [
        this.mapPermission(this.userToEdit.permissions?.users),
        [Validators.required],
      ],
      accounts: [
        this.mapPermission(this.userToEdit.permissions?.accounts),
        [Validators.required],
      ],
      settings: [
        this.mapPermission(this.userToEdit.permissions?.settings),
        [Validators.required],
      ],
      item_groups: [
        this.mapPermission(this.userToEdit.permissions?.item_groups),
        [Validators.required],
      ],
      user_logs: [
        this.mapPermission(this.userToEdit.permissions?.user_logs),
        [Validators.required],
      ],
      documents: [
        this.mapPermission(this.userToEdit.permissions?.documents),
        [Validators.required],
      ],
      exchange_rates: [
        this.mapPermission(this.userToEdit.permissions?.exchange_rates),
        [Validators.required],
      ],
      bank_accounts: [
        this.mapPermission(this.userToEdit.permissions?.bank_accounts),
        [Validators.required],
      ],
      unit_of_measures: [
        this.mapPermission(this.userToEdit.permissions?.unit_of_measures),
        [Validators.required],
      ],
      taxes: [
        this.mapPermission(this.userToEdit.permissions?.taxes),
        [Validators.required],
      ],
    });
  }

  mapPermission(permission: number | undefined): CustomSelectOption {
    return this.mapPermissionType(
      new UserPermissionType({}).find(permission!, this.userPermissionTypes)!
    );
  }

  mapPermissionType(type: UserPermissionType): CustomSelectOption {
    return { name: type.description, value: type.code };
  }

  fetchUser() {
    this.sub = this.route.params.subscribe((params) => {
      this.uuid = params['uuid'];
      this.updateNumberOfCompletedRequests();
      if (this.uuid) {
        this.userService.show(this.uuid!).subscribe({
          next: (res: any) => {
            this.userToEdit = res;
            this.updateNumberOfCompletedRequests();
          },
          error: (err: any) => {
            this.loading = false;
            this.alertService.showNotificationForHttpError(err);
          },
        });
      }
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

    this.update();
  }

  private update() {
    const data = {
      items: this.form.get('items')?.value.value,
      purchase_orders: this.form.get('purchase_orders')?.value.value,
      stock_issues: this.form.get('stock_issues')?.value.value,
      stock_adjustments: this.form.get('stock_adjustments')?.value.value,
      stock_returns: this.form.get('stock_returns')?.value.value,
      payments: this.form.get('payments')?.value.value,
      receipts: this.form.get('receipts')?.value.value,
      deposits: this.form.get('deposits')?.value.value,
      withdrawals: this.form.get('withdrawals')?.value.value,
      suppliers: this.form.get('suppliers')?.value.value,
      contact_persons: this.form.get('contact_persons')?.value.value,
      users: this.form.get('users')?.value.value,
      accounts: this.form.get('accounts')?.value.value,
      settings: this.form.get('settings')?.value.value,
      item_groups: this.form.get('item_groups')?.value.value,
      whatsapp: this.form.get('whatsapp')?.value.value,
      facebook: this.form.get('facebook')?.value.value,
      user_logs: this.form.get('user_logs')?.value.value,
      documents: this.form.get('documents')?.value.value,
      exchange_rates: this.form.get('exchange_rates')?.value.value,
      bank_accounts: this.form.get('exchange_rates')?.value.value,
      taxes: this.form.get('taxes')?.value.value,
      unit_of_measures: this.form.get('unit_of_measures')?.value.value,
    };

    this.loading = true;
    this.userService.updatePermissions(data, this.uuid!).subscribe({
      next: (res: any) => {
        this.toastService.showSuccess(
          `User '${this.userToEdit?.name}' has been updated successfully.`
        );
        this.router.navigateByUrl(this.routes.administration.users.index);
      },
      error: (err: any) => {
        this.loading = false;
        this.alertService.showNotificationForHttpError(err);
      },
    });
  }
}
