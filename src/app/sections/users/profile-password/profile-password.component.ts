import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UserService } from 'src/app/core/services/user.service';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/core/models/user';
import { AlertService } from 'src/app/core/services/alert.service';
import { Router } from '@angular/router';
import { appRoutes } from '../../../core/routes-list';
import { ToastService } from 'src/app/core/services/toast-service.service';

@Component({
  selector: 'app-profile-password',
  templateUrl: './profile-password.component.html',
  styleUrls: ['./profile-password.component.scss'],
})
export class ProfilePasswordComponent {
  public form!: FormGroup;
  public user!: User;
  uuid?: string;

  public routes = appRoutes;

  public sub: any;

  public showValidationErrors = false;
  public loading = false;

  constructor(
    private router: Router,
    public fb: FormBuilder,
    private userService: UserService,
    private _location: Location,
    private toastService: ToastService,
    private alertService: AlertService
  ) {
    this.uuid = JSON.parse(localStorage.getItem('user')!).uuid;
    this.fetchUser();
    this.initializeCreateForm();
  }

  ngOnInit(): void {}

  private initializeCreateForm() {
    this.form = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      passwordConfirmation: [
        '',
        [Validators.required, Validators.minLength(8)],
      ],
    });
  }

  fetchUser() {
    this.userService.show(this.uuid!).subscribe({
      next: (res: any) => {
        this.user = res;
      },
      error: (err: any) => {
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
    this.userService.updatePassword(data).subscribe({
      next: (res: any) => {
        this.toastService.showSuccess(
          `Your password has been added successfully.`
        );
        this.router.navigateByUrl(this.routes.administration.users.profile);
      },
      error: (err: any) => {
        this.loading = false;
        this.alertService.showNotificationForHttpError(err);
      },
    });
  }
}
