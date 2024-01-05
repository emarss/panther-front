import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Company } from 'src/app/core/models/company';
import { Setting } from 'src/app/core/models/setting';
import { User } from 'src/app/core/models/user';
import { appRoutes } from 'src/app/core/routes-list';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CompanyService } from 'src/app/core/services/company.service';
import { SettingService } from 'src/app/core/services/setting.service';
import { ToastService } from 'src/app/core/services/toast-service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  form!: FormGroup;
  loading: boolean = false;
  errors: boolean = false;

  public routes = appRoutes;

  constructor(
    fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private companyService: CompanyService,
    private toastService: ToastService,
    private settingService: SettingService) {
    this.form = fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

  }

  ngOnInit(): void { }

  public login(): void {
    this.loading = true;
    this.errors = false;
    this.authService
      .login(this.controls['email'].value, this.controls['password'].value)
      .subscribe({
        next: (res: any) => {

          this.errors = false;
          if (res.access_token) {
            this.getAuthUser(res);
          } else {
            this.loading = false;
            this.errors = true;
            this.toastService.showError(res.message);
          }
        },
        error: (err: any) => {
          this.loading = false;
          this.errors = true;
          if (err.error.message) {
            this.toastService.showError(err.error.message)
          } else {
            this.toastService.showError("An error occurred. Please, check your internet connection and try again.");
          }
        },
      });
  }


  private getAuthUser(res: any) {
    this.authService.getUser(res.access_token).subscribe({
      next: (user: User) => {
        this.authService.getCompany(res.access_token).subscribe({
          next: (company: Company) => {
            localStorage.setItem('user', JSON.stringify(user));
            this.companyService.saveCompanyToLocalStorage(company);
            localStorage.setItem('access_token', res.access_token);
            this.getSettingsAndNavigateToHome();
          },
          error: (err: any) => {
            this.loading = false;
            this.errors = true;
          },
        });
      },
      error: (err: any) => {
        this.loading = false;
        this.errors = true;
      },
    });
  }


  private getSettingsAndNavigateToHome() {
    this.settingService
      .show().subscribe({
        next: (res) => {
          this.loading = false;
          localStorage.setItem('setting', JSON.stringify(new Setting(res)));
          this.loading = false;
          this.router.navigate(['/']);
        },
        error: (err: any) => {
          this.loading = false;
          this.errors = true;
        },
      });
  }


  get controls() {
    return this.form.controls;
  }
}
