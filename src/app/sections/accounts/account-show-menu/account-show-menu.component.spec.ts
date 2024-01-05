import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountShowMenuComponent } from './account-show-menu.component';

describe('AccountShowMenuComponent', () => {
  let component: AccountShowMenuComponent;
  let fixture: ComponentFixture<AccountShowMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccountShowMenuComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountShowMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
