import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { PaginatedResults } from '../models/paginated_results_model';
import { PaginationOptions } from '../models/pagination_options';
import { BankAccount } from '../models/bank-account';

@Injectable({
  providedIn: 'root',
})
export class BankAccountService {
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
      `/bank-accounts?${PaginationOptions.getPaginationQueryParameters(paginationOptions)}`,
      options
    );
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
      `exports/bank-accounts/export/${type}/${search}?${PaginationOptions.getPaginationQueryParameters(
        paginationOptions
      )}`,
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
      `/bank-accounts/search/${key}?${PaginationOptions.getPaginationQueryParameters(
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

    return this.http.delete<BankAccount>(this.apiUrl + `/bank-accounts/${uuid}`, options);
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

    return this.http.get<BankAccount>(this.apiUrl + `/bank-accounts/${uuid}`, options);
  }

  store(bankAccount: any) {
    const options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        CurrentCompanyUuid: JSON.parse(localStorage.getItem('company')!).uuid,
      }),
    };

    return this.http.post<BankAccount>(this.apiUrl + `/bank-accounts`, bankAccount, options);
  }

  update(bankAccount: any, uuid: string) {
    const options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        CurrentCompanyUuid: JSON.parse(localStorage.getItem('company')!).uuid,
      }),
    };

    return this.http.put<BankAccount>(this.apiUrl + `/bank-accounts/${uuid}`, bankAccount, options);
  }
}
