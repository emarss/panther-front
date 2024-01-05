import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { PaginationOptions } from '../models/pagination_options';
import { PaginatedResults } from '../models/paginated_results_model';
import { ReportOptions } from '../models/report-options';

@Injectable({
  providedIn: 'root'
})
export class PurchaseOrderReportService {
  apiUrl = environment.apiURL;
  baseUrl = environment.baseURL;

  constructor(private http: HttpClient) { }

  purchaseOrdersByDueDate(reportOptions: ReportOptions, isDistributive: boolean) {
    const options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        CurrentCompanyUuid: JSON.parse(localStorage.getItem('company')!).uuid,
      }),
    };

    return this.http.get<any>(
      this.apiUrl +
      `/reports/purchase-orders/purchase-orders-by-due-date?${ReportOptions.getReportQueryParameters(reportOptions)}&isDistributive=${isDistributive}`,
      options
    );
  }



  purchaseOrdersByDate(reportOptions: ReportOptions, isDistributive: boolean) {
    const options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        CurrentCompanyUuid: JSON.parse(localStorage.getItem('company')!).uuid,
      }),
    };

    return this.http.get<any>(
      this.apiUrl +
      `/reports/purchase-orders/purchase-orders-by-date?${ReportOptions.getReportQueryParameters(reportOptions)}&isDistributive=${isDistributive}`,
      options
    );
  }


  purchaseOrdersByStatus(status: string, paginationOptions: PaginationOptions, reportOptions: ReportOptions, searchKey?: string) {
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
        `/reports/purchase-orders/purchase-orders-by-status/${status}/search/${searchKey}?${PaginationOptions.getPaginationQueryParameters(paginationOptions)}&${ReportOptions.getReportQueryParameters(reportOptions)}`,
        options
      );
    }

    return this.http.get<PaginatedResults>(
      this.apiUrl +
      `/reports/purchase-orders/purchase-orders-by-status/${status}?${PaginationOptions.getPaginationQueryParameters(paginationOptions)}&${ReportOptions.getReportQueryParameters(reportOptions)}`,
      options
    );
  }


  purchaseOrdersBySalesperson(salespersonUuid: string, paginationOptions: PaginationOptions, reportOptions: ReportOptions, searchKey?: string) {
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
        `/reports/purchase-orders/purchase-orders-by-salesperson/${salespersonUuid}/search/${searchKey}?${PaginationOptions.getPaginationQueryParameters(paginationOptions)}&${ReportOptions.getReportQueryParameters(reportOptions)}`,
        options
      );
    }

    return this.http.get<PaginatedResults>(
      this.apiUrl +
      `/reports/purchase-orders/purchase-orders-by-salesperson/${salespersonUuid}?${PaginationOptions.getPaginationQueryParameters(paginationOptions)}&${ReportOptions.getReportQueryParameters(reportOptions)}`,
      options
    );
  }



  purchaseOrdersBySupplier(supplierUuid: string, paginationOptions: PaginationOptions, reportOptions: ReportOptions, searchKey?: string) {
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
        `/reports/purchase-orders/purchase-orders-by-supplier/${supplierUuid}/search/${searchKey}?${PaginationOptions.getPaginationQueryParameters(paginationOptions)}&${ReportOptions.getReportQueryParameters(reportOptions)}`,
        options
      );
    }

    return this.http.get<PaginatedResults>(
      this.apiUrl +
      `/reports/purchase-orders/purchase-orders-by-supplier/${supplierUuid}?${PaginationOptions.getPaginationQueryParameters(paginationOptions)}&${ReportOptions.getReportQueryParameters(reportOptions)}`,
      options
    );
  }

  purchaseOrdersByItemGroup(itemGroupUuid: string, paginationOptions: PaginationOptions, reportOptions: ReportOptions, searchKey?: string) {
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
        `/reports/purchase-orders/purchase-orders-by-item-group/${itemGroupUuid}/search/${searchKey}?${PaginationOptions.getPaginationQueryParameters(paginationOptions)}&${ReportOptions.getReportQueryParameters(reportOptions)}`,
        options
      );
    }

    return this.http.get<PaginatedResults>(
      this.apiUrl +
      `/reports/purchase-orders/purchase-orders-by-item-group/${itemGroupUuid}?${PaginationOptions.getPaginationQueryParameters(paginationOptions)}&${ReportOptions.getReportQueryParameters(reportOptions)}`,
      options
    );
  }




  purchaseOrdersByItem(itemUuid: string, paginationOptions: PaginationOptions, reportOptions: ReportOptions, searchKey?: string) {
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
        `/reports/purchase-orders/purchase-orders-by-item/${itemUuid}/search/${searchKey}?${PaginationOptions.getPaginationQueryParameters(paginationOptions)}&${ReportOptions.getReportQueryParameters(reportOptions)}`,
        options
      );
    }

    return this.http.get<PaginatedResults>(
      this.apiUrl +
      `/reports/purchase-orders/purchase-orders-by-item/${itemUuid}?${PaginationOptions.getPaginationQueryParameters(paginationOptions)}&${ReportOptions.getReportQueryParameters(reportOptions)}`,
      options
    );
  }


  exportPurchaseOrdersByDueDate(type: string, reportOptions: ReportOptions, isDistributive: boolean) {
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
      `exports/reports/purchase-orders/purchase-orders-by-due-date/export/${type}?${ReportOptions.getReportQueryParameters(reportOptions)}&isDistributive=${isDistributive}`,
      options
    );
  }



  exportPurchaseOrdersByDate(type: string, reportOptions: ReportOptions, isDistributive: boolean) {
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
      `exports/reports/purchase-orders/purchase-orders-by-date/export/${type}?${ReportOptions.getReportQueryParameters(reportOptions)}&isDistributive=${isDistributive}`,
      options
    );
  }


  exportPurchaseOrdersByStatus(type: string, status: string, paginationOptions: PaginationOptions, reportOptions: ReportOptions, searchKey?: string) {
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
      `exports/reports/purchase-orders/purchase-orders-by-status/${status}/export/${type}/${searchKey}?${PaginationOptions.getPaginationQueryParameters(paginationOptions)}&${ReportOptions.getReportQueryParameters(reportOptions)}`,
      options
    );
  }

  exportPurchaseOrdersBySalesperson(type: string, salespersonUuid: string, paginationOptions: PaginationOptions, reportOptions: ReportOptions, searchKey?: string) {
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
      `exports/reports/purchase-orders/purchase-orders-by-salesperson/${salespersonUuid}/export/${type}/${searchKey}?${PaginationOptions.getPaginationQueryParameters(paginationOptions)}&${ReportOptions.getReportQueryParameters(reportOptions)}`,
      options
    );
  }



  exportPurchaseOrdersBySupplier(type: string, supplierUuid: string, paginationOptions: PaginationOptions, reportOptions: ReportOptions, searchKey?: string) {
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
      `exports/reports/purchase-orders/purchase-orders-by-supplier/${supplierUuid}/export/${type}/${searchKey}?${PaginationOptions.getPaginationQueryParameters(paginationOptions)}&${ReportOptions.getReportQueryParameters(reportOptions)}`,
      options
    );
  }

  exportPurchaseOrdersByItemGroup(type: string, itemGroupUuid: string, paginationOptions: PaginationOptions, reportOptions: ReportOptions, searchKey?: string) {
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
      `exports/reports/purchase-orders/purchase-orders-by-item-group/${itemGroupUuid}/export/${type}/${searchKey}?${PaginationOptions.getPaginationQueryParameters(paginationOptions)}&${ReportOptions.getReportQueryParameters(reportOptions)}`,
      options
    );
  }


  exportPurchaseOrdersByItem(type: string, itemUuid: string, paginationOptions: PaginationOptions, reportOptions: ReportOptions, searchKey?: string) {
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
      `exports/reports/purchase-orders/purchase-orders-by-item/${itemUuid}/export/${type}/${searchKey}?${PaginationOptions.getPaginationQueryParameters(paginationOptions)}&${ReportOptions.getReportQueryParameters(reportOptions)}`,
      options
    );
  }
}
