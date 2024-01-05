import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcIconArrowRightComponent } from './ac-icon-arrow-right.component';

describe('AcIconArrowRightComponent', () => {
  let component: AcIconArrowRightComponent;
  let fixture: ComponentFixture<AcIconArrowRightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AcIconArrowRightComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AcIconArrowRightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
