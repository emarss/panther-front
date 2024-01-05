import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbAccordion } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'src/app/core/models/user';
import { appRoutes } from 'src/app/core/routes-list';
import { AuthService } from 'src/app/core/services/auth.service';
import { PermissionService } from 'src/app/core/services/permission.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {

  @ViewChild('acc') sideBarAcc!: NgbAccordion;

  public openSection = '';

  public routes = appRoutes;
  public user!: User;

  constructor(
    private router: Router,
    private authService: AuthService,
    private permissionService: PermissionService
  ) {
    this.user = this.authService.getCurrentUserFromLocal();
  }


  ngOnInit(): void {
    this.openSection = this.router.url.split('/')[1] + 'Menu';
  }

  public allPermissionsAreFalse(permissionArray: Array<Array<any>>): boolean {
    return permissionArray.every((perm) => this.permissionService.checkPermissionsForSection(perm[0], perm[1]) === false);
  }

  public getChildActiveClass(url: string) {
    return this.getChildRoute() === url ? 'active' : 'not-active';
  }

  public getChildActiveClasses(urls: Array<string>) {
    return urls.filter((el) => el === this.getChildRoute()).length > 0 ? 'active' : 'not-active';
  }

  public currentRouteIsDashboard() {
    return this.router.url === "/";
  }


  private getChildRoute() {
    return this.router.url.split('/')[1] + '/' + this.router.url.split('/')[2];
  }

  openCreateRoute(event: MouseEvent, route: string) {
    event.stopPropagation();
    this.router.navigateByUrl(route);
    return false;
  }
}
