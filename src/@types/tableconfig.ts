export interface MultiData {
  data: object[];
  success: boolean;
  key?: string;
}
export interface Pagination {
  sorts: object;
  filters: object;
  pageIndex: number;
  trigger?: boolean;
}

export interface IFetchData {
  sorts: object;
  filters: object;
  pageIndex: number;
  pageSize: number;
  daterange: object;
}

interface IFilters {
  value: object;
  operator: string;
  type?: string | null;
}

export interface ITablePaginatedFilter {
  /**timestamp */
  startDate: number | null;
  /**timestamp */
  endDate: number | null;
  page: number;
  filters: {
    [key: string]: IFilters;
  };
}
