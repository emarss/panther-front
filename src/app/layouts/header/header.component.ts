import { Component, HostListener, Input } from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
} from '@angular/router';
import { PaginatedResults } from 'src/app/core/models/paginated_results_model';
import { Company } from 'src/app/core/models/company';
import { User } from 'src/app/core/models/user';
import { appRoutes } from 'src/app/core/routes-list';
import { AuthService } from 'src/app/core/services/auth.service';
import { SettingService } from 'src/app/core/services/setting.service';
import { Setting } from 'src/app/core/models/setting';
import { NotificationService } from 'src/app/core/services/notification.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  public user: User = new User(JSON.parse(localStorage.getItem('user')!));
  public company: Company = new Company(
    JSON.parse(localStorage.getItem('company')!)
  );

  public routes = appRoutes;
  private sub: any;

  public unseenNotificationsCount: number = 0;

  public loading = true;
  public loggingOut = false;
  public paginatedResults!: PaginatedResults;

  constructor(
    private router: Router,
    private authService: AuthService,
    private settingService: SettingService,
    private notificationService: NotificationService
  ) {
    this.getSavedUnseenNotificationsCount();
    this.getUserSettings();
    this.getUnseenNotificationsCount();

    if (!this.sub) {
      this.sub = this.router.events.subscribe((event) => {
        switch (true) {
          case event instanceof NavigationStart: {
            this.loading = true;
            break;
          }

          case event instanceof NavigationEnd:
          case event instanceof NavigationCancel:
          case event instanceof NavigationError: {
            setTimeout(() => {
              this.loading = false;
            }, 1000);
            break;
          }
          default: {
            break;
          }
        }
      });
    }
  }

  getSavedUnseenNotificationsCount() {
    this.unseenNotificationsCount =
      this.notificationService.getSavedUnseenNotificationsCount();
  }

  getUserSettings() {
    try {
      this.settingService.show().subscribe({
        next: (res) => {
          this.loading = false;
          localStorage.setItem('setting', JSON.stringify(new Setting(res)));
        },
        error: (error) => {
          if (error.status == 401) {
            this.quickLogout();
          }
          this.loading = false;
        },
      });
    } catch (error: any) {
      if (error.status == 401) {
        this.quickLogout();
      }
      this.loading = false;
    }
  }

  getUnseenNotificationsCount() {
    this.notificationService.unseenNotificationsCount().subscribe({
      next: (res: number) => {
        this.notificationService.saveUnseenNotificationsCount(res);
        this.getSavedUnseenNotificationsCount();
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  quickLogout() {
    this.clearLocalStorage();
    this.router.navigate([this.routes.authentication.login]);
  }

  logout(): void {
    this.loggingOut = true;
    this.authService.logout().subscribe({
      next: () => {
        this.loggingOut = false;
        this.clearLocalStorage();
        this.router.navigate([this.routes.authentication.login]);
      },
      error: () => {
        this.loggingOut = false;
        this.clearLocalStorage();
        this.router.navigate([this.routes.authentication.login]);
      },
    });
  }

  private clearLocalStorage() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    localStorage.removeItem('company');
    localStorage.removeItem('setting');
  }

  @HostListener('unloaded')
  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}
