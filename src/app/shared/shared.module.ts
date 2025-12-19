import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { DataTableComponent } from './data-table/data-table.component';

@NgModule({
  declarations: [DataTableComponent],
  imports: [CommonModule, NgxDatatableModule],
  exports: [DataTableComponent]
})
export class SharedModule { }
