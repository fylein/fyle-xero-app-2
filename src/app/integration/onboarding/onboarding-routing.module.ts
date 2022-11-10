import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TenantGuard } from 'src/app/core/guard/tenant.guard';
import { WorkspacesGuard } from 'src/app/core/guard/workspaces.guard';
import { OnboardingAdvancedSettingsComponent } from './onboarding-advanced-settings/onboarding-advanced-settings.component';
import { OnboardingDoneComponent } from './onboarding-done/onboarding-done.component';
import { OnboardingExportSettingsComponent } from './onboarding-export-settings/onboarding-export-settings.component';
import { OnboardingImportSettingsComponent } from './onboarding-import-settings/onboarding-import-settings.component';
import { OnboardingLandingComponent } from './onboarding-landing/onboarding-landing.component';
import { OnboardingXeroConnectorComponent } from './onboarding-xero-connector/onboarding-xero-connector.component';
import { OnboardingComponent } from './onboarding.component';


const routes: Routes = [
  {
    path: 'landing',
    component: OnboardingLandingComponent
  },
  {
    path: '',
    component: OnboardingComponent,
    children: [
      {
        path: 'export_settings',
        component: OnboardingExportSettingsComponent,
        canActivate: [WorkspacesGuard, TenantGuard]
      },
      {
        path: 'xero_connector',
        component: OnboardingXeroConnectorComponent
      },
      {
        path: 'import_settings',
        component: OnboardingImportSettingsComponent,
        canActivate: [WorkspacesGuard]
      },
      {
        path: 'advanced_settings',
        component: OnboardingAdvancedSettingsComponent,
        canActivate: [WorkspacesGuard]
      },
      {
        path: 'done',
        component: OnboardingDoneComponent,
        canActivate: [WorkspacesGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OnboardingRoutingModule { }
