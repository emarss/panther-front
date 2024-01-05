import { Component } from '@angular/core';
import { School } from 'src/app/core/models/school';
import { appRoutes } from 'src/app/core/routes-list';
import { AlertService } from 'src/app/core/services/alert.service';
import { SchoolService } from 'src/app/core/services/school.service';
import { SettingService } from 'src/app/core/services/setting.service';
import { ToastService } from 'src/app/core/services/toast-service.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
})
export class WelcomeComponent {
  school?: School;
  public loading = true;
  public routes = appRoutes;

  constructor(
    private schoolService: SchoolService,
    private settingService: SettingService,
    private toastService: ToastService,
    private alertService: AlertService
  ) {
    if (!this.school) {
      this.school = new School(JSON.parse(localStorage.getItem('school')!));
    }
  }

  sayHiToRose() {
    this.loading = true;
    this.settingService.sayHiToRose().subscribe({
      next: (res) => {
        this.schoolService.saveSchoolToLocalStorage(res);
        this.school = new School(res);
        this.loading = false;
        this.toastService.showSuccess(
          'Rose has sent a Hello message to your WhatsApp number. Please, check your WhatsApp to start a conversation.'
        );
      },
      error: (err: any) => {
        this.loading = false;
        this.alertService.showNotificationForHttpError(err);
      },
    });
  }

  resendVerificationEmail() {
    this.loading = true;
    this.settingService.resendVerificationEmail().subscribe({
      next: (res: boolean) => {
        this.loading = false;
        if (res) {
          this.toastService.showSuccess(
            `Verification email request has been sent to ${this.school?.email}.`
          );
        } else {
          this.toastService.showError(
            'Verification email request could not be send at the moment. Please, try again.'
          );
        }
      },
      error: (err: any) => {
        this.loading = false;
        this.alertService.showNotificationForHttpError(err);
      },
    });
  }

  items = [
    'Item 1',
    'Item 2',
    'Item 3',
    'Item 4',
    'Item 5',
    'Item 6',
    'Item 7',
  ];
  currentIndex = 0;

  next() {
    if (this.currentIndex === this.items.length - 3) {
      this.currentIndex = 0;
    } else {
      this.currentIndex++;
    }
  }

  prev() {
    if (this.currentIndex === 0) {
      this.currentIndex = this.items.length - 3;
    } else {
      this.currentIndex--;
    }
  }

  ngOnInit() {
    this.schoolService.show().subscribe({
      next: (value) => {
        this.school = new School(value);
        this.schoolService.saveSchoolToLocalStorage(value);
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
      },
    });
  }
}
