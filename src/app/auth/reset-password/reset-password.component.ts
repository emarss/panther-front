
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'src/app/core/models/user';
import { appRoutes } from 'src/app/core/routes-list';
import { AuthService } from 'src/app/core/services/auth.service';
import { ToastService } from 'src/app/core/services/toast-service.service';


@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
  form!: FormGroup;
  loading: boolean = false;
  errors: boolean = false;
  public showValidationErrors = false;

  public routes = appRoutes;

  token!: string;
  public sub: any;


  constructor(
    fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute,
    private toastService: ToastService,
  ) {
    this.form = fb.group({
      password: ['', Validators.required],
      passwordConfirmation: ['', Validators.required],
    });

  }

  ngOnInit(): void {
    this.sub = this.route.params.subscribe((params) => {
      this.token = params['token'];
    });
  }

  public resetPassword(): void {
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
      .resetPassword(this.controls['password'].value, this.token)
      .subscribe({
        next: (res: any) => {
          this.loading = false;
          this.router.navigateByUrl(this.routes.authentication.reset_password_updated);
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
