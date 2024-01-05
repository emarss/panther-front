import { Component } from '@angular/core';
import { School } from 'src/app/core/models/school';
import { appRoutes } from 'src/app/core/routes-list';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class IndexComponent {
  currentSchool!: School;
  public loading = false;
  public routes = appRoutes;

  constructor() {
    this.currentSchool = new School(
      JSON.parse(localStorage.getItem('school')!)
    );
  }
}
