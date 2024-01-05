import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Currency } from '../models/currency';
import { Setting } from '../models/setting';
import { UserPermissionType } from '../models/user-permission-type';
import { CountryCode } from '../models/country-code';
import { School } from '../models/school';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SettingService {
  apiUrl = environment.apiURL;

  constructor(private http: HttpClient) {}

  show() {
    const options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        CurrentSchoolUuid: JSON.parse(localStorage.getItem('school')!).uuid,
      }),
    };

    return this.http.get<Setting>(this.apiUrl + `/settings`, options);
  }

  getCurrencies() {
    const options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
      }),
    };

    return this.http.get<Array<Currency>>(this.apiUrl + '/currencies', options);
  }

  resendVerificationEmail() {
    const options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        CurrentSchoolUuid: JSON.parse(localStorage.getItem('school')!).uuid,
      }),
    };

    return this.http.get<boolean>(
      this.apiUrl + '/resend-verification-email',
      options
    );
  }

  sayHiToRose() {
    const options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        CurrentSchoolUuid: JSON.parse(localStorage.getItem('school')!).uuid,
      }),
    };

    return this.http.get<School>(this.apiUrl + '/say-hi', options);
  }

  getBusinessCategories() {
    const options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
      }),
    };

    return this.http.get<Array<Currency>>(
      this.apiUrl + '/business-categories',
      options
    );
  }

  getCountryCodes() {
    const options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
      }),
    };

    return this.http.get<Array<CountryCode>>(
      this.apiUrl + '/country-codes',
      options
    );
  }

  getWhatsappMediaTypes() {
    const options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        CurrentSchoolUuid: JSON.parse(localStorage.getItem('school')!).uuid,
      }),
    };

    return this.http.get<Array<string>>(
      this.apiUrl + '/whatsapp-media-types',
      options
    );
  }

  getUserPermissionTypes() {
    const options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        CurrentSchoolUuid: JSON.parse(localStorage.getItem('school')!).uuid,
      }),
    };

    return this.http.get<Array<UserPermissionType>>(
      this.apiUrl + '/user-permission-types',
      options
    );
  }

  getUserRoles() {
    const options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        CurrentSchoolUuid: JSON.parse(localStorage.getItem('school')!).uuid,
      }),
    };

    return this.http.get<Array<string>>(this.apiUrl + '/user-roles', options);
  }

  getPaymentStatuses() {
    const options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        CurrentSchoolUuid: JSON.parse(localStorage.getItem('school')!).uuid,
      }),
    };

    return this.http.get<Array<string>>(
      this.apiUrl + '/payment-statuses',
      options
    );
  }

  getPaymentCategories() {
    const options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        CurrentSchoolUuid: JSON.parse(localStorage.getItem('school')!).uuid,
      }),
    };

    return this.http.get<Array<string>>(
      this.apiUrl + '/payment-categories',
      options
    );
  }


  getPurchaseOrderStatuses() {
    const options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        CurrentSchoolUuid: JSON.parse(localStorage.getItem('school')!).uuid,
      }),
    };

    return this.http.get<Array<string>>(
      this.apiUrl + '/purchase-order-statuses',
      options
    );
  }

  getReceiptCategories() {
    const options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        CurrentSchoolUuid: JSON.parse(localStorage.getItem('school')!).uuid,
      }),
    };

    return this.http.get<Array<string>>(
      this.apiUrl + '/receipt-categories',
      options
    );
  }

  getUserGenders() {
    const options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        CurrentSchoolUuid: JSON.parse(localStorage.getItem('school')!).uuid,
      }),
    };

    return this.http.get<Array<string>>(this.apiUrl + '/user-genders', options);
  }

  getUserStatuses() {
    const options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        CurrentSchoolUuid: JSON.parse(localStorage.getItem('school')!).uuid,
      }),
    };

    return this.http.get<Array<string>>(
      this.apiUrl + '/user-statuses',
      options
    );
  }

  getAdjustmentTypes() {
    const options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        CurrentSchoolUuid: JSON.parse(localStorage.getItem('school')!).uuid,
      }),
    };

    return this.http.get<Array<string>>(
      this.apiUrl + '/adjustment-types',
      options
    );
  }

  getTimeIntervals() {
    const options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        CurrentSchoolUuid: JSON.parse(localStorage.getItem('school')!).uuid,
      }),
    };

    return this.http.get<Array<string>>(
      this.apiUrl + '/time-intervals',
      options
    );
  }

  getSupplierTypes() {
    const options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        CurrentSchoolUuid: JSON.parse(localStorage.getItem('school')!).uuid,
      }),
    };

    return this.http.get<Array<string>>(
      this.apiUrl + '/supplier-types',
      options
    );
  }

  getBankAccountStatuses() {
    const options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        CurrentSchoolUuid: JSON.parse(localStorage.getItem('school')!).uuid,
      }),
    };

    return this.http.get<Array<string>>(
      this.apiUrl + '/bank-account-statuses',
      options
    );
  }

  uploadLogo(file: File): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        CurrentSchoolUuid: JSON.parse(localStorage.getItem('school')!).uuid,
      }),
      reportProgress: true,
      observe: 'events' as 'body',
    };

    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post(
      this.apiUrl + `/schools/upload-logo`,
      formData,
      options
    );
  }

  deleteLogo() {
    const options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        CurrentSchoolUuid: JSON.parse(localStorage.getItem('school')!).uuid,
      }),
    };

    return this.http.delete<any>(
      this.apiUrl + `/schools/delete-logo`,
      options
    );
  }

  update(setting: any) {
    const options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        CurrentSchoolUuid: JSON.parse(localStorage.getItem('school')!).uuid,
      }),
    };
    return this.http.put<Setting>(this.apiUrl + `/settings`, setting, options);
  }


  updateDocumentColor(setting: any) {
    const options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        CurrentSchoolUuid: JSON.parse(localStorage.getItem('school')!).uuid,
      }),
    };
    return this.http.put<any>(this.apiUrl + `/settings/document-color`, setting, options);
  }

  getCurrentSchoolUuid(): string {
    return new School(JSON.parse(localStorage.getItem('school')!)).uuid;
  }

  getCurrentSchoolCurrency(): string {
    return new Setting(JSON.parse(localStorage.getItem('setting')!)).currency;
  }

  getCurrentSchool() {
    const options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        CurrentSchoolUuid: JSON.parse(localStorage.getItem('school')!).uuid,
      }),
    };

    return this.http.get<School>(
      this.apiUrl + `/schools/${this.getCurrentSchoolUuid()}`,
      options
    );
  }

  getPurchaseOrderDueDateDaysFromLocal() {
    return (
      new Setting(JSON.parse(localStorage.getItem('setting')!))
        .purchase_order_due_date ?? 1
    );
  }
}
