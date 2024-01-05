import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Account } from 'src/app/core/models/account';
import { appRoutes } from 'src/app/core/routes-list';
import { AlertService } from 'src/app/core/services/alert.service';
import { AccountService } from 'src/app/core/services/account.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject } from 'rxjs';
import { SettingService } from 'src/app/core/services/setting.service';
import { CustomSelectOption } from 'src/app/core/interfaces/custom-select-option';

import { ToastService } from 'src/app/core/services/toast-service.service';

@Component({
  selector: 'app-add-account-modal',
  templateUrl: './add-account-modal.component.html',
  styleUrls: ['./add-account-modal.component.scss'],
})
export class AddAccountModalComponent {
  public form!: FormGroup;
  public routes = appRoutes;
  private loadingReqestSubject = new BehaviorSubject<number>(0);
  private completedRequests = 0;

  public showValidationErrors = false;
  public loading = true;
  public showAdditionInfo = false;

  currencies: Array<CustomSelectOption> = [];

  constructor(
    public fb: FormBuilder,
    private accountService: AccountService,
    private settingService: SettingService,
    public activeModal: NgbActiveModal,
    private toastService: ToastService,
    private alertService: AlertService
  ) {
    this.initializeCreateForm();

    this.settingService.getCurrencies().subscribe({
      next: (value) => {
        this.currencies = value.map((el) => {
          return {
            value: el.short,
            name: `${el.name} (${el.short})`,
          };
        });
        this.updateNumberOfCompletedRequests();
      },
      error: (err: any) => {
        this.loading = false;
        this.alertService.showNotificationForHttpError(err);
      },
    });

    this.loadingReqestSubject.subscribe({
      next: (val: number) => {
        if (val === 1) {
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
      exchange_rate: ['1.00', [Validators.required, Validators.maxLength(199)]],
      currency: [null, [Validators.required, Validators.maxLength(199)]],
    });
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
      name: this.form.get('name')?.value,
      description: this.form.get('description')?.value,
      exchange_rate: this.form.get('exchange_rate')?.value,
      currency: this.form.get('currency')?.value.value,
    };

    this.loading = true;
    this.accountService.store(data).subscribe({
      next: (res: Account) => {
        this.toastService.showSuccess(
          `Account '${res.name}' has been added successfully.`
        );
        localStorage.setItem('created-account', JSON.stringify(res));
        this.activeModal.close(res);
      },
      error: (err: any) => {
        this.loading = false;
        this.alertService.showNotificationForHttpError(err);
      },
    });
  }
}
