import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddItemGroupModalComponent } from './add-item-group-modal.component';

describe('AddItemGroupModalComponent', () => {
  let component: AddItemGroupModalComponent;
  let fixture: ComponentFixture<AddItemGroupModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddItemGroupModalComponent],
    });
    fixture = TestBed.createComponent(AddItemGroupModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
