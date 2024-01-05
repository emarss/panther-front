import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterAndSortActionButtonsComponent } from './filter-and-sort-action-buttons.component';

describe('FilterAndSortActionButtonsComponent', () => {
  let component: FilterAndSortActionButtonsComponent;
  let fixture: ComponentFixture<FilterAndSortActionButtonsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FilterAndSortActionButtonsComponent]
    });
    fixture = TestBed.createComponent(FilterAndSortActionButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
