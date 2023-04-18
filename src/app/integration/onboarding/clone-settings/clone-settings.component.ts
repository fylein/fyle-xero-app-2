import { Component, OnInit } from '@angular/core';
import { ConfirmationDialog } from 'src/app/core/models/misc/confirmation-dialog.model';
import { HelperService } from 'src/app/core/services/core/helper.service';

@Component({
  selector: 'app-clone-settings',
  templateUrl: './clone-settings.component.html',
  styleUrls: ['./clone-settings.component.scss']
})
export class CloneSettingsComponent implements OnInit {

  constructor(
    private helperService: HelperService
  ) { }

  private resetConfiguraions(): void {
    const data: ConfirmationDialog = {
      title: 'Are you sure?',
      contents: `By resetting the configuration, you will be configuring each setting individually from the beginning. <br><br>
        Would you like to continue?`,
      primaryCtaText: 'Yes'
    };

    this.helperService.openDialogAndSetupRedirection(data, '/workspaces/onboarding/landing');
  }

  ngOnInit(): void {
  }

}
