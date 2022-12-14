import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ClickEvent, ProgressPhase, RedirectLink } from 'src/app/core/models/enum/enum.model';
import { HelperService } from 'src/app/core/services/core/helper.service';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';
import { WorkspaceService } from 'src/app/core/services/workspace/workspace.service';

@Component({
  selector: 'app-configuration-step-header-section',
  templateUrl: './configuration-step-header-section.component.html',
  styleUrls: ['./configuration-step-header-section.component.scss']
})
export class ConfigurationStepHeaderSectionComponent implements OnInit {

  headerText: string;

  contentText: string;

  isStepOptional: boolean;

  activePage: string | undefined;

  helpArticleLink: RedirectLink;

  @Input() showSyncButton: boolean;

  @Input() phase: ProgressPhase;

  constructor(
    public helperService: HelperService,
    private router: Router,
    private snackBar: MatSnackBar,
    private trackingService: TrackingService,
    private workspaceService: WorkspaceService
  ) { }

  refreshXeroDimensions(): void {
    this.trackingService.onClickEvent(ClickEvent.SYNC_DIMENSION, {phase: this.phase});
    this.workspaceService.refreshXeroDimensions().subscribe();
    this.snackBar.open('Refreshing data dimensions from Xero...');
  }

  private setupContent(): void {
    const route = this.router.url;
    if (route.includes('code')) {
      this.activePage = 'xero_connector';
    } else {
      this.activePage = route.split('/').pop();
    }
    switch (this.activePage) {
      case 'xero_connector':
        this.headerText = 'Connect to Xero Tenant';
        this.contentText = 'Connect to the Xero Tenant from which you would like to import and export data. The Fyle org and Xero Tenant cannot be changed once the configuration steps are complete.';
        this.helpArticleLink = RedirectLink.CONFIGURATION_XERO_CONNECTOR;
        break;
      case 'export_settings':
        this.headerText = 'Export Settings';
        this.contentText = 'In this section, you will configure how and when expenses from Fyle can be exported to Xero.';
        this.helpArticleLink = RedirectLink.CONFIGURATION_EXPORT_SETTING;
        break;
      case 'import_settings':
        this.headerText = 'Import Settings';
        this.contentText = 'You can Enable all the data that you wish to import from Xero. All the imported data from Xero would be available in Fyle under Admin Setting > Organization.';
        this.helpArticleLink = RedirectLink.CONFIGURATION_IMPORT_SETTING;
        break;
      case 'advanced_settings':
        this.headerText = 'Advanced Settings';
        this.isStepOptional = true;
        this.contentText = 'This section contains settings to automate and customize your expense export.';
        this.helpArticleLink = RedirectLink.CONFIGURATION_ADVANCED_SETTING;
        break;
    }
  }

  ngOnInit(): void {
    this.setupContent();
  }

}
