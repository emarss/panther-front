import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { PaginationOptions } from '../models/pagination_options';
import { PaginatedResults } from '../models/paginated_results_model';
import { ReportOptions } from '../models/report-options';

@Injectable({
  providedIn: 'root'
})
export class PaymentsReceiptsReportService {

  apiUrl = environment.apiURL;

  constructor(private http: HttpClient) { }

  paymentsByCategory(category: string, paginationOptions: PaginationOptions, reportOptions: ReportOptions, searchKey?: string) {
    const options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        CurrentSchoolUuid: JSON.parse(localStorage.getItem('school')!).uuid,
      }),
    };

    if (searchKey) {
      return this.http.get<PaginatedResults>(
        this.apiUrl +
        `/reports/payments-receipts/payments-by-category/${category}/search/${searchKey}?${PaginationOptions.getPaginationQueryParameters(paginationOptions)}&${ReportOptions.getReportQueryParameters(reportOptions)}`,
        options
      );
    }

    return this.http.get<PaginatedResults>(
      this.apiUrl +
      `/reports/payments-receipts/payments-by-category/${category}?${PaginationOptions.getPaginationQueryParameters(paginationOptions)}&${ReportOptions.getReportQueryParameters(reportOptions)}`,
      options
    );
  }

  receiptsByCategory(category: string, paginationOptions: PaginationOptions, reportOptions: ReportOptions, searchKey?: string) {
    const options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        CurrentSchoolUuid: JSON.parse(localStorage.getItem('school')!).uuid,
      }),
    };

    if (searchKey) {
      return this.http.get<PaginatedResults>(
        this.apiUrl +
        `/reports/payments-receipts/receipts-by-category/${category}/search/${searchKey}?${PaginationOptions.getPaginationQueryParameters(paginationOptions)}&${ReportOptions.getReportQueryParameters(reportOptions)}`,
        options
      );
    }

    return this.http.get<PaginatedResults>(
      this.apiUrl +
      `/reports/payments-receipts/receipts-by-category/${category}?${PaginationOptions.getPaginationQueryParameters(paginationOptions)}&${ReportOptions.getReportQueryParameters(reportOptions)}`,
      options
    );
  }


  exportPaymentsByCategory(type: string, category: string, paginationOptions: PaginationOptions, reportOptions: ReportOptions, searchKey?: string) {
    const options = {
      responseType: "blob" as 'blob',
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        CurrentSchoolUuid: JSON.parse(localStorage.getItem('school')!).uuid,
      }),
    };

    return this.http.get(
      this.apiUrl +
      `/reports/sales/for-date/export/${type}?${PaginationOptions.getPaginationQueryParameters(paginationOptions)}`,
      options
    );
  }


  exportReceiptsByCategory(type: string, category: string, paginationOptions: PaginationOptions, reportOptions: ReportOptions, searchKey?: string) {
    const options = {
      responseType: "blob" as 'blob',
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        CurrentSchoolUuid: JSON.parse(localStorage.getItem('school')!).uuid,
      }),
    };

    return this.http.get(
      this.apiUrl +
      `/reports/sales/for-date/export/${type}?${PaginationOptions.getPaginationQueryParameters(paginationOptions)}`,
      options
    );
  }

}
