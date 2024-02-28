import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { forkJoin } from 'rxjs';
import { AdvancedSettingFormOption } from 'src/app/core/models/configuration/advanced-setting.model';
import { CloneSetting, CloneSettingModel } from 'src/app/core/models/configuration/clone-setting.model';
import { ExportSettingFormOption } from 'src/app/core/models/configuration/export-setting.model';
import { ExpenseFieldsFormOption } from 'src/app/core/models/configuration/import-setting.model';
import { DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { MappingSetting } from 'src/app/core/models/db/mapping-setting.model';
import { WorkspaceScheduleEmailOptions } from 'src/app/core/models/db/workspace-schedule.model';
import { ClickEvent, ExportDateType, OnboardingStep, PaymentSyncDirection, ProgressPhase, SimpleSearchPage, SimpleSearchType } from 'src/app/core/models/enum/enum.model';
import { ConfirmationDialog } from 'src/app/core/models/misc/confirmation-dialog.model';
import { ExpenseField } from 'src/app/core/models/misc/expense-field.model';
import { AdvancedSettingService } from 'src/app/core/services/configuration/advanced-setting.service';
import { CloneSettingService } from 'src/app/core/services/configuration/clone-setting.service';
import { ExportSettingService } from 'src/app/core/services/configuration/export-setting.service';
import { ImportSettingService } from 'src/app/core/services/configuration/import-setting.service';
import { HelperService } from 'src/app/core/services/core/helper.service';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';
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

  cccExpenseGroupingDateOptions: ExportSettingFormOption[] = this.exportSettingService.getCCCExpenseGroupingDateOptions();

  chartOfAccountTypesList: string[] = this.importSettingService.getChartOfAccountTypesList();

  paymentSyncOptions: AdvancedSettingFormOption[] = this.advancedSettingService.getPaymentSyncOptions();

  frequencyIntervals: AdvancedSettingFormOption[] = this.advancedSettingService.getFrequencyIntervals();

  adminEmails: WorkspaceScheduleEmailOptions[];

  reimbursableExpenseStateOptions: ExportSettingFormOption[];

  xeroExpenseFields: ExpenseFieldsFormOption[];

  additionalXeroExpenseFields: ExpenseFieldsFormOption[];

  cccExpenseStateOptions: ExportSettingFormOption[];

  fyleExpenseFields: string[];

  bankAccounts: DestinationAttribute[];

  taxCodes: DestinationAttribute[];

  mappingSettings: MappingSetting[];

  isSaveInProgress: boolean = false;

  hoveredIndex: {
    categoryImport: number,
    expenseFieldImport: number,
    taxImport: number,
    customerImport: number,
    supplierImport: number
  } = {
    categoryImport: -1,
    expenseFieldImport: -1,
    taxImport: -1,
    customerImport: -1,
    supplierImport: -1
  };

  ProgressPhase = ProgressPhase;

  SimpleSearchPage = SimpleSearchPage;

  SimpleSearchType = SimpleSearchType;

  cloneSettings: CloneSetting;

  private readonly sessionStartTime = new Date();

  constructor(
    private advancedSettingService: AdvancedSettingService,
    private cloneSettingService: CloneSettingService,
    private exportSettingService: ExportSettingService,
    private formBuilder: FormBuilder,
    public helperService: HelperService,
    private importSettingService: ImportSettingService,
    private router: Router,
    private mappingService: MappingService,
    private snackBar: MatSnackBar,
    private trackingService: TrackingService
  ) { }

  resetConfiguraions(): void {
    const data: ConfirmationDialog = {
      title: 'Are you sure?',
      contents: `By resetting the configuration, you will be configuring each setting individually from the beginning. <br><br>
        Would you like to continue?`,
      primaryCtaText: 'Yes'
    };
    this.trackingService.onClickEvent(ClickEvent.CLONE_SETTINGS_RESET, {page: OnboardingStep.CLONE_SETTINGS});

    this.helperService.openDialogAndSetupRedirection(data, '/workspaces/onboarding/export_settings');
  }

  navigateToPreviousStep(): void {
    this.trackingService.onClickEvent(ClickEvent.CLONE_SETTINGS_BACK, {page: OnboardingStep.CLONE_SETTINGS});
    this.router.navigate([`/workspaces/onboarding/xero_connector`]);
  }

  save(): void {
    if (this.cloneSettingsForm.valid) {
      this.isSaveInProgress = true;
      const customMappingSettings = this.mappingSettings.filter(setting => !setting.import_to_fyle);
      const cloneSettingPayload = CloneSettingModel.constructPayload(this.cloneSettingsForm, customMappingSettings);

      this.cloneSettingService.saveCloneSettings(cloneSettingPayload).subscribe((response) => {
        this.isSaveInProgress = false;
        this.snackBar.open('Cloned settings successfully');
        this.trackingService.onCloneSettingsSave({
          oldState: this.cloneSettings,
          newState: response
        });
        this.trackSessionTime();

        this.router.navigate([`/workspaces/onboarding/done`]);
      }, () => {
        this.isSaveInProgress = false;
        this.snackBar.open('Failed to clone settings');
      });
    }
  }

  disableImportCoa(): void {
    this.cloneSettingsForm.controls.chartOfAccount.setValue(false);
  }

  disableImportCustomer(): void {
    this.cloneSettingsForm.controls.importCustomers.setValue(false);
  }

  disableImportSupplier(): void {
    this.cloneSettingsForm.controls.importSuppliersAsMerchants.setValue(false);
  }

  disableImportTax(): void {
    this.cloneSettingsForm.controls.taxCode.setValue(false);
    this.cloneSettingsForm.controls.defaultTaxCode.clearValidators();
    this.cloneSettingsForm.controls.defaultTaxCode.setValue(null);
  }

  enableTaxImport(): void {
    this.cloneSettingsForm.controls.taxCode.setValue(true);
    this.cloneSettingsForm.controls.defaultTaxCode.setValidators(Validators.required);
  }

  enableAccountImport(): void {
    this.cloneSettingsForm.controls.chartOfAccount.setValue(true);
  }

  addExpenseField(field: ExpenseFieldsFormOption): void {
    this.expenseFields.push(this.formBuilder.group({
      source_field: [field.source_field, Validators.compose([RxwebValidators.unique(), Validators.required])],
      destination_field: [field.destination_field.toUpperCase()],
      disable_import_to_fyle: [field.disable_import_to_fyle],
      import_to_fyle: [field.import_to_fyle],
      source_placeholder: ['']
    }));
    this.expenseFields.markAllAsTouched();
    this.additionalXeroExpenseFields = this.additionalXeroExpenseFields.filter((expenseField) => expenseField.destination_field !== field.destination_field);
  }

  deleteExpenseField(index: number, expenseField: AbstractControl): void {
    this.expenseFields.removeAt(index);
    const additionalField = {
      source_field: '',
      destination_field: expenseField.value.destination_field,
      disable_import_to_fyle: false,
      import_to_fyle: false,
      source_placeholder: ''
    };
    this.additionalXeroExpenseFields.push(additionalField);
  }

  private trackSessionTime(): void {
    const differenceInMs = new Date().getTime() - this.sessionStartTime.getTime();

    this.trackingService.trackTimeSpent(OnboardingStep.CLONE_SETTINGS, { durationInSeconds: Math.floor(differenceInMs / 1000) });
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
    this.cloneSettingsForm?.controls.reimbursableExpense?.setValidators(this.exportSettingService.exportSelectionValidator(this.cloneSettingsForm, true));
    this.cloneSettingsForm?.controls.creditCardExpense?.setValidators(this.exportSettingService.exportSelectionValidator(this.cloneSettingsForm, true));
  }

  private setCustomValidatorsAndWatchers(): void {
    this.setupExportWatchers();

    this.exportSettingService.createReimbursableExpenseWatcher(this.cloneSettingsForm, this.cloneSettings.export_settings);
    this.exportSettingService.createCreditCardExpenseWatcher(this.cloneSettingsForm, this.cloneSettings.export_settings);

    this.setGeneralMappingsValidator();
    this.setupExpenseFieldWatcher();
    this.setupAdditionalEmailsWatcher();
  }

  private setupExpenseFieldWatcher(): void {
    this.importSettingService.patchExpenseFieldEmitter.subscribe((expenseField) => {
      if (expenseField.addSourceField) {
        this.fyleExpenseFields.push(expenseField.source_field);
      }
      this.expenseFields.controls.filter(field => field.value.destination_field === expenseField.destination_field)[0].patchValue(expenseField);
    });
  }

  private setupAdditionalEmailsWatcher(): void {
    this.advancedSettingService.patchAdminEmailsEmitter.subscribe((additionalEmails) => {
      this.adminEmails = additionalEmails;
    });
  }

  openAddemailDialog(): void {
    this.advancedSettingService.openAddemailDialog(this.cloneSettingsForm, this.adminEmails);
  }

  get chartOfAccountTypes() {
    return this.cloneSettingsForm.get('chartOfAccountTypes') as FormArray;
  }

  get expenseFields() {
    return this.cloneSettingsForm.get('expenseFields') as FormArray;
  }

  createExpenseField(destinationType: string): void {
    this.importSettingService.createExpenseField(destinationType, this.mappingSettings);
  }

  private getXeroExpenseFields(xeroAttributes: string[], mappingSettings: MappingSetting[], isCloneSettings: boolean = false, fyleFields: string[] = []): ExpenseFieldsFormOption[] {
    return xeroAttributes.map(attribute => {
      const mappingSetting = mappingSettings.filter((mappingSetting: MappingSetting) => {
        if (mappingSetting.destination_field.toUpperCase() === attribute) {
          if (isCloneSettings) {
            return fyleFields.includes(mappingSetting.source_field.toUpperCase()) ? mappingSetting : false;
          }

          return mappingSetting;
        }

        return false;
      });

      return {
        source_field: mappingSetting.length > 0 ? mappingSetting[0].source_field : '',
        destination_field: attribute,
        import_to_fyle: mappingSetting.length > 0 ? mappingSetting[0].import_to_fyle : false,
        disable_import_to_fyle: false,
        source_placeholder: ''
      };
    });
  }

  private setImportFields(fyleFields: ExpenseField[], xeroFields: ExpenseField[]): void {
    this.fyleExpenseFields = fyleFields.map(field => field.attribute_type);
      // Remove custom mapped Fyle options
      const customMappedFyleFields = this.mappingSettings.filter(setting => !setting.import_to_fyle).map(setting => setting.source_field);
      const customMappedXeroFields = this.mappingSettings.filter(setting => !setting.import_to_fyle).map(setting => setting.destination_field);
      const importedXeroFields = this.cloneSettings.import_settings.mapping_settings.filter(setting => setting.import_to_fyle).map(setting => setting.destination_field);

      if (customMappedFyleFields.length) {
        this.fyleExpenseFields = this.fyleExpenseFields.filter(field => !customMappedFyleFields.includes(field));
      }

      // Remove custom mapped Xero fields
      const xeroAttributes = xeroFields.filter(
        field => !customMappedXeroFields.includes(field.attribute_type)
      );

      this.xeroExpenseFields = this.getXeroExpenseFields(importedXeroFields, this.cloneSettings.import_settings.mapping_settings, true, this.fyleExpenseFields);
      const allExpenseFields = this.importSettingService.getXeroExpenseFields(xeroAttributes, this.cloneSettings.import_settings.mapping_settings, true, this.fyleExpenseFields);

      this.additionalXeroExpenseFields = allExpenseFields.filter((field) => {
        return !this.xeroExpenseFields.some((xeroField) => xeroField.destination_field.toUpperCase() === field.destination_field.toUpperCase());
      });
  }

  private constructChartOfAccountTypes(): FormArray {
    const chartOfAccountTypeFormArray = this.chartOfAccountTypesList.map((type) => this.importSettingService.createChartOfAccountField(type, this.cloneSettings.import_settings.workspace_general_settings.charts_of_accounts));

    return this.formBuilder.array(chartOfAccountTypeFormArray);
  }

  private setupForm(): void {
    const bankAccount = this.bankAccounts.filter(bankAccount => bankAccount.destination_id === this.cloneSettings.export_settings.general_mappings?.bank_account?.id);
    const chartOfAccounts = this.constructChartOfAccountTypes();
    const expenseFieldsFormArray = this.importSettingService.getExpenseFieldsFormArray(this.xeroExpenseFields, false);

    expenseFieldsFormArray.forEach((expenseField) => {
      expenseField.controls.source_field.setValidators([RxwebValidators.unique(), Validators.required]);
    });

    let paymentSync = '';
    if (this.cloneSettings.advanced_settings.workspace_general_settings.sync_fyle_to_xero_payments) {
      paymentSync = PaymentSyncDirection.FYLE_TO_XERO;
    } else if (this.cloneSettings.advanced_settings.workspace_general_settings.sync_xero_to_fyle_payments) {
      paymentSync = PaymentSyncDirection.XERO_TO_FYLE;
    }

    this.cloneSettingsForm = this.formBuilder.group({
      reimbursableExpense: [this.cloneSettings.export_settings.workspace_general_settings.reimbursable_expenses_object],
      autoMapEmployees: [this.cloneSettings.export_settings.workspace_general_settings.auto_map_employees],
      reimbursableExportDate: [this.cloneSettings.export_settings.expense_group_settings.reimbursable_export_date_type],
      cccExportDate: [this.cloneSettings.export_settings.expense_group_settings?.ccc_export_date_type],
      reimbursableExpenseState: [this.cloneSettings.export_settings.expense_group_settings.reimbursable_expense_state],
      creditCardExpense: [this.cloneSettings.export_settings.workspace_general_settings.corporate_credit_card_expenses_object],
      bankAccount: [bankAccount.length ? this.cloneSettings.export_settings.general_mappings.bank_account : null],
      cccExpenseState: [this.cloneSettings.export_settings.expense_group_settings.ccc_expense_state],
      chartOfAccount: [this.cloneSettings.import_settings.workspace_general_settings.import_categories],
      chartOfAccountTypes: chartOfAccounts,
      importSuppliersAsMerchants: [this.cloneSettings.import_settings.workspace_general_settings.import_suppliers_as_merchants],
      importCustomers: [this.cloneSettings.import_settings.workspace_general_settings.import_customers],
      expenseFields: this.formBuilder.array(expenseFieldsFormArray),
      taxCode: [this.cloneSettings.import_settings.workspace_general_settings.import_tax_codes],
      defaultTaxCode: [this.cloneSettings.import_settings.general_mappings?.default_tax_code?.id ? this.cloneSettings.import_settings.general_mappings.default_tax_code : null],
      paymentSync: [paymentSync],
      billPaymentAccount: [this.cloneSettings.advanced_settings.general_mappings?.payment_account],
      exportSchedule: [this.cloneSettings.advanced_settings.workspace_schedules?.enabled ? this.cloneSettings.advanced_settings.workspace_schedules.interval_hours : false],
      exportScheduleFrequency: [this.cloneSettings.advanced_settings.workspace_schedules?.enabled ? this.cloneSettings.advanced_settings.workspace_schedules.interval_hours : null],
      emails: [this.cloneSettings.advanced_settings.workspace_schedules?.emails_selected ? this.cloneSettings.advanced_settings.workspace_schedules?.emails_selected : []],
      addedEmail: [],
      changeAccountingPeriod: [this.cloneSettings.advanced_settings.workspace_general_settings.change_accounting_period],
      autoCreateVendors: [this.cloneSettings.advanced_settings.workspace_general_settings.auto_create_destination_entity],
      autoCreateMerchantDestinationEntity: [this.cloneSettings.advanced_settings.workspace_general_settings.auto_create_merchant_destination_entity ? this.cloneSettings.advanced_settings.workspace_general_settings.auto_create_merchant_destination_entity : false],
      searchOption: []
    });

    this.setCustomValidatorsAndWatchers();

    this.cloneSettingsForm.markAllAsTouched();

    this.isLoading = false;
  }

  private setupPage(): void {
    forkJoin([
      this.cloneSettingService.getCloneSettings(),
      this.mappingService.getGroupedXeroDestinationAttributes(['BANK_ACCOUNT', 'TAX_CODE']),
      this.mappingService.getFyleExpenseFields(),
      this.mappingService.getXeroField(),
      this.mappingService.getMappingSettings(),
      this.advancedSettingService.getWorkspaceAdmins()
    ]).subscribe(responses => {
      this.cloneSettings = responses[0];
      this.bankAccounts = responses[1].BANK_ACCOUNT;
      this.taxCodes = responses[1].TAX_CODE;
      this.mappingSettings = responses[4].results;
      this.adminEmails = this.cloneSettings.advanced_settings.workspace_schedules?.additional_email_options ? this.cloneSettings.advanced_settings.workspace_schedules?.additional_email_options.concat(responses[5]) : responses[5];

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
