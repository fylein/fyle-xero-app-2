import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { MinimalUser } from '../core/models/db/user.model';
import { Workspace } from '../core/models/db/workspace.model';
import { OnboardingState } from '../core/models/enum/enum.model';
import { StorageService } from '../core/services/core/storage.service';
import { WindowService } from '../core/services/core/window.service';
import { UserService } from '../core/services/misc/user.service';
import { WorkspaceService } from '../core/services/workspace/workspace.service';
import * as Sentry from '@sentry/angular';
import { TrackingService } from '../core/services/integration/tracking.service';
import { AppcuesService } from '../core/services/integration/appcues.service';

@Component({
  selector: 'app-integration',
  templateUrl: './integration.component.html',
  styleUrls: ['./integration.component.scss']
})
export class IntegrationComponent implements OnInit {

  user: MinimalUser;

  isLoading: boolean = true;

  workspace: Workspace;

  windowReference: Window;

  constructor(
    private appcuesService: AppcuesService,
    private router: Router,
    private storageService: StorageService,
    private trackingService: TrackingService,
    private userService: UserService,
    private windowService: WindowService,
    private workspaceService: WorkspaceService
  ) {
    this.windowReference = this.windowService.nativeWindow;
  }

  private navigate(): void {
    const pathName = this.windowReference.location.pathname;
    if (pathName === '/workspaces') {
      const onboardingStateComponentMap = {
        [OnboardingState.CONNECTION]: '/workspaces/onboarding/landing',
        [OnboardingState.TENANT_MAPPING]: '/workspaces/onboarding/xero_connector',
        [OnboardingState.EXPORT_SETTINGS]: '/workspaces/onboarding/export_settings',
        [OnboardingState.IMPORT_SETTINGS]: '/workspaces/onboarding/import_settings',
        [OnboardingState.ADVANCED_CONFIGURATION]: '/workspaces/onboarding/advanced_settings',
        [OnboardingState.COMPLETE]: '/workspaces/main'
      };
      this.router.navigateByUrl(onboardingStateComponentMap[this.workspace.onboarding_state]);
    }
  }

  private getOrCreateWorkspace(): Promise<Workspace> {
    return this.workspaceService.getWorkspaces(this.user.org_id).toPromise().then(workspaces => {
      if (workspaces.length > 0) {
        this.trackingService.onSignIn(this.user.email, workspaces[0].id, workspaces[0].name, workspaces[0].fyle_org_id);
        return workspaces[0];
      }

      return this.workspaceService.createWorkspace().toPromise().then(workspace => {
        this.trackingService.onSignUp(this.user.email, workspace.id, workspace.name, workspace.fyle_org_id);
        return workspace;
      });
    });
  }

  private setupWorkspace(): void {
    this.user = this.userService.getUserProfile();
    this.getOrCreateWorkspace().then((workspace: Workspace) => {
      this.workspace = workspace;
      Sentry.setUser({
        email: this.user.email,
        workspaceId: workspace.id
      });
      const currency = {
        fyle_currency: workspace.fyle_currency,
        xero_currency: workspace.xero_currency
      };
      this.storageService.set('workspaceId', this.workspace.id);
      this.storageService.set('onboardingState', workspace.onboarding_state);
      this.storageService.set('workspaceCreatedAt', workspace.created_at);
      this.storageService.set('currency', currency);
      this.appcuesService.initialiseAppcues();
      this.workspaceService.syncFyleDimensions().subscribe();
      this.workspaceService.syncXeroDimensions().subscribe();
      this.isLoading = false;
      this.navigate();
    });
  }

  ngOnInit(): void {
    this.setupWorkspace();
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        (window as any).Appcues && (window as any).Appcues.page();
      }
    });
  }

}
