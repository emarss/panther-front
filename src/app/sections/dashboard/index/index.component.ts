import { Component } from '@angular/core';
import { Company } from 'src/app/core/models/company';
import { appRoutes } from 'src/app/core/routes-list';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class IndexComponent {
  currentCompany!: Company;
  public loading = false;
  public routes = appRoutes;

  constructor() {
    this.currentCompany = new Company(
      JSON.parse(localStorage.getItem('company')!)
    );
  }
}
