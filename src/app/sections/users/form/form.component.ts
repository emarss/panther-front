import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UserService } from 'src/app/core/services/user.service';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/core/models/user';
import { AlertService } from 'src/app/core/services/alert.service';
import { ActivatedRoute, Router } from '@angular/router';
import { appRoutes } from '../../../core/routes-list';
import { SettingService } from 'src/app/core/services/setting.service';
import { CustomSelectOption } from 'src/app/shared/custom-multi-select/custom-multi-select.component';

import { BehaviorSubject } from 'rxjs';
import { ToastService } from 'src/app/core/services/toast-service.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent {
  public form!: FormGroup;
  public userToEdit?: User;
  uuid?: string;

  public routes = appRoutes;

  public sub: any;
  private loadingReqestSubject = new BehaviorSubject<number>(0);
  private completedRequests = 0;

  public showValidationErrors = false;
  public loading = true;

  userRolesList: Array<string> = [];
  userStatusesList: Array<string> = [];
  timeIntervalsList: Array<CustomSelectOption> = [];

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
    this.settingService.getUserRoles().subscribe({
      next: (value) => {
        this.userRolesList = value;
        this.updateNumberOfCompletedRequests();
      },
      error: (err: any) => {
        this.loading = false;
        this.alertService.showNotificationForHttpError(err);
      },
    });

    this.settingService.getUserStatuses().subscribe({
      next: (value) => {
        this.userStatusesList = value;
        this.updateNumberOfCompletedRequests();
      },
      error: (err: any) => {
        this.loading = false;
        this.alertService.showNotificationForHttpError(err);
      },
    });

    this.settingService.getTimeIntervals().subscribe({
      next: (value) => {
        this.timeIntervalsList = value.map((el) => {
          return this.mapTimeInterval(el);
        });
        this.updateNumberOfCompletedRequests();
      },
      error: (err: any) => {
        this.loading = false;
        this.alertService.showNotificationForHttpError(err);
      },
    });

    this.sub = this.route.params.subscribe((params) => {
      this.uuid = params['uuid'];
      if (this.uuid) {
        this.fetchUser();
      }
      this.updateNumberOfCompletedRequests();
    });

    this.initializeCreateForm();
    this.loadingReqestSubject.subscribe({
      next: (val: number) => {
        if ((!this.uuid && val === 4) || (this.uuid && val === 5)) {
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
      email: ['', [Validators.required, Validators.maxLength(199)]],
      role: ['', [Validators.required]],
      status: ['', [Validators.required]],
      whatsapp_number: ['', []],
      password: [
        '',
        [
          Validators.required,
          Validators.maxLength(199),
          Validators.minLength(6),
        ],
      ],
      passwordConfirmation: ['', [Validators.required]],
      receive_whatsapp_notifications: ['Yes', [Validators.required]],
      morning_notifications_time: [
        this.mapTimeInterval('05:00'),
        [Validators.required],
      ],
      evening_notifications_time: [
        this.mapTimeInterval('19:00'),
        [Validators.required],
      ],
    });
  }

  private initializeEditForm() {
    this.form = this.fb.group({
      name: [
        this.userToEdit?.name,
        [Validators.required, Validators.maxLength(199)],
      ],
      email: [
        this.userToEdit?.email,
        [Validators.required, Validators.maxLength(199)],
      ],
      role: [this.userToEdit?.role, [Validators.required]],
      status: [this.userToEdit?.status, [Validators.required]],
      whatsapp_number: [this.userToEdit?.whatsapp_number, []],
      receive_whatsapp_notifications: [
        this.userToEdit?.preference?.receive_whatsapp_notifications
          ? 'Yes'
          : 'No',
        [Validators.required],
      ],
      morning_notifications_time: [
        this.mapTimeInterval(
          this.userToEdit?.preference?.morning_notifications_time
        ),
        [Validators.required],
      ],
      evening_notifications_time: [
        this.mapTimeInterval(
          this.userToEdit?.preference?.evening_notifications_time
        ),
        [Validators.required],
      ],
    });
  }

  mapTimeInterval(evening_notifications_time: string | undefined): any {
    return {
      value: evening_notifications_time,
      name: evening_notifications_time,
    };
  }

  fetchUser() {
    this.userService.show(this.uuid!).subscribe({
      next: (res: any) => {
        this.userToEdit = res;
        this.initializeEditForm();
        this.updateNumberOfCompletedRequests();
      },
      error: (err: any) => {
        this.loading = false;
        this.alertService.showNotificationForHttpError(err);
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
    return this.userToEdit !== undefined;
  }

  getPageTitle(): string {
    return this.isEditForm() ? `Edit ${this.userToEdit?.name}` : 'Create User';
  }

  private store() {
    const data = {
      name: this.form.get('name')?.value,
      email: this.form.get('email')?.value,
      role: this.form.get('role')?.value,
      status: this.form.get('status')?.value,
      password: this.form.get('password')?.value,
      whatsapp_number: this.form.get('whatsapp_number')?.value,
      receive_whatsapp_notifications:
        this.form.get('receive_whatsapp_notifications')?.value == 'Yes',
      morning_notifications_time: this.form.get('morning_notifications_time')
        ?.value.value,
      evening_notifications_time: this.form.get('evening_notifications_time')
        ?.value.value,
    };

    this.loading = true;
    this.userService.store(data).subscribe({
      next: (res: User) => {
        this.toastService.showSuccess(
          `User '${res.name}' has been added successfully.`
        );
        this.router.navigateByUrl(this.routes.administration.users.index);
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
      email: this.form.get('email')?.value,
      role: this.form.get('role')?.value,
      status: this.form.get('status')?.value,
      receive_whatsapp_notifications:
        this.form.get('receive_whatsapp_notifications')?.value == 'Yes',
      morning_notifications_time: this.form.get('morning_notifications_time')
        ?.value.value,
      evening_notifications_time: this.form.get('evening_notifications_time')
        ?.value.value,
    };

    this.loading = true;
    this.userService.update(data, this.uuid!).subscribe({
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
