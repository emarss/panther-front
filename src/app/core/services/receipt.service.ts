import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { PaginatedResults } from '../models/paginated_results_model';
import { PaginationOptions } from '../models/pagination_options';
import { Receipt } from '../models/receipt';

@Injectable({
  providedIn: 'root',
})
export class ReceiptService {
  apiUrl = environment.apiURL;
  baseUrl = environment.baseURL;

  constructor(private http: HttpClient) { }

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
      `/receipts?${PaginationOptions.getPaginationQueryParameters(paginationOptions)}`,
      options
    );
  }

  forDate(date: string, period: string, paginationOptions: PaginationOptions, search?: string) {
    const options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        CurrentSchoolUuid: JSON.parse(localStorage.getItem('school')!).uuid,
      }),
    };

    if (search) {
      return this.http.get<PaginatedResults>(
        this.apiUrl +
        `/receipts/index/for-date/search/${date}/${search}?${PaginationOptions.getPaginationQueryParameters(paginationOptions)}&period=${period}`,
        options
      );
    }

    return this.http.get<PaginatedResults>(
      this.apiUrl +
      `/receipts/index/for-date/${date}?${PaginationOptions.getPaginationQueryParameters(paginationOptions)}&period=${period}`,
      options
    );
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
      `/receipts/search/${key}?${PaginationOptions.getPaginationQueryParameters(
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

    return this.http.delete<Receipt>(this.apiUrl + `/receipts/${uuid}`, options);
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

    return this.http.get<Receipt>(this.apiUrl + `/receipts/${uuid}`, options);
  }

  store(receipt: any) {
    const options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        CurrentSchoolUuid: JSON.parse(localStorage.getItem('school')!).uuid,
      }),
    };

    return this.http.post<Receipt>(this.apiUrl + `/receipts`, receipt, options);
  }

  update(receipt: any, uuid: string) {
    const options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        CurrentSchoolUuid: JSON.parse(localStorage.getItem('school')!).uuid,
      }),
    };

    return this.http.put<Receipt>(this.apiUrl + `/receipts/${uuid}`, receipt, options);
  }




  export(type: string, search: string, paginationOptions: PaginationOptions) {
    const options = {
      responseType: "blob" as 'blob',
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        CurrentSchoolUuid: JSON.parse(localStorage.getItem('school')!).uuid,
      }),
    };

    if (search.trim().length === 0) {
      search = "null";
    }

    return this.http.get(
      this.baseUrl +
      `exports/receipts/export/${type}/${search}?${PaginationOptions.getPaginationQueryParameters(
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
        CurrentSchoolUuid: JSON.parse(localStorage.getItem('school')!).uuid,
      }),
    };

    if (search.trim().length === 0) {
      search = "null";
    }

    return this.http.get(
      this.baseUrl +
      `exports/receipts/for-date/${date}/export/${type}/${search}?${PaginationOptions.getPaginationQueryParameters(
        paginationOptions
      )}&period=${period}`,
      options
    );
  }

}
