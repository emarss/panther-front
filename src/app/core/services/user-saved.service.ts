import { Injectable } from '@angular/core';
import { appRoutes } from '../routes-list';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserSavedService {
  public routes = appRoutes;

  constructor(private router: Router) { }


  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (localStorage.getItem('user')) {
      return true;
    }
    localStorage.removeItem('user');
    this.router.navigateByUrl(this.routes.authentication.login);
    return false;
  }
}
