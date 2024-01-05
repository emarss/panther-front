import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { PaginatedResults } from '../models/paginated_results_model';
import { PaginationOptions } from '../models/pagination_options';
import { PurchaseOrder } from '../models/purchase-order';

@Injectable({
  providedIn: 'root',
})
export class PurchaseOrderService {
  apiUrl = environment.apiURL;
  baseUrl = environment.baseURL;

  constructor(private http: HttpClient) { }

  get(paginationOptions: PaginationOptions) {
    const options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        CurrentCompanyUuid: JSON.parse(localStorage.getItem('company')!).uuid,
      }),
    };

    return this.http.get<PaginatedResults>(
      this.apiUrl +
      `/purchase-orders?${PaginationOptions.getPaginationQueryParameters(paginationOptions)}`,
      options
    );
  }

  forDate(date: string, period: string, paginationOptions: PaginationOptions, search?: string) {
    const options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        CurrentCompanyUuid: JSON.parse(localStorage.getItem('company')!).uuid,
      }),
    };

    if (search) {
      return this.http.get<PaginatedResults>(
        this.apiUrl +
        `/purchase-orders/index/for-date/search/${date}/${search}?${PaginationOptions.getPaginationQueryParameters(paginationOptions)}&period=${period}`,
        options
      );
    }
    return this.http.get<PaginatedResults>(
      this.apiUrl +
      `/purchase-orders/index/for-date/${date}?${PaginationOptions.getPaginationQueryParameters(paginationOptions)}&period=${period}`,
      options
    );
  }


  forDueDate(date: string, period: string, paginationOptions: PaginationOptions, search?: string) {
    const options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        CurrentCompanyUuid: JSON.parse(localStorage.getItem('company')!).uuid,
      }),
    };

    if (search) {
      return this.http.get<PaginatedResults>(
        this.apiUrl +
        `/purchase-orders/index/for-due-date/search/${date}/${search}?${PaginationOptions.getPaginationQueryParameters(paginationOptions)}&period=${period}`,
        options
      );
    }
    return this.http.get<PaginatedResults>(
      this.apiUrl +
      `/purchase-orders/index/for-due-date/${date}?${PaginationOptions.getPaginationQueryParameters(paginationOptions)}&period=${period}`,
      options
    );
  }

  all() {
    const options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        CurrentCompanyUuid: JSON.parse(localStorage.getItem('company')!).uuid,
      }),
    };

    return this.http.get<Array<PurchaseOrder>>(
      this.apiUrl +
      `/purchase-orders/index/all`,
      options
    );
  }


  overdue(paginationOptions: PaginationOptions) {
    const options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        CurrentCompanyUuid: JSON.parse(localStorage.getItem('company')!).uuid,
      }),
    };

    return this.http.get<PaginatedResults>(
      this.apiUrl +
      `/purchase-orders/index/overdue?${PaginationOptions.getPaginationQueryParameters(paginationOptions)}`,
      options
    );
  }

  dueToday(paginationOptions: PaginationOptions) {
    const options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        CurrentCompanyUuid: JSON.parse(localStorage.getItem('company')!).uuid,
      }),
    };

    return this.http.get<PaginatedResults>(
      this.apiUrl +
      `/purchase-orders/index/due-today?${PaginationOptions.getPaginationQueryParameters(paginationOptions)}`,
      options
    );
  }




  search(key: string, paginationOptions: PaginationOptions) {
    const options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        CurrentCompanyUuid: JSON.parse(localStorage.getItem('company')!).uuid,
      }),
    };

    return this.http.get<PaginatedResults>(
      this.apiUrl +
      `/purchase-orders/search/${key}?${PaginationOptions.getPaginationQueryParameters(
        paginationOptions
      )}`,
      options
    );
  }


  getPurchasePayments(uuid: string, paginationOptions: PaginationOptions) {
    const options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        CurrentCompanyUuid: JSON.parse(localStorage.getItem('company')!).uuid,
      }),
    };

    return this.http.get<PaginatedResults>(
      this.apiUrl +
      `/purchase-orders/payments/${uuid}?${PaginationOptions.getPaginationQueryParameters(paginationOptions)}`,
      options
    );
  }


  searchPurchasePayments(key: string, search: string, paginationOptions: PaginationOptions) {
    const options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        CurrentCompanyUuid: JSON.parse(localStorage.getItem('company')!).uuid,
      }),
    };

    return this.http.get<PaginatedResults>(
      this.apiUrl +
      `/purchase-orders/payments/search/${key}/${search}?${PaginationOptions.getPaginationQueryParameters(
        paginationOptions
      )}`,
      options
    );
  }

  getPurchaseReceipts(uuid: string, paginationOptions: PaginationOptions) {
    const options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        CurrentCompanyUuid: JSON.parse(localStorage.getItem('company')!).uuid,
      }),
    };

    return this.http.get<PaginatedResults>(
      this.apiUrl +
      `/purchase-orders/receipts/${uuid}?${PaginationOptions.getPaginationQueryParameters(paginationOptions)}`,
      options
    );
  }


  searchPurchaseReceipts(key: string, search: string, paginationOptions: PaginationOptions) {
    const options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        CurrentCompanyUuid: JSON.parse(localStorage.getItem('company')!).uuid,
      }),
    };

    return this.http.get<PaginatedResults>(
      this.apiUrl +
      `/purchase-orders/receipts/search/${key}/${search}?${PaginationOptions.getPaginationQueryParameters(
        paginationOptions
      )}`,
      options
    );
  }


  delete(uuid: string) {
    const options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        CurrentCompanyUuid: JSON.parse(localStorage.getItem('company')!).uuid,
      }),
    };

    return this.http.delete<PurchaseOrder>(this.apiUrl + `/purchase-orders/${uuid}`, options);
  }

  show(uuid: string) {
    const options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        CurrentCompanyUuid: JSON.parse(localStorage.getItem('company')!).uuid,
      }),
    };

    return this.http.get<PurchaseOrder>(this.apiUrl + `/purchase-orders/${uuid}`, options);
  }

  store(purchase: any) {
    const options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        CurrentCompanyUuid: JSON.parse(localStorage.getItem('company')!).uuid,
      }),
    };

    return this.http.post<PurchaseOrder>(this.apiUrl + `/purchase-orders`, purchase, options);
  }

  update(purchase: any, uuid: string) {
    const options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        CurrentCompanyUuid: JSON.parse(localStorage.getItem('company')!).uuid,
      }),
    };

    return this.http.put<PurchaseOrder>(this.apiUrl + `/purchase-orders/${uuid}`, purchase, options);
  }



  export(type: string, search: string, paginationOptions: PaginationOptions) {
    const options = {
      responseType: "blob" as 'blob',
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        CurrentCompanyUuid: JSON.parse(localStorage.getItem('company')!).uuid,
      }),
    };

    if (search.trim().length === 0) {
      search = "null";
    }

    return this.http.get(
      this.baseUrl +
      `exports/purchase-orders/export/${type}/${search}?${PaginationOptions.getPaginationQueryParameters(
        paginationOptions
      )}`,
      options
    );
  }


  exportDueToday(type: string, search: string, paginationOptions: PaginationOptions) {
    const options = {
      responseType: "blob" as 'blob',
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        CurrentCompanyUuid: JSON.parse(localStorage.getItem('company')!).uuid,
      }),
    };

    if (search.trim().length === 0) {
      search = "null";
    }

    return this.http.get(
      this.baseUrl +
      `exports/purchase-orders/due-today/export/${type}/${search}?${PaginationOptions.getPaginationQueryParameters(
        paginationOptions
      )}`,
      options
    );
  }


  exportOverdue(type: string, search: string, paginationOptions: PaginationOptions) {
    const options = {
      responseType: "blob" as 'blob',
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        CurrentCompanyUuid: JSON.parse(localStorage.getItem('company')!).uuid,
      }),
    };

    if (search.trim().length === 0) {
      search = "null";
    }

    return this.http.get(
      this.baseUrl +
      `exports/purchase-orders/overdue/export/${type}/${search}?${PaginationOptions.getPaginationQueryParameters(
        paginationOptions
      )}`,
      options
    );
  }


  exportForDate(date: string, period: string, type: string, search: string, paginationOptions: PaginationOptions) {
    const options = {
      responseType: "blob" as 'blob',
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        CurrentCompanyUuid: JSON.parse(localStorage.getItem('company')!).uuid,
      }),
    };

    if (search.trim().length === 0) {
      search = "null";
    }

    return this.http.get(
      this.baseUrl +
      `exports/purchase-orders/for-date/${date}/export/${type}/${search}?${PaginationOptions.getPaginationQueryParameters(
        paginationOptions
      )}&period=${period}`,
      options
    );
  }

  exportForDueDate(date: string, period: string, type: string, search: string, paginationOptions: PaginationOptions) {
    const options = {
      responseType: "blob" as 'blob',
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        CurrentCompanyUuid: JSON.parse(localStorage.getItem('company')!).uuid,
      }),
    };

    if (search.trim().length === 0) {
      search = "null";
    }

    return this.http.get(
      this.baseUrl +
      `exports/purchase-orders/for-due-date/${date}/export/${type}/${search}?${PaginationOptions.getPaginationQueryParameters(
        paginationOptions
      )}&period=${period}`,
      options
    );
  }


  exportPurchaseOrderPayments(uuid: string, type: string, search: string, paginationOptions: PaginationOptions) {
    const options = {
      responseType: "blob" as 'blob',
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        CurrentCompanyUuid: JSON.parse(localStorage.getItem('company')!).uuid,
      }),
    };

    if (search.trim().length === 0) {
      search = "null";
    }

    return this.http.get(
      this.baseUrl +
      `exports/purchase-orders/${uuid}/payments/export/${type}/${search}?${PaginationOptions.getPaginationQueryParameters(
        paginationOptions
      )}`,
      options
    );
  }


  exportPurchaseOrderReceipts(uuid: string, type: string, search: string, paginationOptions: PaginationOptions) {
    const options = {
      responseType: "blob" as 'blob',
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        CurrentCompanyUuid: JSON.parse(localStorage.getItem('company')!).uuid,
      }),
    };

    if (search.trim().length === 0) {
      search = "null";
    }

    return this.http.get(
      this.baseUrl +
      `exports/purchase-orders/${uuid}/receipts/export/${type}/${search}?${PaginationOptions.getPaginationQueryParameters(
        paginationOptions
      )}`,
      options
    );
  }
}
