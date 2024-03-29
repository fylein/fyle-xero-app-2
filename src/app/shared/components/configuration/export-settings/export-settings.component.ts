import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { DestinationAttribute, GroupedDestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { AutoMapEmployee, ConfigurationCtaText, CorporateCreditCardExpensesObject, ExpenseGroupingFieldOption, ExpenseState, CCCExpenseState, ExportDateType, OnboardingState, OnboardingStep, ProgressPhase, ReimbursableExpensesObject, TenantFieldMapping, UpdateEvent } from 'src/app/core/models/enum/enum.model';
import { ExportSettingGet, ExportSettingFormOption, ExportSettingModel } from 'src/app/core/models/configuration/export-setting.model';
import { ExportSettingService } from 'src/app/core/services/configuration/export-setting.service';
import { HelperService } from 'src/app/core/services/core/helper.service';
import { MappingService } from 'src/app/core/services/misc/mapping.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { WindowService } from 'src/app/core/services/core/window.service';
import { WorkspaceService } from 'src/app/core/services/workspace/workspace.service';
import { ConfirmationDialog } from 'src/app/core/models/misc/confirmation-dialog.model';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../core/confirmation-dialog/confirmation-dialog.component';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';
import { WorkspaceGeneralSetting } from 'src/app/core/models/db/workspace-general-setting.model';
import { ImportSettingModel, ImportSettingPost } from 'src/app/core/models/configuration/import-setting.model';

@Component({
  selector: 'app-export-settings',
  templateUrl: './export-settings.component.html',
  styleUrls: ['./export-settings.component.scss']
})
export class ExportSettingsComponent implements OnInit, OnDestroy {

  isLoading: boolean = true;

  saveInProgress: boolean;

  isOnboarding: boolean = false;

  is_simplify_report_closure_enabled: boolean = false;

  exportSettingsForm: FormGroup;

  exportSettings: ExportSettingGet;

  bankAccounts: DestinationAttribute[];

  cccAccounts: DestinationAttribute[];

  accountsPayables: DestinationAttribute[];

  vendors: DestinationAttribute[];

  expenseAccounts: DestinationAttribute[];

  windowReference: Window;

  autoMapEmployeeTypes: ExportSettingFormOption[] = this.exportSettingService.getAutoMapEmployeeOptions();

  expenseGroupingFieldOptions: ExportSettingFormOption[] = [
    {
      label: 'Report',
      value: ExpenseGroupingFieldOption.CLAIM_NUMBER
    },
    {
      label: 'Payment',
      value: ExpenseGroupingFieldOption.SETTLEMENT_ID
    },
    {
      label: 'Expense',
      value: ExpenseGroupingFieldOption.EXPENSE_ID
    }
  ];

  reimbursableExpenseStateOptions: ExportSettingFormOption[];

  cccExpenseStateOptions: ExportSettingFormOption[];

  reimbursableExpenseGroupingDateOptions: ExportSettingFormOption[] = this.exportSettingService.getReimbursableExpenseGroupingDateOptions();

  cccExpenseGroupingDateOptions: ExportSettingFormOption[] = this.exportSettingService.getCCCExpenseGroupingDateOptions();

  creditCardExportTypes: ExportSettingFormOption[] = [
    {
      label: 'Bank Transaction',
      value: CorporateCreditCardExpensesObject.BANK_TRANSACTION
    }
  ];

  reimbursableExportTypes: ExportSettingFormOption[];

  ConfigurationCtaText = ConfigurationCtaText;

  ProgressPhase = ProgressPhase;

  ReimbursableExpensesObject = ReimbursableExpensesObject;

  CorporateCreditCardExpensesObject = CorporateCreditCardExpensesObject;

  private readonly sessionStartTime = new Date();

  private timeSpentEventRecorded: boolean = false;

  tenantFieldMapping: TenantFieldMapping;

  constructor(
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private exportSettingService: ExportSettingService,
    public helperService: HelperService,
    private mappingService: MappingService,
    private router: Router,
    private snackBar: MatSnackBar,
    private trackingService: TrackingService,
    private windowService: WindowService,
    private workspaceService: WorkspaceService
  ) {
    this.windowReference = this.windowService.nativeWindow;
  }

  getExportType(exportType: ReimbursableExpensesObject | CorporateCreditCardExpensesObject): string {
    const lowerCaseWord = exportType.toLowerCase();

    return lowerCaseWord.charAt(0).toUpperCase() + lowerCaseWord.slice(1);
  }

  generateGroupingLabel(exportSource: 'reimbursable' | 'credit card'): string {
    let exportType: ReimbursableExpensesObject | CorporateCreditCardExpensesObject;
    if (exportSource === 'reimbursable') {
      exportType = this.exportSettingsForm.value.reimbursableExportType;
    } else {
      exportType = this.exportSettingsForm.value.creditCardExportType;
    }

    if (exportType === ReimbursableExpensesObject.PURCHASE_BILL) {
      return 'How should the expenses be grouped?';
    }

    return `How should the expense in ${this.getExportType(exportType)} be grouped?`;
  }

  private setGeneralMappingsValidator(): void {
    this.exportSettingsForm.controls.creditCardExpense.valueChanges.subscribe((isCreditCardExpenseSelected) => {
      if (isCreditCardExpenseSelected) {
        this.exportSettingsForm.controls.bankAccount.setValidators(Validators.required);
      } else {
        this.exportSettingsForm.controls.bankAccount.clearValidators();
        this.exportSettingsForm.controls.bankAccount.updateValueAndValidity();
      }
    });
  }

  showReimbursableAccountsPayableField(): boolean {
    return (this.exportSettingsForm.controls.reimbursableExportType.value === ReimbursableExpensesObject.PURCHASE_BILL);
  }

  private setupExportWatchers(): void {
    this.exportSettingsForm?.controls.reimbursableExpense?.setValidators(this.exportSettingService.exportSelectionValidator(this.exportSettingsForm));
    this.exportSettingsForm?.controls.creditCardExpense?.setValidators(this.exportSettingService.exportSelectionValidator(this.exportSettingsForm));
  }

  private setCustomValidatorsAndWatchers(): void {
    this.setupExportWatchers();

    // Toggles
    this.exportSettingService.createReimbursableExpenseWatcher(this.exportSettingsForm, this.exportSettings);
    this.exportSettingService.createCreditCardExpenseWatcher(this.exportSettingsForm, this.exportSettings);

    this.setGeneralMappingsValidator();
  }

  private getSettingsAndSetupForm(): void {
    this.isOnboarding = this.windowReference.location.pathname.includes('onboarding');
    const destinationAttributes = ['BANK_ACCOUNT'];

    forkJoin([
      this.exportSettingService.getExportSettings(),
      this.mappingService.getGroupedXeroDestinationAttributes(destinationAttributes)
    ]).subscribe(response => {
      this.exportSettings = response[0];
      this.bankAccounts = response[1].BANK_ACCOUNT;
      this.is_simplify_report_closure_enabled = (response[0].workspace_general_settings as WorkspaceGeneralSetting)?.is_simplify_report_closure_enabled;

      this.reimbursableExpenseStateOptions = this.exportSettingService.getReimbursableExpenseStateOptions(this.is_simplify_report_closure_enabled);
      this.cccExpenseStateOptions = this.exportSettingService.getCCCExpenseStateOptions(this.is_simplify_report_closure_enabled);
      this.setupForm();
    });
  }

  private setupForm(): void {
    this.exportSettingsForm = this.formBuilder.group({
      reimbursableExpenseState: [this.exportSettings.expense_group_settings?.reimbursable_expense_state],
      reimbursableExpense: [this.exportSettings.workspace_general_settings?.reimbursable_expenses_object ? true : false],
      reimbursableExportType: [this.exportSettings.workspace_general_settings?.reimbursable_expenses_object ? this.exportSettings.workspace_general_settings?.reimbursable_expenses_object : ReimbursableExpensesObject.PURCHASE_BILL],
      reimbursableExportDate: [this.exportSettings.expense_group_settings?.reimbursable_export_date_type],
      cccExpenseState: [this.exportSettings.expense_group_settings?.ccc_expense_state],
      creditCardExpense: [this.exportSettings.workspace_general_settings?.corporate_credit_card_expenses_object ? true : false],
      cccExportDate: [this.exportSettings.expense_group_settings?.ccc_export_date_type],
      creditCardExportType: [this.exportSettings.workspace_general_settings?.corporate_credit_card_expenses_object ? this.exportSettings.workspace_general_settings?.corporate_credit_card_expenses_object : CorporateCreditCardExpensesObject.BANK_TRANSACTION],
      bankAccount: [this.exportSettings.general_mappings?.bank_account?.id ? this.exportSettings.general_mappings?.bank_account : null],
      autoMapEmployees: [this.exportSettings.workspace_general_settings?.auto_map_employees],
      searchOption: []
    });

    this.setCustomValidatorsAndWatchers();
    this.isLoading = false;
  }

  navigateToPreviousStep(): void {
    this.router.navigate([`/workspaces/onboarding/xero_connector`]);
  }

  private updateExportSettings(): boolean {
    if (this.exportSettings?.workspace_general_settings) {
      return (this.exportSettings?.workspace_general_settings?.reimbursable_expenses_object !== null && this.exportSettings?.workspace_general_settings?.corporate_credit_card_expenses_object === null && this.exportSettingsForm.controls.creditCardExpense.value && this.exportSettingsForm.controls.reimbursableExpense.value) || (this.exportSettings?.workspace_general_settings?.corporate_credit_card_expenses_object !== null && this.exportSettings?.workspace_general_settings?.reimbursable_expenses_object === null && this.exportSettingsForm.controls.reimbursableExpense.value && this.exportSettingsForm.controls.creditCardExpense.value) || (this.exportSettingsForm.controls.reimbursableExpense.value && !this.exportSettingsForm.controls.creditCardExpense.value && this.exportSettings?.workspace_general_settings?.corporate_credit_card_expenses_object !== null && this.exportSettings?.workspace_general_settings?.reimbursable_expenses_object === null) || (this.exportSettings?.workspace_general_settings?.reimbursable_expenses_object !== null && !this.exportSettingsForm.controls.reimbursableExpense.value && this.exportSettingsForm.controls.creditCardExpense.value && this.exportSettings?.workspace_general_settings?.corporate_credit_card_expenses_object === null);
    }
    return false;
  }

  private advancedSettingAffected(): boolean {
    if (this.updateExportSettings()) {
      return true;
    }

    return false;
  }

  private replaceContentBasedOnConfiguration(updatedConfiguration: string, existingConfiguration: string, exportType: string): string {
    const configurationUpdate = `You have changed the export type of $exportType expense from <b>$existingExportType</b> to <b>$updatedExportType</b>,
    which would impact a few configurations in the <b>Advanced settings</b>. <br><br>Please revisit the <b>Advanced settings</b> to check and enable the
    features that could help customize and automate your integration workflows.`;

    const newConfiguration = `You have <b>selected a new export type</b> for the $exportType expense, which would impact a few configurations
      in the <b>Advanced settings</b>. <br><br>Please revisit the <b>Advanced settings</b> to check and enable the features that could help customize and
      automate your integration workflows.`;

    if (updatedConfiguration !== 'None' && existingConfiguration !== 'None') {
      return configurationUpdate.replace('$exportType', exportType).replace('$existingExportType', existingConfiguration.toLowerCase().replace(/^\w/, (c: string) => c.toUpperCase())).replace('$updatedExportType', updatedConfiguration.toLowerCase().replace(/^\w/, (c: string) => c.toUpperCase()));
    }

    return newConfiguration.replace('$exportType', exportType);
  }

  private constructWarningMessage(): string {
    let content: string = '';
    const existingReimbursableExportType = this.exportSettings.workspace_general_settings?.reimbursable_expenses_object ? this.exportSettings.workspace_general_settings.reimbursable_expenses_object : 'None';
    const existingCorporateCardExportType = this.exportSettings.workspace_general_settings?.corporate_credit_card_expenses_object ? this.exportSettings.workspace_general_settings.corporate_credit_card_expenses_object : 'None';
    const updatedReimbursableExportType = this.exportSettingsForm.value.reimbursableExpense ? this.exportSettingsForm.value.reimbursableExportType : 'None';
    const updatedCorporateCardExportType = this.exportSettingsForm.value.creditCardExpense ? this.exportSettingsForm.value.creditCardExportType : 'None';
    if (updatedReimbursableExportType !== existingReimbursableExportType && existingCorporateCardExportType === updatedCorporateCardExportType) {
      content = this.replaceContentBasedOnConfiguration(updatedReimbursableExportType, existingReimbursableExportType, 'reimbursable');
    } else if (existingCorporateCardExportType !== updatedCorporateCardExportType && updatedReimbursableExportType === existingReimbursableExportType) {
      content = this.replaceContentBasedOnConfiguration(updatedCorporateCardExportType, existingCorporateCardExportType, 'credit card');
    } else if (existingCorporateCardExportType !== updatedCorporateCardExportType && updatedReimbursableExportType === ReimbursableExpensesObject.PURCHASE_BILL && updatedCorporateCardExportType !== CorporateCreditCardExpensesObject.BANK_TRANSACTION) {
      content = this.replaceContentBasedOnConfiguration(updatedReimbursableExportType, existingReimbursableExportType, 'reimbursable');
    } else if (updatedReimbursableExportType !== existingReimbursableExportType && updatedCorporateCardExportType === CorporateCreditCardExpensesObject.BANK_TRANSACTION && updatedReimbursableExportType !== ReimbursableExpensesObject.PURCHASE_BILL) {
      content = this.replaceContentBasedOnConfiguration(updatedCorporateCardExportType, existingCorporateCardExportType, 'credit card');
    }

    return content;
  }

  private showConfirmationDialog(): void {
    const content = this.constructWarningMessage();

    const data: ConfirmationDialog = {
      title: 'Change in Configuration',
      contents: `${content}<br><br>Would you like to continue?`,
      primaryCtaText: 'Continue'
    };

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '551px',
      data: data
    });

    dialogRef.afterClosed().subscribe((ctaClicked) => {
      if (ctaClicked) {
        this.constructPayloadAndSave();
      }
    });
  }

  private getPhase(): ProgressPhase {
    return this.isOnboarding ? ProgressPhase.ONBOARDING : ProgressPhase.POST_ONBOARDING;
  }

  private trackSessionTime(eventState: 'success' | 'navigated'): void {
    const differenceInMs = new Date().getTime() - this.sessionStartTime.getTime();

    this.timeSpentEventRecorded = true;
    this.trackingService.trackTimeSpent(OnboardingStep.EXPORT_SETTINGS, { phase: this.getPhase(), durationInSeconds: Math.floor(differenceInMs / 1000), eventState: eventState });
  }

  private constructPayloadAndSave(): void {
    this.saveInProgress = true;
    const exportSettingPayload = ExportSettingModel.constructPayload(this.exportSettingsForm);
    this.exportSettingService.postExportSettings(exportSettingPayload).subscribe((response: ExportSettingGet) => {
      if (this.workspaceService.getOnboardingState() === OnboardingState.EXPORT_SETTINGS) {
        this.trackingService.onOnboardingStepCompletion(OnboardingStep.EXPORT_SETTINGS, 2, exportSettingPayload);
      } else {
        this.trackingService.onUpdateEvent(
          UpdateEvent.EXPORT_SETTINGS,
          {
            phase: this.getPhase(),
            oldState: this.exportSettings,
            newState: response
          }
        );
      }

      this.saveInProgress = false;
      this.snackBar.open('Export settings saved successfully');
      this.trackSessionTime('success');
      if (this.isOnboarding) {
        this.workspaceService.setOnboardingState(OnboardingState.IMPORT_SETTINGS);
        this.router.navigate([`/workspaces/onboarding/import_settings`]);
      } else if (this.advancedSettingAffected()) {
        this.router.navigate(['/workspaces/main/configuration/advanced_settings']);
      } else {
        this.mappingService.refreshMappingPages();
        this.router.navigate(['/workspaces/main/dashboard']);
      }
    }, () => {
      this.saveInProgress = false;
      this.snackBar.open('Error saving export settings, please try again later');
    });
  }

  save(): void {
    if (this.exportSettingsForm.valid && !this.saveInProgress) {
      if (this.advancedSettingAffected()) {
        // Show warning dialog
        this.showConfirmationDialog();
        return;
      }
      this.constructPayloadAndSave();
    }
  }

  ngOnDestroy(): void {
    if (!this.timeSpentEventRecorded) {
      this.trackSessionTime('navigated');
    }
  }

  ngOnInit(): void {
    this.getSettingsAndSetupForm();
  }

}
