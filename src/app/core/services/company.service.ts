import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Company } from '../models/company';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  apiUrl = environment.apiURL;

  constructor(private http: HttpClient) { }

  show() {
    const options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
      }),
    };

    return this.http.get<Company>(this.apiUrl + '/company', options);
  }


  update(company: any) {
    const options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
      }),
    };

    return this.http.put<Company>(this.apiUrl + `/companies`, company, options);
  }

  saveCompanyToLocalStorage(res: any) {
    localStorage.setItem('company', JSON.stringify(res));
  }
}
