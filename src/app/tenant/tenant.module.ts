import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TenantListComponent } from './tenant-list/tenant-list.component';
import { TenantRoutingModule } from './tenant-routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [TenantListComponent],
  imports: [CommonModule, SharedModule, TenantRoutingModule]
})
export class TenantModule {}
