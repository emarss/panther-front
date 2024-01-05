import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Item } from '../models/item';
import { PaginatedResults } from '../models/paginated_results_model';
import { PaginationOptions } from '../models/pagination_options';
import { ReportOptions } from '../models/report-options';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  apiUrl = environment.apiURL;
  baseUrl = environment.baseURL;

  constructor(private http: HttpClient) {}

  get(paginationOptions: PaginationOptions) {
    const options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        CurrentSchoolUuid: JSON.parse(localStorage.getItem('school')!).uuid,
      }),
    };

    return this.http.get<PaginatedResults>(
      this.apiUrl +
        `/items?${PaginationOptions.getPaginationQueryParameters(
          paginationOptions
        )}`,
      options
    );
  }

  statement(uuid: string, reportOptions: ReportOptions) {
    const options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        CurrentSchoolUuid: JSON.parse(localStorage.getItem('school')!).uuid,
      }),
    };

    return this.http.get<any>(
      this.apiUrl +
        `/items/statement/${uuid}?${ReportOptions.getReportQueryParameters(
          reportOptions
        )}`,
      options
    );
  }

  allForType(type: string) {
    const options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        CurrentSchoolUuid: JSON.parse(localStorage.getItem('school')!).uuid,
      }),
    };

    return this.http.get<Array<Item>>(
      this.apiUrl + `/items/index/all/type/${type}`,
      options
    );
  }

  all() {
    const options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        CurrentSchoolUuid: JSON.parse(localStorage.getItem('school')!).uuid,
      }),
    };

    return this.http.get<Array<Item>>(
      this.apiUrl + `/items/index/all`,
      options
    );
  }

  getItemPurchaseOrderItems(
    uuid: string,
    paginationOptions: PaginationOptions
  ) {
    const options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        CurrentSchoolUuid: JSON.parse(localStorage.getItem('school')!).uuid,
      }),
    };

    return this.http.get<PaginatedResults>(
      this.apiUrl +
        `/items/purchase-order-items/${uuid}?${PaginationOptions.getPaginationQueryParameters(
          paginationOptions
        )}`,
      options
    );
  }

  searchItemPurchaseOrders(
    key: string,
    search: string,
    paginationOptions: PaginationOptions
  ) {
    const options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        CurrentSchoolUuid: JSON.parse(localStorage.getItem('school')!).uuid,
      }),
    };

    return this.http.get<PaginatedResults>(
      this.apiUrl +
        `/items/purchase-order-items/search/${key}/${search}?${PaginationOptions.getPaginationQueryParameters(
          paginationOptions
        )}`,
      options
    );
  }

  getItemStockIssues(uuid: string, paginationOptions: PaginationOptions) {
    const options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        CurrentSchoolUuid: JSON.parse(localStorage.getItem('school')!).uuid,
      }),
    };

    return this.http.get<PaginatedResults>(
      this.apiUrl +
        `/items/stock-issues/${uuid}?${PaginationOptions.getPaginationQueryParameters(
          paginationOptions
        )}`,
      options
    );
  }

  searchItemStockIssues(
    key: string,
    search: string,
    paginationOptions: PaginationOptions
  ) {
    const options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        CurrentSchoolUuid: JSON.parse(localStorage.getItem('school')!).uuid,
      }),
    };

    return this.http.get<PaginatedResults>(
      this.apiUrl +
        `/items/stock-issues/search/${key}/${search}?${PaginationOptions.getPaginationQueryParameters(
          paginationOptions
        )}`,
      options
    );
  }

  getItemStockReturns(uuid: string, paginationOptions: PaginationOptions) {
    const options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        CurrentSchoolUuid: JSON.parse(localStorage.getItem('school')!).uuid,
      }),
    };

    return this.http.get<PaginatedResults>(
      this.apiUrl +
        `/items/stock-returns/${uuid}?${PaginationOptions.getPaginationQueryParameters(
          paginationOptions
        )}`,
      options
    );
  }

  searchItemStockReturns(
    key: string,
    search: string,
    paginationOptions: PaginationOptions
  ) {
    const options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        CurrentSchoolUuid: JSON.parse(localStorage.getItem('school')!).uuid,
      }),
    };

    return this.http.get<PaginatedResults>(
      this.apiUrl +
        `/items/stock-returns/search/${key}/${search}?${PaginationOptions.getPaginationQueryParameters(
          paginationOptions
        )}`,
      options
    );
  }

  getItemTypes() {
    const options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        CurrentSchoolUuid: JSON.parse(localStorage.getItem('school')!).uuid,
      }),
    };

    return this.http.get<Array<string>>(this.apiUrl + `/item-types`, options);
  }

  search(key: string, paginationOptions: PaginationOptions) {
    const options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        CurrentSchoolUuid: JSON.parse(localStorage.getItem('school')!).uuid,
      }),
    };

    return this.http.get<PaginatedResults>(
      this.apiUrl +
        `/items/search/${encodeURIComponent(
          key
        )}?${PaginationOptions.getPaginationQueryParameters(
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
        CurrentSchoolUuid: JSON.parse(localStorage.getItem('school')!).uuid,
      }),
    };

    return this.http.delete<Item>(this.apiUrl + `/items/${uuid}`, options);
  }

  show(uuid: string) {
    const options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        CurrentSchoolUuid: JSON.parse(localStorage.getItem('school')!).uuid,
      }),
    };

    return this.http.get<Item>(this.apiUrl + `/items/${uuid}`, options);
  }

  store(item: any) {
    const options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        CurrentSchoolUuid: JSON.parse(localStorage.getItem('school')!).uuid,
      }),
    };

    return this.http.post<Item>(this.apiUrl + `/items`, item, options);
  }

  update(item: any, uuid: string) {
    const options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        CurrentSchoolUuid: JSON.parse(localStorage.getItem('school')!).uuid,
      }),
    };

    return this.http.put<Item>(this.apiUrl + `/items/${uuid}`, item, options);
  }

  export(type: string, search: string, paginationOptions: PaginationOptions) {
    const options = {
      responseType: 'blob' as 'blob',
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        CurrentSchoolUuid: JSON.parse(localStorage.getItem('school')!).uuid,
      }),
    };

    if (search.trim().length === 0) {
      search = 'null';
    }

    return this.http.get(
      this.baseUrl +
        `exports/items/export/${type}/${search}?${PaginationOptions.getPaginationQueryParameters(
          paginationOptions
        )}`,
      options
    );
  }

  exportItemPurchaseOrderItems(
    uuid: string,
    type: string,
    search: string,
    paginationOptions: PaginationOptions
  ) {
    const options = {
      responseType: 'blob' as 'blob',
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        CurrentSchoolUuid: JSON.parse(localStorage.getItem('school')!).uuid,
      }),
    };

    if (search.trim().length === 0) {
      search = 'null';
    }

    return this.http.get(
      this.baseUrl +
        `exports/items/${uuid}/purchase-order-items/export/${type}/${search}?${PaginationOptions.getPaginationQueryParameters(
          paginationOptions
        )}`,
      options
    );
  }

  exportItemStockAdjustments(
    uuid: string,
    type: string,
    search: string,
    paginationOptions: PaginationOptions
  ) {
    const options = {
      responseType: 'blob' as 'blob',
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        CurrentSchoolUuid: JSON.parse(localStorage.getItem('school')!).uuid,
      }),
    };

    if (search.trim().length === 0) {
      search = 'null';
    }

    return this.http.get(
      this.baseUrl +
        `exports/items/${uuid}/stock-adjustments/export/${type}/${search}?${PaginationOptions.getPaginationQueryParameters(
          paginationOptions
        )}`,
      options
    );
  }

  exportItemStockIssues(
    uuid: string,
    type: string,
    search: string,
    paginationOptions: PaginationOptions
  ) {
    const options = {
      responseType: 'blob' as 'blob',
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        CurrentSchoolUuid: JSON.parse(localStorage.getItem('school')!).uuid,
      }),
    };

    if (search.trim().length === 0) {
      search = 'null';
    }

    return this.http.get(
      this.baseUrl +
        `exports/items/${uuid}/stock-issues/export/${type}/${search}?${PaginationOptions.getPaginationQueryParameters(
          paginationOptions
        )}`,
      options
    );
  }

  exportItemStockReturns(
    uuid: string,
    type: string,
    search: string,
    paginationOptions: PaginationOptions
  ) {
    const options = {
      responseType: 'blob' as 'blob',
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        CurrentSchoolUuid: JSON.parse(localStorage.getItem('school')!).uuid,
      }),
    };

    if (search.trim().length === 0) {
      search = 'null';
    }

    return this.http.get(
      this.baseUrl +
        `exports/items/${uuid}/stock-returns/export/${type}/${search}?${PaginationOptions.getPaginationQueryParameters(
          paginationOptions
        )}`,
      options
    );
  }
}
