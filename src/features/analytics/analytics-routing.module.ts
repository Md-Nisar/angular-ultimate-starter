import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'powerbi',
    loadChildren: () =>
      import('./powerbi/powerbi.module').then(m => m.PowerbiModule),
  },
  { path: '', redirectTo: 'powerbi', pathMatch: 'full' } // default route
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnalyticsRoutingModule { }
