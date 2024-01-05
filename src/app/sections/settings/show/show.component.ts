import { Component, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Setting } from '../../../core/models/setting';
import { AlertService } from '../../../core/services/alert.service';
import { Location } from '@angular/common';
import { SettingService } from '../../../core/services/setting.service';
import { appRoutes } from '../../../core/routes-list';
import { CompanyService } from 'src/app/core/services/company.service';
import { Company } from 'src/app/core/models/company';
import { CustomSelectOption } from 'src/app/core/interfaces/custom-select-option';

import { BehaviorSubject } from 'rxjs';
import { ToastService } from 'src/app/core/services/toast-service.service';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { ConfirmDialogService } from 'src/app/core/services/confirm-dialog.service';
import { NgbSlideEvent } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-settings',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ShowComponent {
  public form!: FormGroup;
  public setting!: Setting;
  public company!: Company;

  public fileToUpload?: File;
  public previewUrl?: string;
  public templateBaseUrl?: string;
  public uploadProgress = 0;

  businessCategories: Array<CustomSelectOption> = [];
  trueOrFalseOptions: Array<CustomSelectOption> = [
    {
      name: 'Yes',
      value: 1,
    },
    {
      name: 'No',
      value: 0,
    },
  ];

  public routes = appRoutes;

  public sub: any;
  private loadingReqestSubject = new BehaviorSubject<number>(0);
  private completedRequests = 0;

  public showValidationErrors = false;
  public loading = true;

  currencies: Array<CustomSelectOption> = [];

  constructor(
    public fb: FormBuilder,
    private settingService: SettingService,
    private companyService: CompanyService,
    private _location: Location,
    private confirmDialogService: ConfirmDialogService,
    private toastService: ToastService,
    private alertService: AlertService
  ) {
    this.initializeCreateForm();
  }

  handleFileInput(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (files) {
      this.fileToUpload = files[0];
      this.previewUrl = URL.createObjectURL(this.fileToUpload);
      this.uploadLogo();
    }
  }

  ngOnInit() {
    //fetching currencies
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

    this.settingService.show().subscribe({
      next: (res: Setting) => {
        this.setting = res;
        this.templateBaseUrl =
          environment.apiURL +
          '/settings/preview-template/' +
          this.setting.company_uuid +
          '/';
        this.updateNumberOfCompletedRequests();
      },
      error: (err: any) => {
        this.loading = false;
        this.alertService.showNotificationForHttpError(err);
      },
    });

    this.companyService.show().subscribe({
      next: (res: Company) => {
        this.company = res;
        this.previewUrl = this.company.logo_url;
        this.updateNumberOfCompletedRequests();
      },
      error: (err: any) => {
        this.loading = false;
        this.alertService.showNotificationForHttpError(err);
      },
    });

    this.settingService.getBusinessCategories().subscribe({
      next: (value) => {
        this.businessCategories = value.map((el) => {
          return {
            value: el,
            name: el,
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
        if (val === 4) {
          // requests to be performed
          this.initializeEditForm();
          this.loading = false;
        }
      },
    });
  }

  public uploadLogo() {
    if (this.loading || !this.fileToUpload) {
      return;
    }

    this.loading = true;
    this.settingService
      .uploadLogo(this.fileToUpload!)
      .subscribe((event: HttpEvent<any>) => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            this.uploadProgress = Math.round(
              (event.loaded / event.total!) * 100
            );
            break;
          case HttpEventType.Response:
            this.uploadProgress = 0;
            this.loading = false;
            this.toastService.showSuccess(
              'Company logo has been updated successfully.'
            );
        }
      });
  }

  private updateNumberOfCompletedRequests() {
    this.completedRequests = this.completedRequests + 1;
    this.loadingReqestSubject.next(this.completedRequests);
  }

  private initializeCreateForm() {
    this.form = this.fb.group({
      company_name: ['', [Validators.required]],
      email: ['', [Validators.required]],
      physical_address: ['', []],
      whatsapp_number: ['', [Validators.required]],
      category: ['', [Validators.required]],
      bp_number: ['', []],
      vat_number: ['', []],
      phone_number: ['', [Validators.required]],
      currency: ['', [Validators.required]],
      purchase_order_due_date: ['', [Validators.required]],
      document_purchase_order_terms: ['', []],
      document_purchase_order_footer: ['', []],
      document_show_business_vat_number: ['', [Validators.required]],
      document_show_business_bp_number: ['', [Validators.required]],
      document_show_banking_details: ['', [Validators.required]],
      document_color: ['', [Validators.required]],
      document_template_id: ['', [Validators.required]],
    });
  }

  private initializeEditForm() {
    this.form = this.fb.group({
      currency: [
        this.findCurrencyOption(this.setting!.currency),
        [Validators.required],
      ],
      category: [
        this.mapBusinessCategory(this.company?.category),
        [Validators.required],
      ],
      bp_number: [this.company?.bp_number, []],
      vat_number: [this.company?.vat_number, []],
      company_name: [this.company.company_name, [Validators.required]],
      email: [this.company.email, [Validators.required]],
      physical_address: [this.company.physical_address, []],
      whatsapp_number: [this.company.whatsapp_number, [Validators.required]],
      phone_number: [this.company.phone_number, [Validators.required]],
      purchase_order_due_date: [
        this.setting.purchase_order_due_date,
        [Validators.required],
      ],
      document_purchase_order_terms: [
        this.setting.document_purchase_order_terms,
        [],
      ],
      document_purchase_order_footer: [
        this.setting.document_purchase_order_footer,
        [],
      ],
      document_show_business_vat_number: [
        this.mapTruOrFalseOption(
          this.setting.document_show_business_vat_number
        ),
        [Validators.required],
      ],
      document_show_business_bp_number: [
        this.mapTruOrFalseOption(this.setting.document_show_business_bp_number),
        [Validators.required],
      ],
      document_show_banking_details: [
        this.mapTruOrFalseOption(this.setting.document_show_banking_details),
        [Validators.required],
      ],
      document_color: [this.setting.document_color, [Validators.required]],
      document_template_id: [
        this.setting.document_template_id,
        [Validators.required],
      ],
    });
  }

  findCurrencyOption(currency_short: string): any {
    return this.currencies.find((el) => {
      return el.value === currency_short;
    });
  }

  mapBusinessCategory(category: string): any {
    return this.businessCategories.find((el) => {
      return el.value === category;
    });
  }

  mapTruOrFalseOption(value: number) {
    return this.trueOrFalseOptions.filter((el) => el.value == value)[0];
  }

  backClicked() {
    this._location.back();
  }

  public delete() {
    if (this.loading) {
      return;
    }
    this.confirmDialogService.showConfirmDialog({
      title: 'Confirm Delete',
      message: `Are you sure you want to delete the company logo?`,
      actionText: 'Delete',
      actionBtnClass: 'btn-danger',
      action: () => {
        this.loading = true;
        this.settingService.deleteLogo().subscribe({
          next: (res: any) => {
            this.loading = false;
            this.previewUrl = undefined;
            this.fileToUpload = undefined;
            this.toastService.showSuccess(
              'Company logo has been deleted successfully.'
            );
          },
          error: (err: any) => {
            this.loading = false;
            this.alertService.showNotificationForHttpError(err);
          },
        });
      },
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

    const companyData = {
      currency: this.form.get('currency')?.value.value,
      category: this.form.get('category')?.value.value,
      company_name: this.form.get('company_name')?.value,
      email: this.form.get('email')?.value,
      physical_address: this.form.get('physical_address')?.value,
      whatsapp_number: this.form.get('whatsapp_number')?.value,
      phone_number: this.form.get('phone_number')?.value,
      bp_number: this.form.get('bp_number')?.value,
      vat_number: this.form.get('vat_number')?.value,
      purchase_order_due_date: this.form.get('purchase_order_due_date')?.value,
      document_purchase_order_terms: this.form.get(
        'document_purchase_order_terms'
      )?.value,
      document_purchase_order_footer: this.form.get(
        'document_purchase_order_footer'
      )?.value,
      document_show_business_vat_number: this.form.get(
        'document_show_business_vat_number'
      )?.value.value,
      document_show_business_bp_number: this.form.get(
        'document_show_business_bp_number'
      )?.value.value,
      document_show_banking_details: this.form.get(
        'document_show_banking_details'
      )?.value.value,
      document_color: this.form.get('document_color')?.value,
      document_template_id: this.form.get('document_template_id')?.value,
    };

    this.loading = true;
    this.settingService.update(companyData).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.toastService.showSuccess(
          'Settings has been updated successfully.'
        );
      },
      error: (err: any) => {
        this.loading = false;
        this.alertService.showNotificationForHttpError(err);
      },
    });
  }

  onTemplateChanged(id: NgbSlideEvent) {
    this.form
      .get('document_template_id')
      ?.setValue(id.current.toString().replace('template_', ''));
  }
}
