import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUnitOfMeasureModalComponent } from './add-unit-of-measure-modal.component';

describe('AddUnitOfMeasureModalComponent', () => {
  let component: AddUnitOfMeasureModalComponent;
  let fixture: ComponentFixture<AddUnitOfMeasureModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddUnitOfMeasureModalComponent]
    });
    fixture = TestBed.createComponent(AddUnitOfMeasureModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
