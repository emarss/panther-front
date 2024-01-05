import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PaginatedResults } from '../models/paginated_results_model';
import { PaginationOptions } from '../models/pagination_options';
import { ContactPerson } from '../models/contact-person';

@Injectable({
  providedIn: 'root',
})
export class ContactPersonService {
  apiUrl = environment.apiURL;
  baseUrl = environment.baseURL;
  public contactPersonUpdatedSubject = new Subject();

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
      `/contact-persons?${PaginationOptions.getPaginationQueryParameters(paginationOptions)}`,
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
      `exports/contact-persons/export/${type}/${search}?${PaginationOptions.getPaginationQueryParameters(
        paginationOptions
      )}`,
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

    return this.http.get<Array<ContactPerson>>(
      this.apiUrl +
      `/contact-persons/index/all`,
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
      `/contact-persons/search/${key}?${PaginationOptions.getPaginationQueryParameters(
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

    return this.http.delete<ContactPerson>(this.apiUrl + `/contact-persons/${uuid}`, options);
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

    return this.http.get<ContactPerson>(this.apiUrl + `/contact-persons/${uuid}`, options);
  }

  store(contactPerson: any) {
    const options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        CurrentCompanyUuid: JSON.parse(localStorage.getItem('company')!).uuid,
      }),
    };

    return this.http.post<ContactPerson>(this.apiUrl + `/contact-persons`, contactPerson, options);
  }

  update(contactPerson: any, uuid: string) {
    const options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        CurrentCompanyUuid: JSON.parse(localStorage.getItem('company')!).uuid,
      }),
    };

    return this.http.put<ContactPerson>(this.apiUrl + `/contact-persons/${uuid}`, contactPerson, options);
  }
}
