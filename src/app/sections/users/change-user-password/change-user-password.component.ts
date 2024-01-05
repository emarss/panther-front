import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UserService } from 'src/app/core/services/user.service';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/core/models/user';
import { AlertService } from 'src/app/core/services/alert.service';
import { ActivatedRoute, Router } from '@angular/router';
import { appRoutes } from '../../../core/routes-list';
import { ToastService } from 'src/app/core/services/toast-service.service';

@Component({
  selector: 'app-change-user-password',
  templateUrl: './change-user-password.component.html',
  styleUrls: ['./change-user-password.component.scss'],
})
export class ChangeUserPasswordComponent {
  public form!: FormGroup;
  public userToEdit?: User;
  uuid?: string;

  public routes = appRoutes;

  public showValidationErrors = false;
  public loading = true;

  constructor(
    private route: ActivatedRoute,
    public fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private _location: Location,
    private toastService: ToastService,
    private alertService: AlertService
  ) {
    this.initializeCreateForm();
    this.route.params.subscribe((params) => {
      this.uuid = params['uuid'];
      if (this.uuid) {
        this.fetchUser();
        this.loading = false;
      }
    });
  }

  ngOnInit(): void {}

  private initializeCreateForm() {
    this.form = this.fb.group({
      password: [
        '',
        [
          Validators.required,
          Validators.maxLength(199),
          Validators.minLength(6),
        ],
      ],
      passwordConfirmation: ['', [Validators.required]],
    });
  }

  fetchUser() {
    this.userService.show(this.uuid!).subscribe({
      next: (res: any) => {
        this.userToEdit = res;
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

    const data = {
      password: this.form.get('password')?.value,
    };

    this.loading = true;
    this.userService.updateUserPassword(data, this.uuid!).subscribe({
      next: (res: any) => {
        this.toastService.showSuccess(
          `${this.userToEdit?.name}'s password has been updated successfully.`
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
