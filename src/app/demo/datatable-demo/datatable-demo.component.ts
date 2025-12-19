import { Component } from '@angular/core';

interface UserRow { id: number; name: string; email: string; role?: string }

@Component({
    selector: 'app-datatable-demo',
    templateUrl: './datatable-demo.component.html',
    styleUrls: ['./datatable-demo.component.scss']
})
export class DatatableDemoComponent {
    // full dataset — all 1000 rows
    allRows: UserRow[] = Array.from({ length: 1000 }).map((_, i) => ({
        id: i + 1,
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
        role: i % 3 === 0 ? 'Admin' : 'User'
    }));

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

    constructor() {
        this.loadPage();
    }

    private loadPage() {
        const start = this.pageOffset;
        const end = this.pageOffset + this.pageLimit;
        this.rows = this.allRows.slice(start, end);
    }

    // event handlers
    onPage(event: { offset: number; limit: number }) {
        this.pageOffset = event.offset;
        this.pageLimit = event.limit;
        this.loadPage();
        console.log('page event', event);
    }

    onSort(event: any) {
        console.log('sort event', event);
    }

    onSelect(selected: any[]) {
        console.log('selected rows', selected);
    }

}
