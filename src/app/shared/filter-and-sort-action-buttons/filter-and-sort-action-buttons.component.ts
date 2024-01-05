import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PaginationOptions } from 'src/app/core/models/pagination_options';

@Component({
  selector: 'app-filter-and-sort-action-buttons',
  templateUrl: './filter-and-sort-action-buttons.component.html',
  styleUrls: ['./filter-and-sort-action-buttons.component.scss']
})
export class FilterAndSortActionButtonsComponent {
  @Input()
  public paginationOptions!: PaginationOptions;

  @Input()
  public sortColumns!: Array<string>;

  @Input()
  public showFilter: boolean = true;

  @Output()
  filterToggled = new EventEmitter();

  @Output()
  sortChanged = new EventEmitter();

  getColumnName(col: string): string {
    return col.replace(/_/gi, ' ');
  }


  toggleFilter() {
    this.filterToggled.emit()
  }

  changeSort(field: string) {
    this.sortChanged.emit(field)
  }

}
