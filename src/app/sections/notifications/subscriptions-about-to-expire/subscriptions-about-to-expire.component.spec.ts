import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionsAboutToExpireComponent } from './subscriptions-about-to-expire.component';

describe('SubscriptionsAboutToExpireComponent', () => {
  let component: SubscriptionsAboutToExpireComponent;
  let fixture: ComponentFixture<SubscriptionsAboutToExpireComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubscriptionsAboutToExpireComponent],
    });
    fixture = TestBed.createComponent(SubscriptionsAboutToExpireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
