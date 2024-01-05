import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CompanyGuardService {

  constructor(private router: Router) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (localStorage.getItem('company')) {
      return true;
    }
    localStorage.removeItem('company');
    this.router.navigateByUrl('/auth/login');
    return false;
  }
}
