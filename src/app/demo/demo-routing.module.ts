import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DatatableDemoComponent } from './datatable-demo/datatable-demo.component';

const routes: Routes = [
  { path: 'data-table', component: DatatableDemoComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DemoRoutingModule {}
