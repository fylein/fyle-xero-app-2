import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ExportSettingGet } from 'src/app/core/models/configuration/export-setting.model';
import { XeroCredentials } from 'src/app/core/models/configuration/xero-connector.model';
import { ExportSettingService } from 'src/app/core/services/configuration/export-setting.service';
import { XeroConnectorService } from 'src/app/core/services/configuration/xero-connector.service';
import { AuthService } from 'src/app/core/services/core/auth.service';
import { WindowService } from 'src/app/core/services/core/window.service';
import { UserService } from 'src/app/core/services/misc/user.service';
import { WorkspaceService } from 'src/app/core/services/workspace/workspace.service';
import { ClickEvent, ConfigurationCtaText, OnboardingState, OnboardingStep, ProgressPhase } from 'src/app/core/models/enum/enum.model';
import { ConfirmationDialog } from 'src/app/core/models/misc/confirmation-dialog.model';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../core/confirmation-dialog/confirmation-dialog.component';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { TenantMapping, TenantMappingPost } from 'src/app/core/models/db/tenant-mapping.model';

@Component({
  selector: 'app-xero-connector',
  templateUrl: './xero-connector.component.html',
  styleUrls: ['./xero-connector.component.scss']
})
export class XeroConnectorComponent implements OnInit, OnDestroy {

  isLoading: boolean = true;

  xeroConnectionInProgress: boolean;

  isXeroConnected: boolean = true;

  xeroTokenExpired: boolean;

  showDisconnectXero: boolean;

  tenantList: DestinationAttribute[];

  isContinueDisabled: boolean = true;

  isOnboarding: boolean = false;

  xeroCompanyName: string | null;

  fyleOrgName: string = this.userService.getUserProfile().org_name;

  windowReference: Window;

  xeroConnectorForm: FormGroup;

  ConfigurationCtaText = ConfigurationCtaText;

  private readonly sessionStartTime = new Date();

  private timeSpentEventRecorded: boolean = false;

  isDisconnectXeroClicked: boolean = false;

  constructor(
    private authService: AuthService,
    private dialog: MatDialog,
    private xeroConnectorService: XeroConnectorService,
    private exportSettingService: ExportSettingService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private trackingService: TrackingService,
    private userService: UserService,
    private windowService: WindowService,
    private workspaceService: WorkspaceService,
    private formBuilder: FormBuilder
  ) {
    this.windowReference = this.windowService.nativeWindow;
    this.xeroConnectorForm = this.formBuilder.group({
      xeroTenant: ['', Validators.required]
    });
  }

  private trackSessionTime(eventState: 'success' | 'navigated'): void {
    const differenceInMs = new Date().getTime() - this.sessionStartTime.getTime();

    this.timeSpentEventRecorded = true;
    this.trackingService.trackTimeSpent(OnboardingStep.CONNECT_XERO, {phase: ProgressPhase.ONBOARDING, durationInSeconds: Math.floor(differenceInMs / 1000), eventState: eventState});
  }

  continueToNextStep(): void {
    if (this.isContinueDisabled) {
      return;
    }
    if (this.xeroConnectorForm.valid && !this.isContinueDisabled) {
      this.xeroConnectionInProgress = true;
      this.isContinueDisabled = true;
      const tenantMappingPayload: TenantMappingPost = {
        tenant_id: this.xeroConnectorForm.value.xeroTenant.id,
        tenant_name: this.xeroConnectorForm.value.xeroTenant.name
      };
      this.xeroConnectorService.postTenantMapping(tenantMappingPayload).subscribe((response:TenantMapping) => {
        this.workspaceService.refreshXeroDimensions().subscribe(() => {
          this.trackingService.onOnboardingStepCompletion(OnboardingStep.CONNECT_XERO, 1);
          this.workspaceService.setOnboardingState(OnboardingState.EXPORT_SETTINGS);
          this.xeroConnectionInProgress = false;
          this.xeroTokenExpired = false;
          this.showOrHideDisconnectXero();
          this.isXeroConnected = true;
          this.xeroCompanyName = response.tenant_name;
          this.trackSessionTime('success');
          this.router.navigate([`/workspaces/onboarding/export_settings`]);
        });
      });
    } else if (!this.isContinueDisabled && this.xeroCompanyName){
      this.trackSessionTime('success');
      this.router.navigate([`/workspaces/onboarding/export_settings`]);
    }
  }

  switchFyleOrg(): void {
    this.authService.logout();
    this.authService.redirectToFyleOAuth();
  }

  connectXero(): void {
    this.authService.redirectToXeroOAuth();
  }

  disconnectXero(): void {
    this.isLoading = true;
    this.xeroConnectorService.revokeXeroConnection(this.workspaceService.getWorkspaceId()).subscribe(() => {
      this.trackingService.onClickEvent(ClickEvent.RECONNECT_XERO, {oldCompanyName: this.xeroCompanyName});
      this.showDisconnectXero = false;
      this.xeroCompanyName = null;
      this.xeroConnectionInProgress = false;
      this.isXeroConnected = false;
      this.isContinueDisabled = true;
      this.isDisconnectXeroClicked = true;
      this.xeroConnectorService.getXeroCredentials(this.workspaceService.getWorkspaceId()).subscribe((xeroCredentials: XeroCredentials) => {
        this.showOrHideDisconnectXero();
      }, (error) => {
        // Token expired
        if ('id' in error.error) {
          // We have a Xero row present in DB
          this.xeroTokenExpired = error.error.is_expired;
          if (this.xeroTokenExpired) {
            this.xeroCompanyName = error.error.company_name;
          }
        }
        this.isContinueDisabled = true;
        this.isXeroConnected = false;
        this.isLoading = false;
      });
    });
  }

  private showOrHideDisconnectXero(): void {
    this.exportSettingService.getExportSettings().subscribe((exportSettings: ExportSettingGet) => {
      // Do nothing
      this.isLoading = false;

      if (!(exportSettings.workspace_general_settings?.reimbursable_expenses_object || exportSettings.workspace_general_settings?.corporate_credit_card_expenses_object)) {
        this.showDisconnectXero = true;
      }
    }, () => {
      // Showing Disconnect Xero button since the customer didn't set up the next step
      this.showDisconnectXero = true;
      this.isLoading = false;
    });
  }

  private showWarningDialog(): void {
    const data: ConfirmationDialog = {
      title: 'Incorrect account selected',
      contents: 'You had previously set up the integration with a different Xero account. Please choose the same to restore the settings',
      primaryCtaText: 'Re connect',
      hideSecondaryCTA: true
    };

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '551px',
      data: data
    });

    dialogRef.afterClosed().subscribe((ctaClicked) => {
      if (ctaClicked) {
        this.router.navigate([`/workspaces/onboarding/landing`]);
      }
    });
  }

  tenantSelected(): void {
    this.isContinueDisabled = false;
  }

  private postXeroCredentials(code: string): void {
    this.xeroConnectorService.connectXero(this.workspaceService.getWorkspaceId(), code).subscribe((xeroCredentials: XeroCredentials) => {
      this.postTenant().then(() => {
        this.showOrHideDisconnectXero();
      this.xeroConnectorService.getTenantMappings().subscribe((tenant: TenantMapping) => {
        this.xeroCompanyName = tenant.tenant_name;
        this.xeroConnectionInProgress = false;
        this.isContinueDisabled = false;
        }, () => {
          this.xeroConnectionInProgress = false;
        });
      })
    }, (error) => {
      const errorMessage = 'message' in error.error ? error.error.message : 'Failed to connect to Xero Tenant. Please try again';
      if (errorMessage === 'Please choose the correct Xero account') {
        this.showWarningDialog();
      } else {
        this.snackBar.open(errorMessage, '', { duration: 7000 });
        this.router.navigate([`/workspaces/onboarding/landing`]);
      }
    });
  }

  private getSettings(): void {
    this.xeroConnectorService.getXeroCredentials(this.workspaceService.getWorkspaceId()).subscribe((xeroCredentials: XeroCredentials) => {
      this.xeroConnectorService.getTenantMappings().subscribe((tenant: TenantMapping) => {
        this.xeroCompanyName = tenant.tenant_name;
        this.isXeroConnected = true;
        this.isContinueDisabled = false;
      },
      () => {
        this.getTenant();
        this.isXeroConnected = false;
        this.isContinueDisabled = true;
      });
      this.showOrHideDisconnectXero();
      this.xeroConnectionInProgress = false;
    }, (error) => {
      // Token expired
      if ('id' in error.error) {
        // We have a Xero row present in DB
        this.xeroTokenExpired = error.error.is_expired;
        if (this.xeroTokenExpired) {
          this.xeroCompanyName = error.error.company_name;
        }
      }

      this.isXeroConnected = false;
      this.isLoading = false;
      this.xeroConnectionInProgress = false;
    });
  }

  private setupPage(): void {
    const code = this.route.snapshot.queryParams.code;
    this.isOnboarding = this.windowReference.location.pathname.includes('onboarding');
    if (code) {
      this.xeroConnectionInProgress = true;
      this.isXeroConnected = false;
      this.isLoading = false;
      this.postXeroCredentials(code);
    } else {
      this.xeroConnectionInProgress = true;
      this.getSettings();
    }
  }

  postTenant(): Promise<DestinationAttribute | void> {
    return this.xeroConnectorService.postXeroTenants().toPromise().then(() => {
      this.getTenant();
    });
  }

  getTenant() {
    this.xeroConnectorService.getXeroTenants().subscribe((tenantList: DestinationAttribute[]) => {
      this.tenantList = tenantList;
    });
  }

  ngOnDestroy(): void {
    if (!this.timeSpentEventRecorded) {
      this.trackSessionTime('navigated');
    }
  }

  ngOnInit(): void {
    this.setupPage();
  }

}
