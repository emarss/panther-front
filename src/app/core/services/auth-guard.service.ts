import { Injectable } from '@angular/core';
import {
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { appRoutes } from '../routes-list';
@Injectable({
  providedIn: 'root',
})
export class AuthGuardService {
  public routes = appRoutes;

  constructor(private router: Router) { }


  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (localStorage.getItem('access_token') && localStorage.getItem('user')) {
      return true;
    }
    localStorage.removeItem('access_token');
    this.router.navigateByUrl(this.routes.authentication.login);
    return false;
  }
}
