import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { CloneSetting } from 'src/app/core/models/configuration/clone-setting.model';
import { ExportSettingFormOption } from 'src/app/core/models/configuration/export-setting.model';
import { ExpenseFieldsFormOption } from 'src/app/core/models/configuration/import-setting.model';
import { DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { ProgressPhase } from 'src/app/core/models/enum/enum.model';
import { ConfirmationDialog } from 'src/app/core/models/misc/confirmation-dialog.model';
import { ExpenseField } from 'src/app/core/models/misc/expense-field.model';
import { CloneSettingService } from 'src/app/core/services/configuration/clone-setting.service';
import { ExportSettingService } from 'src/app/core/services/configuration/export-setting.service';
import { ImportSettingService } from 'src/app/core/services/configuration/import-setting.service';
import { HelperService } from 'src/app/core/services/core/helper.service';
import { MappingService } from 'src/app/core/services/misc/mapping.service';

@Component({
  selector: 'app-clone-settings',
  templateUrl: './clone-settings.component.html',
  styleUrls: ['./clone-settings.component.scss']
})
export class CloneSettingsComponent implements OnInit {

  isLoading: boolean = true;

  cloneSettingsForm: FormGroup;

  autoMapEmployeeTypes: ExportSettingFormOption[] = this.exportSettingService.getAutoMapEmployeeOptions();

  reimbursableExpenseGroupingDateOptions: ExportSettingFormOption[] = this.exportSettingService.getReimbursableExpenseGroupingDateOptions();

  chartOfAccountTypesList: string[] = this.importSettingService.getChartOfAccountTypesList();

  reimbursableExpenseStateOptions: ExportSettingFormOption[];

  xeroExpenseFields: ExpenseFieldsFormOption[];

  cccExpenseStateOptions: ExportSettingFormOption[];

  fyleExpenseFields: string[];

  customMappedFyleFields: string[];

  bankAccounts: DestinationAttribute[];

  ProgressPhase = ProgressPhase;

  cloneSettings: CloneSetting;

  constructor(
    private cloneSettingService: CloneSettingService,
    private exportSettingService: ExportSettingService,
    private formBuilder: FormBuilder,
    private helperService: HelperService,
    private importSettingService: ImportSettingService,
    private mappingService: MappingService
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

  private setGeneralMappingsValidator(): void {
    if (this.cloneSettings.export_settings.workspace_general_settings.corporate_credit_card_expenses_object) {
      this.cloneSettingsForm.controls.bankAccount.setValidators(Validators.required);
    }

    this.cloneSettingsForm.controls.creditCardExpense.valueChanges.subscribe((isCreditCardExpenseSelected) => {
      if (isCreditCardExpenseSelected) {
        this.cloneSettingsForm.controls.bankAccount.setValidators(Validators.required);
      } else {
        this.cloneSettingsForm.controls.bankAccount.clearValidators();
        this.cloneSettingsForm.controls.bankAccount.updateValueAndValidity();
      }
    });
  }

  private setupExportWatchers(): void {
    this.cloneSettingsForm?.controls.reimbursableExpense?.setValidators(this.exportSettingService.exportSelectionValidator(this.cloneSettingsForm));
    this.cloneSettingsForm?.controls.creditCardExpense?.setValidators(this.exportSettingService.exportSelectionValidator(this.cloneSettingsForm));
  }

  private setCustomValidatorsAndWatchers(): void {
    this.setupExportWatchers();
    this.setGeneralMappingsValidator();
  }

  get chartOfAccountTypes() {
    return this.cloneSettingsForm.get('chartOfAccountTypes') as FormArray;
  }

  get expenseFields() {
    return this.cloneSettingsForm.get('expenseFields') as FormArray;
  }

  private setImportFields(fyleFields: ExpenseField[], xeroFields: ExpenseField[]): void {
    this.fyleExpenseFields = fyleFields.map(field => field.attribute_type);
      // Remove custom mapped Fyle options
      this.customMappedFyleFields = this.cloneSettings.import_settings.mapping_settings.filter(setting => !setting.import_to_fyle).map(setting => setting.source_field);
      const customMappedXeroFields = this.cloneSettings.import_settings.mapping_settings.filter(setting => !setting.import_to_fyle).map(setting => setting.destination_field);
      if (this.customMappedFyleFields.length) {
        this.fyleExpenseFields = this.fyleExpenseFields.filter(field => !this.customMappedFyleFields.includes(field));
      }
      // Remove custom mapped Xero fields
      const xeroAttributes = xeroFields.filter(
        field => !customMappedXeroFields.includes(field.attribute_type)
      );
      this.xeroExpenseFields = this.importSettingService.getXeroExpenseFields(xeroAttributes, this.cloneSettings.import_settings.mapping_settings);
  }

  private setupForm(): void {
    const bankAccount = this.bankAccounts.filter(bankAccount => bankAccount.destination_id === this.cloneSettings.export_settings.general_mappings?.bank_account?.id);
    const chartOfAccountTypeFormArray = this.chartOfAccountTypesList.map((type) => this.importSettingService.createChartOfAccountField(type, this.cloneSettings.import_settings.workspace_general_settings.charts_of_accounts));
    const expenseFieldsFormArray = this.importSettingService.getExpenseFieldsFormArray(this.xeroExpenseFields, false);

    this.cloneSettingsForm = this.formBuilder.group({
      reimbursableExpense: [this.cloneSettings.export_settings.workspace_general_settings.reimbursable_expenses_object],
      autoMapEmployees: [this.cloneSettings.export_settings.workspace_general_settings.auto_map_employees],
      reimbursableExportDate: [this.cloneSettings.export_settings.expense_group_settings.reimbursable_export_date_type],
      reimbursableExpenseState: [this.cloneSettings.export_settings.expense_group_settings.reimbursable_expense_state],
      creditCardExpense: [this.cloneSettings.export_settings.workspace_general_settings.corporate_credit_card_expenses_object],
      bankAccount: [bankAccount.length ? this.cloneSettings.export_settings.general_mappings.bank_account : null],
      cccExpenseState: [this.cloneSettings.export_settings.expense_group_settings.ccc_expense_state],
      chartOfAccountTypes: this.formBuilder.array(chartOfAccountTypeFormArray),
      expenseFields: this.formBuilder.array(expenseFieldsFormArray),
      searchOption: []
    });

    this.setCustomValidatorsAndWatchers();
    this.isLoading = false;
  }

  private setupPage(): void {
    forkJoin([
      this.cloneSettingService.getCloneSettings(),
      this.mappingService.getGroupedXeroDestinationAttributes(['BANK_ACCOUNT']),
      this.mappingService.getFyleExpenseFields(),
      this.mappingService.getXeroField()
    ]).subscribe(responses => {
      this.cloneSettings = responses[0];
      this.bankAccounts = responses[1].BANK_ACCOUNT;

      this.reimbursableExpenseStateOptions = this.exportSettingService.getReimbursableExpenseStateOptions(this.cloneSettings.export_settings.workspace_general_settings.is_simplify_report_closure_enabled);
      this.cccExpenseStateOptions = this.exportSettingService.getCCCExpenseStateOptions(this.cloneSettings.export_settings.workspace_general_settings.is_simplify_report_closure_enabled);

      this.setImportFields(responses[2], responses[3]);
      this.setupForm();
    });
  }

  ngOnInit(): void {
    this.setupPage();
  }

}
