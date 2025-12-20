import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface UserRow { id: number; name: string; email: string; role?: string }

@Injectable({ providedIn: 'root' })
export class DemoApiService {
  private allRows: UserRow[] = Array.from({ length: 1000 }).map((_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    role: i % 3 === 0 ? 'Admin' : 'User'
  }));

  /**
   * Simulate a paginated API call. `offset` is zero-based index.
   */
  getPage(offset: number, limit: number, sort?: { prop: string; dir: 'asc' | 'desc' }): Observable<{ rows: UserRow[]; count: number }> {
    const start = Math.max(0, offset);
    const end = Math.max(start, start + (limit || 10));

    let source = [...this.allRows];
    if (sort && sort.prop) {
      const prop = sort.prop;
      const dir = sort.dir === 'desc' ? -1 : 1;
      source.sort((a: any, b: any) => {
        const av = a?.[prop];
        const bv = b?.[prop];
        if (av == null && bv == null) { return 0; }
        if (av == null) { return -1 * dir; }
        if (bv == null) { return 1 * dir; }
        if (typeof av === 'number' && typeof bv === 'number') {
          return (av - bv) * dir;
        }
        const as = String(av).toLowerCase();
        const bs = String(bv).toLowerCase();
        if (as > bs) { return 1 * dir; }
        if (as < bs) { return -1 * dir; }
        return 0;
      });
    }

    const rows = source.slice(start, end);
    // simulate network latency
    return of({ rows, count: this.allRows.length }).pipe(delay(400));
  }
}
