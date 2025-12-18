import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GroupData, ReportData, DashboardData, EmbedConfigData, PowerbiService } from '../../services/powerbi.service';
import * as pbi from 'powerbi-client';
// import all powerbi references
import { service, factories, models } from 'powerbi-client';


@Component({
  selector: 'app-powerbi-dashboard',
  templateUrl: './powerbi-dashboard.component.html',
  styleUrls: ['./powerbi-dashboard.component.scss']
})
export class PowerbiDashboardComponent implements OnInit {
  groups: GroupData[] = [];
  reports: ReportData[] = [];
  dashboards: DashboardData[] = [];

  selectedGroupId: string | null = null;
  selectedReport: ReportData | null = null;
  selectedDashboard: DashboardData | null = null;

  embedConfig: EmbedConfigData | null = null;
  isLoading = false;
  error: string | null = null;

  @ViewChild('embedContainer', { static: true }) embedContainer!: ElementRef;

  constructor(private powerbiService: PowerbiService) { }

  ngOnInit(): void {
    this.loadGroups();
  }

  /** Load workspaces (groups) */
  loadGroups(): void {
    this.isLoading = true;
    this.powerbiService.getGroups().subscribe({
      next: (groups) => {
        this.groups = groups;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load groups';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  /** Load reports & dashboards */
  onGroupSelect(groupId: string): void {
    if (!groupId) return;

    this.selectedGroupId = groupId;
    this.selectedReport = null;
    this.selectedDashboard = null;
    this.embedConfig = null;

    this.powerbiService.getReports(groupId).subscribe({
      next: (reports) => (this.reports = reports),
      error: (err) => {
        this.error = 'Failed to load reports';
        console.error(err);
      }
    });

    this.powerbiService.getDashboards(groupId).subscribe({
      next: (dashboards) => (this.dashboards = dashboards),
      error: (err) => {
        this.error = 'Failed to load dashboards';
        console.error(err);
      }
    });
  }

  /** Select report */
  onReportSelect(report: ReportData): void {
    if (!this.selectedGroupId) return;

    this.selectedReport = report;
    this.selectedDashboard = null;
    this.isLoading = true;

    this.powerbiService.getReportEmbedConfig(this.selectedGroupId, report.id).subscribe({
      next: (config) => {
        this.embedConfig = config;
        this.isLoading = false;
        this.embedReport(config); // ✅ Embed the report
      },
      error: (err) => {
        this.error = 'Failed to load report embed config';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  /** Select dashboard */
  onDashboardSelect(dashboard: DashboardData): void {
    if (!this.selectedGroupId) return;

    this.selectedDashboard = dashboard;
    this.selectedReport = null;
    this.isLoading = true;

    this.powerbiService.getDashboardEmbedConfig(this.selectedGroupId, dashboard.id).subscribe({
      next: (config) => {
        this.embedConfig = config;
        this.isLoading = false;
        this.embedDashboard(config); // ✅ Embed the dashboard
      },
      error: (err) => {
        this.error = 'Failed to load dashboard embed config';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  /** Embed Report */
  private embedReport(config: EmbedConfigData) {
    const models = pbi.models;

    const reportEmbedConfig: pbi.IReportEmbedConfiguration = {
      type: config.type as 'report',
      id: config.id,
      embedUrl: config.embedUrl,
      accessToken: config.embedToken.token,
      tokenType: models.TokenType.Embed,
      settings: {
        panes: {
          filters: { visible: false },
          pageNavigation: { visible: true }
        }
      }
    };


    // Embed report
    const powerbiService = new service.Service(factories.hpmFactory, factories.wpmpFactory, factories.routerFactory);
    powerbiService.reset(this.embedContainer.nativeElement);
    powerbiService.embed(this.embedContainer.nativeElement, reportEmbedConfig);
  }

  /** Embed Dashboard */
  private embedDashboard(config: any) {
    const models = pbi.models;

    const dashboardEmbedConfig: pbi.IDashboardEmbedConfiguration = {
      type: config.type as 'dashboard',
      id: config.id,
      embedUrl: config.embedUrl,
      accessToken: config.embedToken.token,
      tokenType: models.TokenType.Embed,
      settings: {
        panes: {
          filters: { visible: false },
          pageNavigation: { visible: true }
        }
      }
    };


    const powerbiService = new service.Service(factories.hpmFactory, factories.wpmpFactory, factories.routerFactory);
    powerbiService.reset(this.embedContainer.nativeElement);
    powerbiService.embed(this.embedContainer.nativeElement, dashboardEmbedConfig);
  }
}
