import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, timer } from 'rxjs';
import { map, retryWhen, scan, delayWhen, catchError } from 'rxjs/operators';
import { apiBaseUrl } from '../../environments/environment';

export interface Tenant {
  id: number;
  tenantId?: string;
  name: string;
  status?: string;
  timeZone?: string;
  contactEmail?: string;
  deleted?: boolean;
  [key: string]: any;
}

export interface PaginatedResponse {
  rows: Tenant[];
  total: number;
}

@Injectable({ providedIn: 'root' })
export class TenantService {
  // Use environment-provided base URL
  baseUrl = apiBaseUrl || 'http://localhost:9090/api';

  constructor(private http: HttpClient) {}

  /**
   * Fetch tenants from backend paginated endpoint.
   * Expects endpoint like: GET {{baseUrl}}/v1/tenants/paginated?page=0&size=10&sortBy=name&sortDir=asc
   */
  getTenants(page = 0, size = 10, sortBy?: string, sortDir?: 'asc' | 'desc'): Observable<PaginatedResponse> {
    const maxRetries = 3;
    const backoffMs = 500;
    let params = new HttpParams().set('page', String(page)).set('size', String(size));
    if (sortBy) {
      params = params.set('sortBy', sortBy);
    }
    if (sortDir) {
      params = params.set('sortDir', sortDir);
    }
    const url = `${this.baseUrl}/v1/tenants/paginated`;
    return this.http.get<any>(url, { params }).pipe(
      // retry with exponential backoff for transient (5xx / network) errors
      retryWhen(errors => errors.pipe(
        scan((retryCount, err) => {
          // If client error (4xx) don't retry
          if (err && err.status && err.status >= 400 && err.status < 500) {
            throw err;
          }
          if (retryCount >= maxRetries) {
            throw err;
          }
          return retryCount + 1;
        }, 0),
        delayWhen(retryCount => timer(Math.pow(2, retryCount) * backoffMs))
      )),
      map(res => {
        if (!res) {
          return { rows: [], total: 0 } as PaginatedResponse;
        }
        // Backend controller wraps payload as: { data: { content: [...], totalElements, ... }, success, code, message, timestamp }
        const payload = res.data ?? res;
        // If payload looks like a page response
        if (payload && Array.isArray(payload.content) && typeof payload.totalElements === 'number') {
          return { rows: payload.content as Tenant[], total: payload.totalElements } as PaginatedResponse;
        }
        // Older/fallback shapes
        if (Array.isArray(payload)) {
          return { rows: payload as Tenant[], total: (payload as any).length } as PaginatedResponse;
        }
        if (payload.content && typeof payload.total === 'number') {
          return { rows: payload.content as Tenant[], total: payload.total } as PaginatedResponse;
        }
        if (payload.rows && typeof payload.total === 'number') {
          return { rows: payload.rows as Tenant[], total: payload.total } as PaginatedResponse;
        }
        // Generic fallback
        const rows = payload.content || payload.data || payload.rows || [];
        const total = payload.totalElements ?? payload.total ?? (rows && rows.length) ?? 0;
        return { rows: rows as Tenant[], total: total } as PaginatedResponse;
      }),
      catchError(err => {
        // log and return an empty page so UI can handle gracefully
        // eslint-disable-next-line no-console
        console.error('TenantService.getTenants failed', err);
        return of({ rows: [], total: 0 } as PaginatedResponse);
      })
    );
  }
}
