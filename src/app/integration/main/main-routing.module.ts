import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent
    // Children: [
    //   {
    //     Path: 'configuration',
    //     LoadChildren: () => import('./configuration/configuration.module').then(m => m.ConfigurationModule)
    //   },
    //   {
    //     Path: 'mapping',
    //     LoadChildren: () => import('./mapping/mapping.module').then(m => m.MappingModule)
    //   },
    //   {
    //     Path: 'export_log',
    //     LoadChildren: () => import('./export-log/export-log.module').then(m => m.ExportLogModule)
    //   },
    //   {
    //     Path: 'dashboard',
    //     LoadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
    //   }
    // ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }