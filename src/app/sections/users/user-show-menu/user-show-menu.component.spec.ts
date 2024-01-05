import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserShowMenuComponent } from './user-show-menu.component';

describe('UserShowMenuComponent', () => {
  let component: UserShowMenuComponent;
  let fixture: ComponentFixture<UserShowMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserShowMenuComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UserShowMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
