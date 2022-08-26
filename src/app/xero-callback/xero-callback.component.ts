import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { OnboardingState } from '../core/models/enum/enum.model';
import { ConfirmationDialog } from '../core/models/misc/confirmation-dialog.model';
import { XeroConnectorService } from '../core/services/configuration/xero-connector.service';
import { WorkspaceService } from '../core/services/workspace/workspace.service';
import { ConfirmationDialogComponent } from '../shared/components/core/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-xero-callback',
  templateUrl: './xero-callback.component.html',
  styleUrls: ['./xero-callback.component.scss']
})
export class XeroCallbackComponent implements OnInit {

  constructor(
    private dialog: MatDialog,
    private xeroConnectorService: XeroConnectorService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private workspaceService: WorkspaceService
  ) { }

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

  private postXeroCredentials(code: string, realmId: string): void {
    this.xeroConnectorService.connectXero(this.workspaceService.getWorkspaceId(), code).subscribe(() => {
      this.router.navigate([`/workspaces/main/dashboard`]);
    }, (error: { error: { message: any; }; }) => {
      const errorMessage = 'message' in error.error ? error.error.message : 'Failed to connect to Xero. Please try again';
      if (errorMessage === 'Please choose the correct Xero account') {
        this.showWarningDialog();
      } else {
        this.snackBar.open(errorMessage, '', { duration: 7000 });
        this.router.navigate([`/workspaces/onboarding/landing`]);
      }
    });
  }

  private checkProgressAndRedirect(): void {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        code: this.route.snapshot.queryParams.code,
        realmId: this.route.snapshot.queryParams.realmId
      }
    };

    const onboardingState: OnboardingState = this.workspaceService.getOnboardingState();

    if (onboardingState !== OnboardingState.COMPLETE) {
      this.router.navigate(['workspaces/onboarding/xero_connector'], navigationExtras);
    } else {
      this.postXeroCredentials(this.route.snapshot.queryParams.code, this.route.snapshot.queryParams.realmId);
    }
  }

  ngOnInit(): void {
    this.checkProgressAndRedirect();
  }
}
