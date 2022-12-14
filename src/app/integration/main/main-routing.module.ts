import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'configuration',
        loadChildren: () => import('./configuration/configuration.module').then(m => m.ConfigurationModule)
      },
      {
        path: 'mapping',
        loadChildren: () => import('./mapping/mapping.module').then(m => m.MappingModule)
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'export_log',
        loadChildren: () => import('./export-log/export-log.module').then(m => m.ExportLogModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
