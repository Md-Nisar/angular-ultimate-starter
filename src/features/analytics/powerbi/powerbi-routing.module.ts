import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PowerbiDashboardComponent } from './components/powerbi-dashboard/powerbi-dashboard.component';

const routes: Routes = [
  { path: '', component: PowerbiDashboardComponent } // default page for PowerBI
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PowerbiRoutingModule { }
