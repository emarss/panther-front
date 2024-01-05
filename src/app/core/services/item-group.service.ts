import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { PaginatedResults } from '../models/paginated_results_model';
import { PaginationOptions } from '../models/pagination_options';
import { ItemGroup } from '../models/item-group';

@Injectable({
  providedIn: 'root',
})
export class ItemGroupService {
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
      `/item-groups?${PaginationOptions.getPaginationQueryParameters(paginationOptions)}`,
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

    return this.http.get<Array<ItemGroup>>(
      this.apiUrl +
      `/item-groups/index/all`,
      options
    );
  }


  getItemGroupItems(uuid: string, paginationOptions: PaginationOptions) {
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
      `/item-groups/items/${uuid}?${PaginationOptions.getPaginationQueryParameters(paginationOptions)}`,
      options
    );
  }


  searchItemGroupItems(key: string, search: string, paginationOptions: PaginationOptions) {
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
      `/item-groups/items/search/${key}/${search}?${PaginationOptions.getPaginationQueryParameters(
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
        CurrentSchoolUuid: JSON.parse(localStorage.getItem('school')!).uuid,
      }),
    };

    return this.http.get<PaginatedResults>(
      this.apiUrl +
      `/item-groups/search/${key}?${PaginationOptions.getPaginationQueryParameters(
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

    return this.http.delete<ItemGroup>(this.apiUrl + `/item-groups/${uuid}`, options);
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

    return this.http.get<ItemGroup>(this.apiUrl + `/item-groups/${uuid}`, options);
  }

  store(itemGroup: any) {
    const options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        CurrentSchoolUuid: JSON.parse(localStorage.getItem('school')!).uuid,
      }),
    };

    return this.http.post<ItemGroup>(this.apiUrl + `/item-groups`, itemGroup, options);
  }

  update(itemGroup: any, uuid: string) {
    const options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        CurrentSchoolUuid: JSON.parse(localStorage.getItem('school')!).uuid,
      }),
    };

    return this.http.put<ItemGroup>(this.apiUrl + `/item-groups/${uuid}`, itemGroup, options);
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
      `exports/item-groups/export/${type}/${search}?${PaginationOptions.getPaginationQueryParameters(
        paginationOptions
      )}`,
      options
    );
  }

  exportItemGroupItems(uuid: string, type: string, search: string, paginationOptions: PaginationOptions) {
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
      `exports/item-groups/${uuid}/items/export/${type}/${search}?${PaginationOptions.getPaginationQueryParameters(
        paginationOptions
      )}`,
      options
    );
  }

}
