import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/core/services/user.service';
import { Location } from '@angular/common';
import { AlertService } from 'src/app/core/services/alert.service';
import { ConfirmDialogService } from 'src/app/core/services/confirm-dialog.service';
import { appRoutes } from 'src/app/core/routes-list';
import { User } from 'src/app/core/models/user';

@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.scss'],
})
export class ShowComponent implements OnInit {
  uuid!: string;
  user!: User;
  public sub: any;
  public loading = false;

  public routes = appRoutes;

  constructor(
    private router: Router,
    private userService: UserService,
    private _location: Location,
    private alertService: AlertService,
    private confirmDialogService: ConfirmDialogService
  ) {}

  ngOnInit(): void {
    this.uuid = this.router.url.split('/').slice(-1)[0];
    this.fetchUser();
  }

  fetchUser() {
    this.userService.show(this.uuid).subscribe({
      next: (res: any) => {
        this.user = new User(res);
      },
      error: (err: any) => {},
    });
  }

  onOutletLoaded(component: any) {
    component.user = this.user;
  }

  backClicked() {
    this._location.back();
  }
}
