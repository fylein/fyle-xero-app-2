import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AdvancedSettingFormOption, AdvancedSettingGet, AdvancedSettingModel } from 'src/app/core/models/configuration/advanced-setting.model';
import { DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { ConfigurationCtaText, CorporateCreditCardExpensesObject, OnboardingState, OnboardingStep, PaymentSyncDirection, ProgressPhase, ReimbursableExpensesObject, UpdateEvent } from 'src/app/core/models/enum/enum.model';
import { WorkspaceService } from 'src/app/core/services/workspace/workspace.service';
import { AdvancedSettingService } from 'src/app/core/services/configuration/advanced-setting.service';
import { HelperService } from 'src/app/core/services/core/helper.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { WindowService } from 'src/app/core/services/core/window.service';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';
import { MatDialog } from '@angular/material/dialog';
import { WorkspaceSchedule, WorkspaceScheduleEmailOptions } from 'src/app/core/models/db/workspace-schedule.model';
import { MappingService } from 'src/app/core/services/misc/mapping.service';
import { WorkspaceGeneralSetting } from 'src/app/core/models/db/workspace-general-setting.model';

@Component({
  selector: 'app-advanced-settings',
  templateUrl: './advanced-settings.component.html',
  styleUrls: ['./advanced-settings.component.scss']
})
export class AdvancedSettingsComponent implements OnInit, OnDestroy {

  isLoading: boolean = true;

  saveInProgress: boolean;

  isOnboarding: boolean = false;

  advancedSettings: AdvancedSettingGet;

  workspaceGeneralSettings: WorkspaceGeneralSetting;

  billPaymentAccounts: DestinationAttribute[];

  advancedSettingsForm: FormGroup;

  defaultMemoFields: string[] = ['employee_email', 'merchant', 'purpose', 'category', 'spent_on', 'report_number', 'expense_link'];

  memoStructure: string[] = [];

  memoPreviewText: string = '';

  paymentSyncOptions: AdvancedSettingFormOption[] = [
    {
      label: 'Export Fyle ACH Payments to Xero',
      value: PaymentSyncDirection.FYLE_TO_XERO
    },
    {
      label: 'Import Xero Payments into Fyle',
      value: PaymentSyncDirection.XERO_TO_FYLE
    }
  ];

  frequencyIntervals: AdvancedSettingFormOption[] = [...Array(24).keys()].map(day => {
    return {
      label: (day + 1) === 1 ? (day + 1) + ' Hour' : (day + 1) + ' Hours',
      value: day + 1
    };
  });

  windowReference: Window;

  ConfigurationCtaText = ConfigurationCtaText;

  ProgressPhase = ProgressPhase;

  scheduleSetting: WorkspaceSchedule;

  adminEmails: WorkspaceScheduleEmailOptions[];

  private readonly sessionStartTime = new Date();

  private timeSpentEventRecorded: boolean = false;

  constructor(
    private advancedSettingService: AdvancedSettingService,
    private formBuilder: FormBuilder,
    public helperService: HelperService,
    private mappingService: MappingService,
    private router: Router,
    private snackBar: MatSnackBar,
    private trackingService: TrackingService,
    private windowService: WindowService,
    private workspaceService: WorkspaceService,
    public dialog: MatDialog
  ) {
    this.windowReference = this.windowService.nativeWindow;
  }

  private createPaymentSyncWatcher(): void {
    this.advancedSettingsForm.controls.paymentSync.valueChanges.subscribe((ispaymentSyncSelected) => {
      if (ispaymentSyncSelected && ispaymentSyncSelected === PaymentSyncDirection.FYLE_TO_XERO) {
        this.advancedSettingsForm.controls.billPaymentAccount.setValidators(Validators.required);
      } else {
        this.advancedSettingsForm.controls.billPaymentAccount.clearValidators();
        this.advancedSettingsForm.controls.billPaymentAccount.setValue(null);
      }
    });
  }

  private createScheduledWatcher(): void {
    this.advancedSettingsForm.controls.exportSchedule.valueChanges.subscribe((isScheduledSelected) => {
      if (isScheduledSelected) {
        this.advancedSettingsForm.controls.exportScheduleFrequency.setValidators(Validators.required);
      } else {
        this.advancedSettingsForm.controls.exportScheduleFrequency.clearValidators();
        this.advancedSettingsForm.controls.exportScheduleFrequency.setValue(null);
      }
    });
  }

  private setCustomValidators(): void {
    this.createPaymentSyncWatcher();
    this.createScheduledWatcher();
  }

  showPaymentSyncField(): boolean {
    return this.workspaceGeneralSettings.reimbursable_expenses_object === ReimbursableExpensesObject.PURCHASE_BILL;
  }

  showSingleCreditLineJEField(): boolean {
    return this.workspaceGeneralSettings.reimbursable_expenses_object === ReimbursableExpensesObject.PURCHASE_BILL;
  }

  private setupForm(): void {
    let paymentSync = '';
    if (this.advancedSettings.workspace_general_settings.sync_fyle_to_xero_payments) {
      paymentSync = PaymentSyncDirection.FYLE_TO_XERO;
    } else if (this.advancedSettings.workspace_general_settings.sync_xero_to_fyle_payments) {
      paymentSync = PaymentSyncDirection.XERO_TO_FYLE;
    }

    this.advancedSettingsForm = this.formBuilder.group({
      paymentSync: [paymentSync],
      billPaymentAccount: [this.advancedSettings.general_mappings.bill_payment_account?.id],
      changeAccountingPeriod: [this.advancedSettings.workspace_general_settings.change_accounting_period],
      autoCreateVendors: [this.advancedSettings.workspace_general_settings.auto_create_destination_entity],
      exportSchedule: [this.advancedSettings.workspace_schedules?.enabled ? this.advancedSettings.workspace_schedules.interval_hours : false],
      exportScheduleFrequency: [this.advancedSettings.workspace_schedules?.enabled ? this.advancedSettings.workspace_schedules.interval_hours : null],
      searchOption: []
    });

    this.setCustomValidators();
    this.isLoading = false;
  }

  private getSettingsAndSetupForm(): void {
    this.isOnboarding = this.windowReference.location.pathname.includes('onboarding');
    forkJoin([
      this.advancedSettingService.getAdvancedSettings(),
      this.mappingService.getXeroDestinationAttributes('BANK_ACCOUNT'),
      this.workspaceService.getWorkspaceGeneralSettings
    ]).subscribe(response => {
      this.advancedSettings = response[0];
      this.billPaymentAccounts = response[1];
      this.workspaceGeneralSettings = response[2];
      this.setupForm();
    });
  }

  navigateToPreviousStep(): void {
    this.router.navigate([`/workspaces/onboarding/import_settings`]);
  }

  private getPhase(): ProgressPhase {
    return this.isOnboarding ? ProgressPhase.ONBOARDING : ProgressPhase.POST_ONBOARDING;
  }

  private trackSessionTime(eventState: 'success' | 'navigated'): void {
    const differenceInMs = new Date().getTime() - this.sessionStartTime.getTime();

    this.timeSpentEventRecorded = true;
    this.trackingService.trackTimeSpent(OnboardingStep.ADVANCED_SETTINGS, { phase: this.getPhase(), durationInSeconds: Math.floor(differenceInMs / 1000), eventState: eventState });
  }

  save(): void {
    if (this.advancedSettingsForm.valid && !this.saveInProgress) {
      const advancedSettingPayload = AdvancedSettingModel.constructPayload(this.advancedSettingsForm);
      this.saveInProgress = true;

      this.advancedSettingService.postAdvancedSettings(advancedSettingPayload).subscribe((response: AdvancedSettingGet) => {
        if (this.workspaceService.getOnboardingState() === OnboardingState.ADVANCED_CONFIGURATION) {
          this.trackingService.onOnboardingStepCompletion(OnboardingStep.ADVANCED_SETTINGS, 5, advancedSettingPayload);
        } else {
          this.trackingService.onUpdateEvent(
            UpdateEvent.ADVANCED_SETTINGS,
            {
              phase: this.getPhase(),
              oldState: this.advancedSettings,
              newState: response
            }
          );
        }

        this.saveInProgress = false;
        this.snackBar.open('Advanced settings saved successfully');
        this.trackSessionTime('success');
        if (this.isOnboarding) {
          this.workspaceService.setOnboardingState(OnboardingState.COMPLETE);
          this.router.navigate([`/workspaces/onboarding/done`]);
        } else {
          this.router.navigate(['/workspaces/main/dashboard']);
        }
      }, () => {
        this.saveInProgress = false;
        this.snackBar.open('Error saving advanced settings, please try again later');
      });
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
