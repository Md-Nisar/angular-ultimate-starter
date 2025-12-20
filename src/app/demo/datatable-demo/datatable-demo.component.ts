import { Component, OnDestroy, OnInit } from '@angular/core';
import { DemoApiService, UserRow } from '../demo-api.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-datatable-demo',
    templateUrl: './datatable-demo.component.html',
    styleUrls: ['./datatable-demo.component.scss']
})
export class DatatableDemoComponent implements OnInit, OnDestroy {
    // rows for current page only
    rows: UserRow[] = [];

    columns = [
        { prop: 'id', name: 'ID', sortable: true },
        { prop: 'name', name: 'Name', sortable: true },
        { prop: 'email', name: 'Email', sortable: true },
        { prop: 'role', name: 'Role', sortable: false }
    ];

    // table state
    pageOffset = 0;
    pageLimit = 5; // default page size
    loading = false;
    totalCount = 0;

    private sub?: Subscription;

    // default to external paging for demo
    pagingMode: 'external' | 'internal' | 'auto' = 'external';

    constructor(private api: DemoApiService) {}

    ngOnInit(): void {
        this.loadPage();
    }

    ngOnDestroy(): void {
        this.sub?.unsubscribe();
    }

    private loadPage(): void {
        this.loading = true;
        this.sub?.unsubscribe();
        this.sub = this.api.getPage(this.pageOffset, this.pageLimit, this.currentSort).subscribe(res => {
            this.rows = res.rows;
            this.totalCount = res.count;
            this.loading = false;
        });
    }

    // event handlers
    onPage(event: { offset: number; limit: number }) {
        this.pageOffset = event.offset;
        this.pageLimit = event.limit;
        this.loadPage();
        console.log('page event', event);
    }

    currentSort?: { prop: string; dir: 'asc' | 'desc' };

    onSort(event: any) {
        // ngx-datatable emits a sorts array when header sorting is used
        // Normalize to a single sort object {prop, dir}
        const sorts = event?.sorts || (event ? [event] : []);
        if (Array.isArray(sorts) && sorts.length > 0) {
            const s = sorts[0];
            const dir = (s.dir === 'desc' || s.dir === -1) ? 'desc' : 'asc';
            this.currentSort = { prop: s.prop, dir };
        } else if (event?.prop && event?.dir) {
            const dir = (event.dir === 'desc' || event.dir === -1) ? 'desc' : 'asc';
            this.currentSort = { prop: event.prop, dir };
        } else {
            this.currentSort = undefined;
        }
        console.log('sort event', this.currentSort);
        // reload current page with new sort applied
        this.loadPage();
    }

    onSelect(selected: any[]) {
        console.log('selected rows', selected);
    }

    togglePaging(mode: 'external' | 'internal' | 'auto') {
        this.pagingMode = mode;
        if (this.pagingMode === 'external') {
            this.loadPage();
        }
    }

}
