import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UserService } from 'src/app/core/services/user.service';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/core/models/user';
import { AlertService } from 'src/app/core/services/alert.service';
import { appRoutes } from '../../../core/routes-list';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  public user!: User;
  uuid?: string;

  public routes = appRoutes;

  public sub: any;

  public showValidationErrors = false;
  public loading = true;

  constructor(
    public fb: FormBuilder,
    private userService: UserService,
    private _location: Location,
    private alertService: AlertService
  ) {
    this.uuid = JSON.parse(localStorage.getItem('user')!).uuid;
    this.fetchUser();
  }

  ngOnInit(): void {}

  fetchUser() {
    this.userService.show(this.uuid!).subscribe({
      next: (res: any) => {
        this.user = res;
        this.loading = false;
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
}
