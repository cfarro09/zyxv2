import { ObjectZyx } from "./entities/common";

export interface MultiData {
  data: ObjectZyx[];
  success: boolean;
  key?: string;
}
export interface Pagination {
  sorts: ObjectZyx;
  filters: ObjectZyx;
  pageIndex: number;
  trigger?: boolean;
}

export interface IFetchData {
  sorts: ObjectZyx;
  filters: ObjectZyx;
  pageIndex: number;
  pageSize: number;
  daterange: ObjectZyx;
}

interface IFilters {
  value: ObjectZyx;
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
