import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export enum PowerBIContentType {
  REPORT = 'report',
  DASHBOARD = 'dashboard',
}

export interface EmbedConfigData {
  type: 'Report' | 'Dashboard'; // optional literal types for clarity
  id: string;
  datasetId: string;
  name: string;
  embedUrl: string;
  embedToken: EmbedTokenData;
}

export interface EmbedTokenData {
  tokenId: string;
  token: string;
  expiration: string; // could also use Date if you parse it
}

export interface GroupData {
  id: string;
  name: string;
}

export interface ReportData {
  id: string;
  name: string;
  embedUrl: string;
}

export interface DashboardData {
  id: string;
  displayName: string;
  embedUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class PowerbiService {
  private baseUrl = 'http://localhost:8080/api/v1/powerbi'; // backend base path

  constructor(private http: HttpClient) {}

  /** 🔑 Get backend-issued access token */
  getAccessToken(): Observable<{ token: string; expiresIn: number }> {
    return this.http.get<{ token: string; expiresIn: number }>(
      `${this.baseUrl}/access-token`
    );
  }

  /** 📊 Get embed token + config for a Report */
  getReportEmbedConfig(groupId: string, reportId: string): Observable<EmbedConfigData> {
    return this.http.get<EmbedConfigData>(
      `${this.baseUrl}/embed/token/reports/${groupId}/${reportId}`
    );
  }

  /** 📊 Get embed token + config for a Dashboard */
  getDashboardEmbedConfig(groupId: string, dashboardId: string): Observable<EmbedConfigData> {
    return this.http.get<EmbedConfigData>(
      `${this.baseUrl}/embed/token/dashboards/${groupId}/${dashboardId}`
    );
  }

  /** 🗂️ List all workspaces */
  getGroups(): Observable<GroupData[]> {
    return this.http.get<GroupData[]>(`${this.baseUrl}/groups`);
  }

  /** 📑 List reports in a workspace */
  getReports(groupId: string): Observable<ReportData[]> {
    return this.http.get<ReportData[]>(`${this.baseUrl}/groups/${groupId}/reports`);
  }

  /** 📊 List dashboards in a workspace */
  getDashboards(groupId: string): Observable<DashboardData[]> {
    return this.http.get<DashboardData[]>(`${this.baseUrl}/groups/${groupId}/dashboards`);
  }

  /** 🔍 Get report details */
  getReportDetails(groupId: string, reportId: string): Observable<ReportData> {
    return this.http.get<ReportData>(`${this.baseUrl}/groups/${groupId}/reports/${reportId}`);
  }

  /** 🔍 Get dashboard details */
  getDashboardDetails(groupId: string, dashboardId: string): Observable<DashboardData> {
    return this.http.get<DashboardData>(
      `${this.baseUrl}/groups/${groupId}/dashboards/${dashboardId}`
    );
  }
}
