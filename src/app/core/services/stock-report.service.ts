import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { PaginatedResults } from '../models/paginated_results_model';
import { PaginationOptions } from '../models/pagination_options';
import { ReportOptions } from '../models/report-options';

@Injectable({
  providedIn: 'root'
})
export class StockReportService {
  apiUrl = environment.apiURL;
  baseUrl = environment.baseURL;

  constructor(private http: HttpClient) { }

  fullStock(reportOptions: ReportOptions, paginationOptions: PaginationOptions, searchKey?: string) {
    const options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        CurrentCompanyUuid: JSON.parse(localStorage.getItem('company')!).uuid,
      }),
    };
    if (searchKey) {
      return this.http.get<PaginatedResults>(
        this.apiUrl +
        `/reports/stock/full-stock/search/${searchKey}?${ReportOptions.getReportQueryParameters(reportOptions)}&${PaginationOptions.getPaginationQueryParameters(paginationOptions)}`,
        options
      );
    }
    return this.http.get<PaginatedResults>(
      this.apiUrl +
      `/reports/stock/full-stock?${ReportOptions.getReportQueryParameters(reportOptions)}&${PaginationOptions.getPaginationQueryParameters(paginationOptions)}`,
      options
    );
  }


  stockByItemGroup(itemGroupUuid: string, reportOptions: ReportOptions, paginationOptions: PaginationOptions, searchKey?: string) {
    const options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        CurrentCompanyUuid: JSON.parse(localStorage.getItem('company')!).uuid,
      }),
    };
    if (searchKey) {
      return this.http.get<PaginatedResults>(
        this.apiUrl +
        `/reports/stock/stock-by-item-group/${itemGroupUuid}/search/${searchKey}?${ReportOptions.getReportQueryParameters(reportOptions)}&${PaginationOptions.getPaginationQueryParameters(paginationOptions)}`,
        options
      );
    }
    return this.http.get<PaginatedResults>(
      this.apiUrl +
      `/reports/stock/stock-by-item-group/${itemGroupUuid}?${ReportOptions.getReportQueryParameters(reportOptions)}&${PaginationOptions.getPaginationQueryParameters(paginationOptions)}`,
      options
    );
  }



  lowStock() {
    const options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        CurrentCompanyUuid: JSON.parse(localStorage.getItem('company')!).uuid,
      }),
    };

    return this.http.get<Array<any>>(
      this.apiUrl +
      `/reports/stock/low-stock`,
      options
    );
  }

  outOfStock() {
    const options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        CurrentCompanyUuid: JSON.parse(localStorage.getItem('company')!).uuid,
      }),
    };

    return this.http.get<Array<any>>(
      this.apiUrl +
      `/reports/stock/out-of-stock`,
      options
    );
  }

  inStock() {
    const options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        CurrentCompanyUuid: JSON.parse(localStorage.getItem('company')!).uuid,
      }),
    };

    return this.http.get<Array<any>>(
      this.apiUrl +
      `/reports/stock/in-stock`,
      options
    );
  }

  exportStockByItemGroup(itemGroupUuid: string, type: string, reportOptions: ReportOptions, paginationOptions: PaginationOptions, searchKey?: string) {
    const options = {
      responseType: "blob" as 'blob',
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        CurrentCompanyUuid: JSON.parse(localStorage.getItem('company')!).uuid,
      }),
    };

    if (searchKey?.trim().length === 0) {
      searchKey = "null";
    }

    return this.http.get(
      this.baseUrl +
      `exports/reports/stock/stock-by-item-group/${itemGroupUuid}/export/${type}/${searchKey}?${ReportOptions.getReportQueryParameters(reportOptions)}&${PaginationOptions.getPaginationQueryParameters(paginationOptions)}`,
      options
    );
  }



  exportFullStock(type: string, reportOptions: ReportOptions, paginationOptions: PaginationOptions, searchKey?: string) {
    const options = {
      responseType: "blob" as 'blob',
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        CurrentCompanyUuid: JSON.parse(localStorage.getItem('company')!).uuid,
      }),
    };

    if (searchKey?.trim().length === 0) {
      searchKey = "null";
    }

    return this.http.get(
      this.baseUrl +
      `exports/reports/stock/full-stock/export/${type}/${searchKey}?${ReportOptions.getReportQueryParameters(reportOptions)}&${PaginationOptions.getPaginationQueryParameters(paginationOptions)}`,
      options
    );
  }

  exportInStock(type: string) {
    const options = {
      responseType: "blob" as 'blob',
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        CurrentCompanyUuid: JSON.parse(localStorage.getItem('company')!).uuid,
      }),
    };


    return this.http.get(
      this.baseUrl +
      `exports/reports/stock/in-stock/export/${type}`,
      options
    );
  }

  exportLowStock(type: string) {
    const options = {
      responseType: "blob" as 'blob',
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        CurrentCompanyUuid: JSON.parse(localStorage.getItem('company')!).uuid,
      }),
    };

    return this.http.get(
      this.baseUrl +
      `exports/reports/stock/low-stock/export/${type}`,
      options
    );
  }


  exportOutOfStock(type: string) {
    const options = {
      responseType: "blob" as 'blob',
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        CurrentCompanyUuid: JSON.parse(localStorage.getItem('company')!).uuid,
      }),
    };


    return this.http.get(
      this.baseUrl +
      `exports/reports/stock/out-of-stock/export/${type}`,
      options
    );
  }

}
