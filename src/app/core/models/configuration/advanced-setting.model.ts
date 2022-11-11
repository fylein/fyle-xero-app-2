import { FormGroup } from "@angular/forms";
import { PaymentSyncDirection } from "../enum/enum.model";
import { DefaultDestinationAttribute } from "../db/general-mapping.model";
import { SelectFormOption } from "../misc/select-form-option.model";
import { WorkspaceScheduleEmailOptions } from "../db/workspace-schedule.model";

export type AdvancedSettingWorkspaceGeneralSetting = {
  sync_fyle_to_xero_payments: boolean,
  sync_xero_to_fyle_payments: boolean,
  auto_create_destination_entity: boolean,
  change_accounting_period: boolean,
  auto_create_merchant_destination_entity: boolean
}

export type AdvancedSettingGeneralMapping = {
  payment_account: DefaultDestinationAttribute
}

export type AdvancedSettingWorkspaceSchedule = {
  enabled: boolean,
  interval_hours: number,
  start_datetime: Date
}

export type AdvancedSettingWorkspaceSchedulePost = {
  hours: number;
  schedule_enabled: boolean;
  emails_selected: string[];
  email_added: WorkspaceScheduleEmailOptions
}

export type AdvancedSettingPost = {
  workspace_general_settings: AdvancedSettingWorkspaceGeneralSetting,
  general_mappings: AdvancedSettingGeneralMapping,
  workspace_schedules: AdvancedSettingWorkspaceSchedule,
}

export type AdvancedSettingGet = {
  workspace_general_settings: AdvancedSettingWorkspaceGeneralSetting,
  general_mappings: AdvancedSettingGeneralMapping,
  workspace_schedules: AdvancedSettingWorkspaceSchedule,
  workspace_id:number
}

export type AdvancedSettingAddEmailModel = {
  workspaceId: number;
  hours: number;
  schedulEnabled: boolean;
  selectedEmails: string[];
}

export interface AdvancedSettingFormOption extends SelectFormOption {
  value: PaymentSyncDirection | number | 'None';
}

export class AdvancedSettingModel {
  static constructPayload(advancedSettingsForm: FormGroup): AdvancedSettingPost {
    const emptyDestinationAttribute = {id: null, name: null};
    const advancedSettingPayload: AdvancedSettingPost = {
      workspace_general_settings: {
        sync_fyle_to_xero_payments: advancedSettingsForm.get('paymentSync')?.value && advancedSettingsForm.get('paymentSync')?.value === PaymentSyncDirection.FYLE_TO_XERO ? true : false,
        sync_xero_to_fyle_payments: advancedSettingsForm.get('paymentSync')?.value && advancedSettingsForm.get('paymentSync')?.value === PaymentSyncDirection.XERO_TO_FYLE ? true : false,
        auto_create_destination_entity: advancedSettingsForm.get('autoCreateVendors')?.value,
        change_accounting_period: advancedSettingsForm.get('changeAccountingPeriod')?.value,
        auto_create_merchant_destination_entity: advancedSettingsForm.get('autoCreateMerchantDestinationEntity')?.value
      },
      general_mappings: {
        payment_account: advancedSettingsForm.get('billPaymentAccount')?.value ? advancedSettingsForm.get('billPaymentAccount')?.value : emptyDestinationAttribute
      },
      workspace_schedules: {
        enabled: advancedSettingsForm.get('exportSchedule')?.value ? true : false,
        interval_hours: advancedSettingsForm.get('exportScheduleFrequency')?.value ? advancedSettingsForm.get('exportScheduleFrequency')?.value : null,
        start_datetime: new Date()
      }
    };
    return advancedSettingPayload;
  }
}
