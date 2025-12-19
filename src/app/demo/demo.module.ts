import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DemoRoutingModule } from './demo-routing.module';
import { DatatableDemoComponent } from './datatable-demo/datatable-demo.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [DatatableDemoComponent],
  imports: [CommonModule, SharedModule, DemoRoutingModule]
})
export class DemoModule { }
