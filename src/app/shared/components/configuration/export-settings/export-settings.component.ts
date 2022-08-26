import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { ConfigurationCtaText, CorporateCreditCardExpensesObject, ExpenseGroupingFieldOption, ExpenseState, ExportDateType, OnboardingState, OnboardingStep, ProgressPhase, ReimbursableExpensesObject, TenantFieldMapping, UpdateEvent } from 'src/app/core/models/enum/enum.model';
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

@Component({
  selector: 'app-export-settings',
  templateUrl: './export-settings.component.html',
  styleUrls: ['./export-settings.component.scss']
})
export class ExportSettingsComponent implements OnInit, OnDestroy {

  isLoading: boolean = true;

  saveInProgress: boolean;

  isOnboarding: boolean = false;

  exportSettingsForm: FormGroup;

  exportSettings: ExportSettingGet;

  bankAccounts: DestinationAttribute[];

  cccAccounts: DestinationAttribute[];

  accountsPayables: DestinationAttribute[];

  vendors: DestinationAttribute[];

  expenseAccounts: DestinationAttribute[];

  windowReference: Window;

  expenseStateOptions: ExportSettingFormOption[] = [
    {
      value: ExpenseState.PAYMENT_PROCESSING,
      label: 'Payment Processing'
    },
    {
      value: ExpenseState.PAID,
      label: 'Paid'
    }
  ];

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

  reimbursableExpenseGroupingDateOptions: ExportSettingFormOption[] = [
    {
      label: 'Current Date',
      value: ExportDateType.CURRENT_DATE
    },
    {
      label: 'Verification Date',
      value: ExportDateType.VERIFIED_AT
    },
    {
      label: 'Spend Date',
      value: ExportDateType.SPENT_AT
    },
    {
      label: 'Approval Date',
      value: ExportDateType.APPROVED_AT
    },
    {
      label: 'Last Spend Date',
      value: ExportDateType.LAST_SPENT_AT
    }
  ];

  cccExpenseGroupingDateOptions: ExportSettingFormOption[] = this.reimbursableExpenseGroupingDateOptions.concat();

  creditCardExportTypes: ExportSettingFormOption[] = [
    {
      label: 'Bank Transaction',
      value: CorporateCreditCardExpensesObject.BANK_TRANSACTION
    }
  ];

  reimbursableExportTypes: ExportSettingFormOption[];

  ConfigurationCtaText = ConfigurationCtaText;

  ProgressPhase = ProgressPhase;

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

  // GetReimbursableExportTypes(employeeFieldMapping: string | number): ExportSettingFormOption[] {
  //   Return {
  //     TENANT: [
  //       {
  //         Label: 'Tenant',
  //         Value: ReimbursableExpensesObject.PURCHASE_BILL
  //       },
  //     ]
  //   }[employeeFieldMapping];
  // }

  private createReimbursableExpenseWatcher(): void {
    this.exportSettingsForm.controls.reimbursableExpense.valueChanges.subscribe((isReimbursableExpenseSelected) => {
      if (isReimbursableExpenseSelected) {
        this.exportSettingsForm.controls.reimbursableExportType.setValidators(Validators.required);
        this.exportSettingsForm.controls.reimbursableExportDate.setValidators(Validators.required);
      } else {
        this.exportSettingsForm.controls.reimbursableExportType.clearValidators();
        this.exportSettingsForm.controls.reimbursableExportDate.clearValidators();
        this.exportSettingsForm.controls.reimbursableExportType.setValue(null);
        this.exportSettingsForm.controls.reimbursableExportDate.setValue(null);
      }

      this.setGeneralMappingsValidator();
    });
  }

  private createCreditCardExpenseWatcher(): void {
    this.exportSettingsForm.controls.creditCardExpense.valueChanges.subscribe((isCreditCardExpenseSelected) => {
      if (isCreditCardExpenseSelected) {
        this.exportSettingsForm.controls.creditCardExportType.setValidators(Validators.required);
        this.exportSettingsForm.controls.creditCardExportDate.setValidators(Validators.required);
      } else {
        this.exportSettingsForm.controls.creditCardExportType.clearValidators();
        this.exportSettingsForm.controls.creditCardExportDate.clearValidators();
        this.exportSettingsForm.controls.creditCardExportType.setValue(null);
        this.exportSettingsForm.controls.creditCardExportDate.setValue(null);
      }

      this.setGeneralMappingsValidator();
    });
  }


  private createReimbursableExportTypeWatcher(): void {
    this.exportSettingsForm.controls.reimbursableExportType.valueChanges.subscribe(() => {
      this.setGeneralMappingsValidator();
    });
  }

  private createCreditCardExportTypeWatcher(): void {
    // This.restrictExpenseGroupSetting(this.exportSettings.workspace_general_settings.corporate_credit_card_expenses_object);
    this.exportSettingsForm.controls.creditCardExportType.valueChanges.subscribe((creditCardExportType: string) => {
      this.setGeneralMappingsValidator();
      // This.restrictExpenseGroupSetting(creditCardExportType);
    });
  }

  private exportSelectionValidator(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: object} | null => {
      let forbidden = true;
      if (this.exportSettingsForm && this.exportSettingsForm.value.expenseState) {
        if (typeof control.value === 'boolean') {
          if (control.value) {
            forbidden = false;
          } else {
            if (control.parent?.get('reimbursableExpense')?.value || control.parent?.get('creditCardExpense')?.value) {
              forbidden = false;
            }
          }
        } else if ((control.value === ExpenseState.PAID || control.value === ExpenseState.PAYMENT_PROCESSING) && (control.parent?.get('reimbursableExpense')?.value || control.parent?.get('creditCardExpense')?.value)) {
          forbidden = false;
        }

        if (!forbidden) {
          control.parent?.get('expenseState')?.setErrors(null);
          control.parent?.get('reimbursableExpense')?.setErrors(null);
          control.parent?.get('creditCardExpense')?.setErrors(null);
          return null;
        }
      }

      return {
        forbiddenOption: {
          value: control.value
        }
      };
    };
  }

  showBankAccountField(): boolean {
    return this.tenantFieldMapping === TenantFieldMapping.TENANT && this.exportSettingsForm.controls.reimbursableExportType.value && this.exportSettingsForm.controls.reimbursableExportType.value === ReimbursableExpensesObject.PURCHASE_BILL;
  }

  showCreditCardAccountField(): boolean {
    return this.exportSettingsForm.controls.creditCardExportType.value && this.exportSettingsForm.controls.creditCardExportType.value !== CorporateCreditCardExpensesObject.BANK_TRANSACTION;
  }

  showDebitCardAccountField(): boolean {
    return this.exportSettingsForm.controls.creditCardExportType.value && this.exportSettingsForm.controls.creditCardExportType.value === CorporateCreditCardExpensesObject.BANK_TRANSACTION;
  }

  showDefaultCreditCardVendorField(): boolean {
    return this.exportSettingsForm.controls.creditCardExportType.value === CorporateCreditCardExpensesObject.BANK_TRANSACTION;
  }

  showExpenseAccountField(): boolean {
    return this.exportSettingsForm.controls.reimbursableExportType.value === ReimbursableExpensesObject.PURCHASE_BILL;
  }

  showReimbursableAccountsPayableField(): boolean {
    return (this.exportSettingsForm.controls.reimbursableExportType.value === ReimbursableExpensesObject.PURCHASE_BILL) ;
  }

  showCCCAccountsPayableField(): boolean {
    return this.exportSettingsForm.controls.creditCardExportType.value === CorporateCreditCardExpensesObject.BANK_TRANSACTION;
  }

  getAccountsPayableLabel(): string {
    return (this.exportSettingsForm.controls.reimbursableExportType.value === ReimbursableExpensesObject.PURCHASE_BILL) ? ReimbursableExpensesObject.PURCHASE_BILL : '';
  }

  private setGeneralMappingsValidator(): void {
    if (this.showBankAccountField()) {
      this.exportSettingsForm.controls.bankAccount.setValidators(Validators.required);
    } else {
      this.exportSettingsForm.controls.bankAccount.clearValidators();
      this.exportSettingsForm.controls.bankAccount.updateValueAndValidity();
    }

    // If (this.showCreditCardAccountField()) {
    //   This.exportSettingsForm.controls.defaultCCCAccount.setValidators(Validators.required);
    // } else {
    //   This.exportSettingsForm.controls.defaultCCCAccount.clearValidators();
    //   This.exportSettingsForm.controls.defaultCCCAccount.updateValueAndValidity();
    // }

    // If (this.showDebitCardAccountField()) {
    //   This.exportSettingsForm.controls.defaultDebitCardAccount.setValidators(Validators.required);
    // } else {
    //   This.exportSettingsForm.controls.defaultDebitCardAccount.clearValidators();
    //   This.exportSettingsForm.controls.defaultDebitCardAccount.updateValueAndValidity();
    // }

    // If (this.showReimbursableAccountsPayableField() || this.showCCCAccountsPayableField()) {
    //   This.exportSettingsForm.controls.accountsPayable.setValidators(Validators.required);
    // } else {
    //   This.exportSettingsForm.controls.accountsPayable.clearValidators();
    //   This.exportSettingsForm.controls.accountsPayable.updateValueAndValidity();
    // }

    // If (this.showDefaultCreditCardVendorField()) {
    //   This.exportSettingsForm.controls.defaultCreditCardVendor.setValidators(Validators.required);
    // } else {
    //   This.exportSettingsForm.controls.defaultCreditCardVendor.clearValidators();
    //   This.exportSettingsForm.controls.defaultCreditCardVendor.updateValueAndValidity();
    // }

    // If (this.showExpenseAccountField()) {
    //   This.exportSettingsForm.controls.xeroExpenseAccount.setValidators(Validators.required);
    // } else {
    //   This.exportSettingsForm.controls.xeroExpenseAccount.clearValidators();
    //   This.exportSettingsForm.controls.xeroExpenseAccount.updateValueAndValidity();
    // }
  }

  private setCustomValidatorsAndWatchers(): void {
    // Toggles
    this.createReimbursableExpenseWatcher();
    this.createCreditCardExpenseWatcher();

    // Export select fields
    this.createReimbursableExportTypeWatcher();
    this.createCreditCardExportTypeWatcher();

    this.setGeneralMappingsValidator();
  }

  private getExportGroup(exportGroups: string[] | null): string {
    if (exportGroups) {
      const exportGroup = exportGroups.find((exportGroup) => {
        return exportGroup === ExpenseGroupingFieldOption.EXPENSE_ID || exportGroup === ExpenseGroupingFieldOption.CLAIM_NUMBER || exportGroup === ExpenseGroupingFieldOption.SETTLEMENT_ID;
      });
      return exportGroup ? exportGroup : ExpenseGroupingFieldOption.CLAIM_NUMBER;
    }

    return '';
  }

  private getSettingsAndSetupForm(): void {
    this.isOnboarding = this.windowReference.location.pathname.includes('onboarding');
    const destinationAttributes = ['BANK_ACCOUNT', 'CREDIT_CARD_ACCOUNT', 'ACCOUNTS_PAYABLE', 'VENDOR'];
    forkJoin([
      this.exportSettingService.getExportSettings(),
      // This.mappingService.getGroupedXeroDestinationAttributes(destinationAttributes),
      this.workspaceService.getWorkspaceGeneralSettings()
    ]).subscribe(response => {
      this.exportSettings = response[0];
      // This.employeeFieldMapping = response[2].employee_field_mapping;
      // This.reimbursableExportTypes = this.getReimbursableExportTypes(this.employeeFieldMapping);

      // This.bankAccounts = response[1].BANK_ACCOUNT;
      // This.cccAccounts = response[1].CREDIT_CARD_ACCOUNT;
      // This.accountsPayables = response[1].ACCOUNTS_PAYABLE;
      // This.vendors = response[1].VENDOR;
      // This.expenseAccounts = this.bankAccounts.concat(this.cccAccounts);

      this.setupForm();
    });
  }

  private setupForm(): void {
    this.exportSettingsForm = this.formBuilder.group({
      expenseState: [this.exportSettings.expense_group_settings?.expense_state, Validators.required],
      reimbursableExpense: [this.exportSettings.workspace_general_settings?.reimbursable_expenses_object ? true : false, this.exportSelectionValidator()],
      reimbursableExportType: [this.exportSettings.workspace_general_settings?.reimbursable_expenses_object],
      reimbursableExportDate: [this.exportSettings.expense_group_settings?.reimbursable_export_date_type],
      creditCardExpense: [this.exportSettings.workspace_general_settings?.corporate_credit_card_expenses_object ? true : false, this.exportSelectionValidator()],
      creditCardExportType: [this.exportSettings.workspace_general_settings?.corporate_credit_card_expenses_object],
      creditCardExportDate: [this.exportSettings.expense_group_settings?.ccc_export_date_type],
      bankAccount: [this.exportSettings.general_mappings?.bank_account?.id ? this.exportSettings.general_mappings.bank_account : null],
      autoMapEmployees: [this.exportSettings.workspace_general_settings?.auto_map_employees],
      searchOption: []
    });

    this.setCustomValidatorsAndWatchers();
    this.isLoading = false;
  }

  navigateToPreviousStep(): void {
    this.router.navigate([`/workspaces/onboarding/import_settings`]);
  }

  private updateExportSettings(): boolean {
    return this.exportSettings.workspace_general_settings.reimbursable_expenses_object !== null || this.exportSettings.workspace_general_settings.corporate_credit_card_expenses_object !== null;
  }

  private singleItemizedJournalEntryAffected(): boolean {
    return (this.exportSettings?.workspace_general_settings?.reimbursable_expenses_object !== ReimbursableExpensesObject.PURCHASE_BILL ) || (this.exportSettings?.workspace_general_settings?.corporate_credit_card_expenses_object !== CorporateCreditCardExpensesObject.BANK_TRANSACTION);
  }

  private paymentsSyncAffected(): boolean {
    return this.exportSettings?.workspace_general_settings?.reimbursable_expenses_object !== ReimbursableExpensesObject.PURCHASE_BILL && this.exportSettingsForm.value.reimbursableExportType  === ReimbursableExpensesObject.PURCHASE_BILL;
  }

  private advancedSettingAffected(): boolean {
    if (this.updateExportSettings()) {
      return true;
    }

    return false;
  }

  private replaceContentBasedOnConfiguration(updatedConfiguration: string, existingConfiguration: string, exportType: 'reimbursable' | 'credit card'): string {
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
    const updatedReimbursableExportType = this.exportSettingsForm.value.reimbursableExportType ? this.exportSettingsForm.value.reimbursableExportType : 'None';
    const updatedCorporateCardExportType = this.exportSettingsForm.value.creditCardExportType ? this.exportSettingsForm.value.creditCardExportType : 'None';

    if (this.singleItemizedJournalEntryAffected()) {
      if (updatedReimbursableExportType !== existingReimbursableExportType) {
        content = this.replaceContentBasedOnConfiguration(updatedReimbursableExportType, existingReimbursableExportType, 'reimbursable');
      } else if (existingCorporateCardExportType !== updatedCorporateCardExportType) {
        content = this.replaceContentBasedOnConfiguration(updatedCorporateCardExportType, existingCorporateCardExportType, 'credit card');
      }
    }

    if (!this.singleItemizedJournalEntryAffected() && this.paymentsSyncAffected()) {
      content = this.replaceContentBasedOnConfiguration(updatedReimbursableExportType, existingReimbursableExportType, 'reimbursable');
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
    this.trackingService.trackTimeSpent(OnboardingStep.EXPORT_SETTINGS, {phase: this.getPhase(), durationInSeconds: Math.floor(differenceInMs / 1000), eventState: eventState});
  }

  private constructPayloadAndSave(): void {
    this.saveInProgress = true;
    const exportSettingPayload = ExportSettingModel.constructPayload(this.exportSettingsForm);

    this.exportSettingService.postExportSettings(exportSettingPayload).subscribe((response: ExportSettingGet) => {
      if (this.workspaceService.getOnboardingState() === OnboardingState.EXPORT_SETTINGS) {
        this.trackingService.onOnboardingStepCompletion(OnboardingStep.EXPORT_SETTINGS, 3, exportSettingPayload);
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
        this.workspaceService.setOnboardingState(OnboardingState.ADVANCED_CONFIGURATION);
        this.router.navigate([`/workspaces/main/configuration/advanced_settings`]);
      // } else if (this.advancedSettingAffected()) {
      //   This.router.navigate(['/workspaces/main/configuration/advanced_settings']);
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
