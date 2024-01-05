export class PaginationOptions {
  perPage: number | string = 6;
  pageNumber: number = 1;
  sort: string = 'date_updated';
  direction: string = 'asc';
  filter: string = 'not_trashed';

  private section!: string;

  public toggleDirection() {
    this.direction = this.direction === 'desc' ? 'asc' : 'desc';
  }

  public toggleFilter() {
    this.filter = this.filter === 'trashed' ? 'not_trashed' : 'trashed';
  }

  public resetDirection() {
    this.direction = 'asc';
  }

  public directionIsAsc(): boolean {
    return this.direction === 'asc';
  }

  constructor(options: PaginationOptionsInterface, section: string) {
    this.section = section;
    let savedOptionsForSection = localStorage.getItem(section);
    if (savedOptionsForSection) {
      this.perPage = JSON.parse(savedOptionsForSection).perPage;
      this.pageNumber = this.pageNumber; // pageNumber does not need to be remembered
      this.sort = JSON.parse(savedOptionsForSection).sort;
      this.direction = JSON.parse(savedOptionsForSection).direction;
      this.filter = this.filter; // filter does not need to be remembered
      return;
    }

    if (options.perPage) {
      if (options.perPage === 'ALL') {
        this.perPage = 0;
      } else {
        this.perPage = options.perPage;
      }
    }
    if (options.pageNumber) {
      this.pageNumber = options.pageNumber;
    }
    if (options.sort) {
      this.sort = options.sort;
    }
    if (options.direction) {
      this.direction = options.direction;
    }

    if (options.filter) {
      this.filter = options.filter;
    }

    this.saveUpdatedOptions();
  }

  public saveUpdatedOptions() {
    localStorage.setItem(this.section, JSON.stringify({
      perPage: this.perPage,
      pageNumber: this.pageNumber,
      sort: this.sort,
      direction: this.direction,
      filter: this.filter,
    }));
  }

  public static getPaginationQueryParameters(paginationOptions: PaginationOptions): string {
    return `page=${paginationOptions.pageNumber}&perPage=${paginationOptions.perPage}&sort=${paginationOptions.sort}&direction=${paginationOptions.direction}&filter=${paginationOptions.filter}`;
  }
}

interface PaginationOptionsInterface {
  perPage?: number | string;
  pageNumber?: number;
  sort?: string;
  direction?: string;
  filter?: string;
}
