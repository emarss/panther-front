import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcIconArrowDownComponent } from './ac-icon-arrow-down.component';

describe('AcIconArrowDownComponent', () => {
  let component: AcIconArrowDownComponent;
  let fixture: ComponentFixture<AcIconArrowDownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AcIconArrowDownComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AcIconArrowDownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
