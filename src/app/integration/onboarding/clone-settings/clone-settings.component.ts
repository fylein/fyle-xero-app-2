import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ExportSettingFormOption } from 'src/app/core/models/configuration/export-setting.model';
import { ProgressPhase } from 'src/app/core/models/enum/enum.model';
import { ConfirmationDialog } from 'src/app/core/models/misc/confirmation-dialog.model';
import { ExportSettingService } from 'src/app/core/services/configuration/export-setting.service';
import { HelperService } from 'src/app/core/services/core/helper.service';

@Component({
  selector: 'app-clone-settings',
  templateUrl: './clone-settings.component.html',
  styleUrls: ['./clone-settings.component.scss']
})
export class CloneSettingsComponent implements OnInit {

  isLoading: boolean;

  cloneSettingsForm: FormGroup;

  autoMapEmployeeTypes: ExportSettingFormOption[] = this.exportSettingService.getAutoMapEmployeeOptions();

  reimbursableExpenseGroupingDateOptions: ExportSettingFormOption[] = this.exportSettingService.getReimbursableExpenseGroupingDateOptions();

  ProgressPhase = ProgressPhase;

  constructor(
    public exportSettingService: ExportSettingService,
    private formBuilder: FormBuilder,
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

  private setupPage(): void {
    this.cloneSettingsForm = this.formBuilder.group({
      reimbursableExpense: [],
      autoMapEmployees: [],
      reimbursableExportDate: [],
      searchOption: []
    });
  }

  ngOnInit(): void {
    this.setupPage();
  }

}
