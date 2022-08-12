// Import { NgModule } from '@angular/core';
// Import { RouterModule, Routes } from '@angular/router';
// Import { AuthGuard } from './core/guard/auth.guard';

// Const routes: Routes = [
//   {
//     Path: '',
//     RedirectTo: '/workspaces',
//     PathMatch: 'full'
//   },
//   {
//     Path: 'workspaces',
//     LoadChildren: () => import('./integration/integration.module').then(m => m.IntegrationModule),
//     CanActivate: [AuthGuard]
//   },
//   {
//     Path: 'auth',
//     LoadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
//   },
//   {
//     Path: 'xero_callback',
//     LoadChildren: () => import('./xero-callback/xero-callback.module').then(m => m.XeroCallbackModule)
//   },
//   {
//     Path: '**',
//     RedirectTo: 'workspaces',
//     PathMatch: 'full'
//   }
// ];

// @NgModule({
//   Imports: [RouterModule.forRoot(routes)],
//   Exports: [RouterModule]
// })
// Export class AppRoutingModule { }
