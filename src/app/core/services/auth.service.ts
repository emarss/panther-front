import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';
import { Company } from '../models/company';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiUrl = environment.apiURL;

  constructor(private http: HttpClient) { }

  login(e: string, p: string) {
    const options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
    };

    return this.http.post(
      this.apiUrl + '/web/login',
      {
        username: e,
        password: p,
      },
      options
    );
  }

  signup(n: string, e: string, p: string) {
    const options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
    };

    return this.http.post(
      this.apiUrl + '/web/signup',
      {
        name: n,
        email: e,
        password: p,
      },
      options
    );
  }

  requestPasswordReset(email: string) {
    const options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
    };

    return this.http.post(
      this.apiUrl + '/web/request-password-reset',
      {
        email: email,
      },
      options
    );
  }

  resetPassword(password: string, token: string) {
    const options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
    };

    return this.http.post(
      this.apiUrl + '/web/reset-password',
      {
        token: token,
        password: password,
      },
      options
    );
  }


  logout() {
    const options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('access_token'),
      }),
    };

    return this.http.get(this.apiUrl + '/token/revoke', options);
  }

  getUser(token: string) {
    const options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      }),
    };

    return this.http.get<User>(this.apiUrl + '/user', options);
  }


  verifyGoogleToken(token: string) {
    const options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      }),
    };

    return this.http.get<User>(this.apiUrl + '/google-signin-callback', options);
  }




  getCompany(token: string) {
    const options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      }),
    };

    return this.http.get<Company>(this.apiUrl + '/company', options);
  }


  getCurrentUserFromLocal(): User {
    return new User(JSON.parse(localStorage.getItem('user')!));
  }
}
