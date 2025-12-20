import { Component, OnInit } from '@angular/core';
import { TenantService, Tenant } from '../tenant.service';

interface SortEvent {
  prop: string;
  dir: 'asc' | 'desc' | '';
}

@Component({
  selector: 'app-tenant-list',
  templateUrl: './tenant-list.component.html',
  styleUrls: ['./tenant-list.component.scss']
})
export class TenantListComponent implements OnInit {
  rows: Tenant[] = [];
  total = 0;
  loading = false;

  pageOffset = 0; // offset in records (0, limit, 2*limit)
  pageLimit = 5;

  columns = [
    { prop: 'id', name: 'ID', sortable: true, width: 70 },
    { prop: 'tenantId', name: 'Tenant UUID', sortable: true, width: 260 },
    { prop: 'name', name: 'Name', sortable: true },
    { prop: 'status', name: 'Status', sortable: true, width: 120 },
    { prop: 'timeZone', name: 'Time Zone', sortable: false, width: 140 },
    { prop: 'contactEmail', name: 'Email', sortable: false },
    { prop: 'deleted', name: 'Deleted', sortable: true, width: 90 }
  ];

  constructor(private svc: TenantService) {}

  ngOnInit(): void {
    this.loadPage();
  }

  private loadPage(): void {
    this.loading = true;
    // convert offset to page number
    const pageNumber = Math.floor(this.pageOffset / this.pageLimit);
    this.svc.getTenants(pageNumber, this.pageLimit).subscribe(result => {
      this.rows = result.rows;
      this.total = result.total;
      this.loading = false;
    }, () => { this.loading = false; });
  }

  onPage(event: { offset: number; limit: number }) {
    this.pageOffset = event.offset;
    this.pageLimit = event.limit;
    this.loadPage();
  }

  onSort(event: SortEvent) {
    // DataTable emits dir '' for clear; treat as undefined
    const dir = event.dir === '' ? undefined : event.dir;
    const pageNumber = Math.floor(this.pageOffset / this.pageLimit);
    this.loading = true;
    this.svc.getTenants(pageNumber, this.pageLimit, event.prop, dir as any).subscribe(result => {
      this.rows = result.rows;
      this.total = result.total;
      this.loading = false;
    }, () => { this.loading = false; });
  }
}
