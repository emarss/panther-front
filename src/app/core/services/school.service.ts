import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { School } from '../models/school';

@Injectable({
  providedIn: 'root',
})
export class SchoolService {
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

    return this.http.get<School>(this.apiUrl + '/school', options);
  }


  update(school: any) {
    const options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
      }),
    };

    return this.http.put<School>(this.apiUrl + `/schools`, school, options);
  }

  saveSchoolToLocalStorage(res: any) {
    localStorage.setItem('school', JSON.stringify(res));
  }
}
