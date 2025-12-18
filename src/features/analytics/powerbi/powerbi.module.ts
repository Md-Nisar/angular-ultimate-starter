import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PowerbiRoutingModule } from './powerbi-routing.module';
import { PowerbiDashboardComponent } from './components/powerbi-dashboard/powerbi-dashboard.component';
import { HttpClientModule } from '@angular/common/http';
import { SafeUrlPipe } from './pipes/safe-url.pipe';


@NgModule({
  declarations: [
    PowerbiDashboardComponent,
    SafeUrlPipe
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    PowerbiRoutingModule
  ]
})
export class PowerbiModule { }
