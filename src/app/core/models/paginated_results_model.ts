export interface PaginatedResults {
  current_page: number;
  data: Array<any>;
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: Array<any>;
  next_page_url: string;
  path: string;
  per_page: number;
  prev_page_url: string;
  to: number;
  total: number;
}

export const emptyPaginatedResults = {
  current_page: 0,
  data: [],
  first_page_url: '',
  from: 0,
  last_page: 0,
  last_page_url: '',
  links: [],
  next_page_url: '',
  path: '',
  per_page: 0,
  prev_page_url: '',
  to: 0,
  total: 0,
}
