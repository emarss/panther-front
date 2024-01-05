import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { appRoutes } from 'src/app/core/routes-list';

@Component({
  selector: 'app-reset-password-sent',
  templateUrl: './reset-password-sent.component.html',
  styleUrls: ['./reset-password-sent.component.scss'],
})
export class ResetPasswordSentComponent {
  public routes = appRoutes;

  emailAddress!: string;
  public sub: any;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.sub = this.route.params.subscribe((params) => {
      this.emailAddress = params['email_address'];
    });
  }
}
