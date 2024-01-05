
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'src/app/core/models/user';
import { appRoutes } from 'src/app/core/routes-list';
import { AuthService } from 'src/app/core/services/auth.service';
import { ToastService } from 'src/app/core/services/toast-service.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  form!: FormGroup;
  loading: boolean = false;
  errors: boolean = false;
  public showValidationErrors = false;

  public routes = appRoutes;

  constructor(
    fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private toastService: ToastService,
  ) {
    this.form = fb.group({
      email: ['', [Validators.required, Validators.email]],
    });

  }

  ngOnInit(): void { }

  public requestPasswordResetEmail(): void {
    if (this.loading) {
      return;
    }


    if (!this.form.valid) {
      this.toastService.showError("Please, fill up all required form fields.", "Validation Error");
      this.showValidationErrors = true;
      return;
    }


    this.loading = true;
    this.errors = false;
    this.authService
      .requestPasswordReset(this.controls['email'].value)
      .subscribe({
        next: (res: any) => {
          this.loading = false;
          this.router.navigate([this.routes.authentication.reset_password_sent, this.controls['email'].value]);
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

  get controls() {
    return this.form.controls;
  }
}
