import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContactPerson } from 'src/app/core/models/contact-person';
import { ContactPersonService } from 'src/app/core/services/contact-person.service';
import { Location } from '@angular/common';
import { AlertService } from 'src/app/core/services/alert.service';
import { ConfirmDialogService } from 'src/app/core/services/confirm-dialog.service';
import { appRoutes } from 'src/app/core/routes-list';
import { ToastService } from 'src/app/core/services/toast-service.service';

@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.scss'],
})
export class ShowComponent implements OnInit {
  uuid!: string;
  contactPerson!: ContactPerson;
  public sub: any;
  public loading = false;

  public routes = appRoutes;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private contactPersonService: ContactPersonService,
    private _location: Location,
    private alertService: AlertService,
    private toastService: ToastService,
    private confirmDialogService: ConfirmDialogService
  ) {}

  ngOnInit(): void {
    this.sub = this.route.params.subscribe((params) => {
      this.uuid = params['uuid'];
      this.fetchContactPerson();
    });
  }

  fetchContactPerson() {
    this.contactPersonService.show(this.uuid).subscribe({
      next: (res: any) => {
        this.contactPerson = new ContactPerson(res);
      },
      error: (err: any) => {},
    });
  }

  backClicked() {
    this._location.back();
  }

  confirmDelete() {
    this.confirmDialogService.showConfirmDialog({
      title: 'Confirm Delete',
      message: `Are you sure you want to delete Contact Person ${this.contactPerson.contact_name}`,
      actionText: 'Delete',
      actionBtnClass: 'btn-danger',
      action: () => {
        this.loading = true;
        this.contactPersonService.delete(this.contactPerson.uuid).subscribe({
          next: (res: ContactPerson) => {
            this.loading = false;
            this.toastService.showSuccess(
              `Contact Person ${this.contactPerson.contact_name} has been deleted successfully.`
            );
            this.router.navigateByUrl(this.routes.people.contact_persons.index);
          },
          error: (err: any) => {
            this.loading = false;
            this.alertService.showNotificationForHttpError(err);
          },
        });
      },
    });
  }
}
