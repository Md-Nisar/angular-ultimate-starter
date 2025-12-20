import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy, TemplateRef, OnInit } from '@angular/core';
import { DataTableConfigService, DataTableDefaults } from './data-table-config.service';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataTableComponent implements OnInit {

  @Input() rows: any[] = [];
  @Input() columns: Array<{
    prop: string;
    name?: string;
    sortable?: boolean;
    width?: number | string;
    cellTemplate?: TemplateRef<any> | null;
  }> = [];
  @Input() loading = false;
  @Input() count = 0; // total rows (for external paging)
  @Input() offset = 0; // current page offset
  @Input() limit?: number; // page size
  @Input() pageSizeOptions?: number[];
  @Input() externalPaging = true;
  @Input() externalSorting = false;
  @Input() selectionType: 'single' | 'multi' | 'checkbox' | undefined = undefined;
  @Input() selected: any[] = [];
  @Input() rowHeight?: number; // approx height of each row in pixels
  /** Make table responsive on small screens. When true the wrapper allows horizontal scroll and cells can wrap. */
  @Input() responsive = true;
  /** Column sizing mode for ngx-datatable. Recommended: 'flex' for responsive layouts. */
  @Input() columnMode: 'standard' | 'flex' | 'force' = 'force';
  @Input() enablePagination = true;
  @Input() tableHeight?: number; // px; used as CSS variable to constrain the table body
  @Input() headerHeight?: number;
  @Input() footerHeight?: number;
  @Input() configOverrides?: Partial<DataTableDefaults>;

  @Output() page = new EventEmitter<{ offset: number; limit: number }>();
  @Output() sort = new EventEmitter<{ prop: string; dir: 'asc' | 'desc' | '' } | null>();
  @Output() select = new EventEmitter<any[]>();

  readonly Math = Math;

  constructor(private config: DataTableConfigService) {}

  ngOnInit(): void {
    const defs = this.config.merge(this.configOverrides);

    this.rowHeight = this.rowHeight ?? defs.rowHeight;
    this.headerHeight = this.headerHeight ?? defs.headerHeight;
    this.footerHeight = this.footerHeight ?? defs.footerHeight;
    this.tableHeight = this.tableHeight ?? defs.tableHeight;
    this.pageSizeOptions = this.pageSizeOptions ?? defs.pageSizeOptions;
    this.limit = this.limit ?? defs.defaultPageSize;
  }

  get currentPage(): number {
    return Math.floor(this.offset / this.limit) + 1;
  }

  get totalPages(): number {
    return Math.ceil(this.count / this.limit) || 1;
  }

  get isFirstPage(): boolean {
    return this.offset === 0;
  }

  get isLastPage(): boolean {
    return this.offset + this.limit >= this.count;
  }

  onPage(event: any): void {
    const offset = typeof event?.offset === 'number' ? event.offset : (event?.page || 0);
    this.page.emit({ offset, limit: this.limit });
  }

  onSort(event: any): void {
    // Normalize ngx-datatable sort payloads to a simple { prop, dir } object
    // Possible incoming shapes:
    // - { sorts: [{ prop, dir }] }
    // - { prop, dir }
    // - [{ prop, dir }]
    if (!event) {
      this.sort.emit(null);
      return;
    }

    let se: any = null;
    if (Array.isArray(event?.sorts) && event.sorts.length) {
      se = event.sorts[0];
    } else if (event?.prop) {
      se = { prop: event.prop, dir: event.dir ?? '' };
    } else if (Array.isArray(event) && event.length) {
      se = event[0];
    }

    if (se && se.prop) {
      this.sort.emit({ prop: se.prop, dir: (se.dir as any) ?? '' });
    } else {
      this.sort.emit(null);
    }
  }

  onSelect(event: any): void {
    const selected = event && event.selected ? event.selected : [];
    this.selected = selected;
    this.select.emit(this.selected);
  }

  goPreviousPage(): void {
    if (this.offset >= this.limit) {
      this.page.emit({ offset: this.offset - this.limit, limit: this.limit });
    }
  }

  goNextPage(): void {
    if (this.offset + this.limit < this.count) {
      this.page.emit({ offset: this.offset + this.limit, limit: this.limit });
    }
  }

  goFirstPage(): void {
    if (!this.isFirstPage) {
      this.offset = 0;
      this.page.emit({ offset: 0, limit: this.limit });
    }
  }

  goLastPage(): void {
    if (!this.isLastPage) {
      const lastPageIndex = Math.max(0, this.totalPages - 1);
      const offset = lastPageIndex * this.limit;
      this.offset = offset;
      this.page.emit({ offset, limit: this.limit });
    }
  }

  onLimitChange(newLimit: number | Event): void {
    // support being called with a number or with a native change Event from <select>
    let parsedLimit: number;
    if (typeof newLimit === 'number') {
      parsedLimit = newLimit;
    } else {
      // defensive: cast from Event
      // @ts-ignore
      const raw = (newLimit?.target as HTMLSelectElement)?.value;
      parsedLimit = parseInt(raw, 10);
    }

    if (!isFinite(parsedLimit) || parsedLimit <= 0) {
      parsedLimit = this.limit || 10;
    }

    // update internal state so UI reflects current selection
    this.limit = parsedLimit;
    this.offset = 0;
    this.page.emit({ offset: 0, limit: parsedLimit });
  }

  // Improve datatable rendering by providing a stable identity function
  rowIdentity = (row: any) => {
    if (!row) { return row; }
    return row.id ?? row;
  };

}

