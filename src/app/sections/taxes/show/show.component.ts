import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TaxService } from 'src/app/core/services/tax.service';
import { Location } from '@angular/common';
import { AlertService } from 'src/app/core/services/alert.service';
import { ConfirmDialogService } from 'src/app/core/services/confirm-dialog.service';
import { appRoutes } from 'src/app/core/routes-list';
import { Tax } from 'src/app/core/models/tax';

@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.scss'],
})
export class ShowComponent implements OnInit {
  uuid!: string;
  tax!: Tax;
  public sub: any;
  public loading = false;

  public routes = appRoutes;

  constructor(
    private router: Router,
    private taxService: TaxService,
    private _location: Location,
    private alertService: AlertService,
    private confirmDialogService: ConfirmDialogService
  ) {}

  ngOnInit(): void {
    this.uuid = this.router.url.split('/').slice(-1)[0];
    this.fetchTax();
  }

  fetchTax() {
    this.taxService.show(this.uuid).subscribe({
      next: (res: any) => {
        this.tax = new Tax(res);
      },
      error: (err: any) => {},
    });
  }

  onOutletLoaded(component: any) {
    component.tax = this.tax;
  }

  backClicked() {
    this._location.back();
  }
}
