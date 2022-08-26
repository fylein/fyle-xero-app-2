import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guard/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/workspaces',
    pathMatch: 'full'
  },
  // {
  //   Path: 'workspaces',
  //   LoadChildren: () => import('./integration/integration.module').then(m => m.IntegrationModule),
  //   CanActivate: [AuthGuard]
  // },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'xero_callback',
    loadChildren: () => import('./xero-callback/xero-callback.module').then(m => m.XeroCallbackModule)
  },
  {
    path: '**',
    redirectTo: 'workspaces',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
