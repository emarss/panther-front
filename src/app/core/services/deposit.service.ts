import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { PaginatedResults } from '../models/paginated_results_model';
import { PaginationOptions } from '../models/pagination_options';
import { Deposit } from '../models/deposit';

@Injectable({
  providedIn: 'root',
})
export class DepositService {
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
      `/deposits?${PaginationOptions.getPaginationQueryParameters(paginationOptions)}`,
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
        `/deposits/index/for-date/search/${date}/${search}?${PaginationOptions.getPaginationQueryParameters(paginationOptions)}&period=${period}`,
        options
      );
    }

    return this.http.get<PaginatedResults>(
      this.apiUrl +
      `/deposits/index/for-date/${date}?${PaginationOptions.getPaginationQueryParameters(paginationOptions)}&period=${period}`,
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
      `/deposits/search/${key}?${PaginationOptions.getPaginationQueryParameters(
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

    return this.http.delete<Deposit>(this.apiUrl + `/deposits/${uuid}`, options);
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

    return this.http.get<Deposit>(this.apiUrl + `/deposits/${uuid}`, options);
  }

  store(deposit: any) {
    const options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        CurrentCompanyUuid: JSON.parse(localStorage.getItem('company')!).uuid,
      }),
    };

    return this.http.post<Deposit>(this.apiUrl + `/deposits`, deposit, options);
  }

  update(deposit: any, uuid: string) {
    const options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        CurrentCompanyUuid: JSON.parse(localStorage.getItem('company')!).uuid,
      }),
    };

    return this.http.put<Deposit>(this.apiUrl + `/deposits/${uuid}`, deposit, options);
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
      `exports/deposits/export/${type}/${search}?${PaginationOptions.getPaginationQueryParameters(
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
      `exports/deposits/for-date/${date}/export/${type}/${search}?${PaginationOptions.getPaginationQueryParameters(
        paginationOptions
      )}&period=${period}`,
      options
    );
  }
}
