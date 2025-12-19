import { Injectable } from '@angular/core';

export interface DataTableDefaults {
  rowHeight: number;
  headerHeight: number;
  footerHeight: number;
  tableHeight: number;
  pageSizeOptions: number[];
  defaultPageSize: number;
  minColumnWidth: number;
  maxColumnWidth: number;
  autoSizeColumns: boolean;
}

@Injectable({ providedIn: 'root' })
export class DataTableConfigService {
  readonly defaults: DataTableDefaults = {
    rowHeight: 48,
    headerHeight: 50,
    footerHeight: 60,
    tableHeight: 600,
    pageSizeOptions: [5, 10, 25, 50, 100],
    defaultPageSize: 5,
    minColumnWidth: 60,
    maxColumnWidth: 800,
    autoSizeColumns: false,
  };

  // helper to merge provided options with defaults
  merge(partial?: Partial<DataTableDefaults>): DataTableDefaults {
    return { ...this.defaults, ...(partial || {}) };
  }
}
