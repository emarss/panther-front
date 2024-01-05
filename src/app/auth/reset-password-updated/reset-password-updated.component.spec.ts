import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetPasswordUpdatedComponent } from './reset-password-updated.component';

describe('ResetPasswordUpdatedComponent', () => {
  let component: ResetPasswordUpdatedComponent;
  let fixture: ComponentFixture<ResetPasswordUpdatedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResetPasswordUpdatedComponent]
    });
    fixture = TestBed.createComponent(ResetPasswordUpdatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
