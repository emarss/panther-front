import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/core/services/account.service';
import { Location } from '@angular/common';
import { AlertService } from 'src/app/core/services/alert.service';
import { ConfirmDialogService } from 'src/app/core/services/confirm-dialog.service';
import { appRoutes } from 'src/app/core/routes-list';
import { Account } from 'src/app/core/models/account';

@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.scss'],
})
export class ShowComponent implements OnInit {
  uuid!: string;
  account!: Account;
  public sub: any;
  public loading = false;

  public routes = appRoutes;

  constructor(
    private router: Router,
    private accountService: AccountService,
    private _location: Location,
    private alertService: AlertService,
    private confirmDialogService: ConfirmDialogService
  ) {}

  ngOnInit(): void {
    this.uuid = this.router.url.split('/').slice(-1)[0];
    this.fetchAccount();
  }

  fetchAccount() {
    this.accountService.show(this.uuid).subscribe({
      next: (res: any) => {
        this.account = new Account(res);
      },
      error: (err: any) => {},
    });
  }

  onOutletLoaded(component: any) {
    component.account = this.account;
  }

  backClicked() {
    this._location.back();
  }
}
