import { FormGroup } from "@angular/forms";
import { AutoMapEmployee, CorporateCreditCardExpensesObject, ExpenseGroupingFieldOption, ExpenseState, ExportDateType, ReimbursableExpensesObject } from "../enum/enum.model";
import { ExpenseGroupSettingGet, ExpenseGroupSettingPost } from "../db/expense-group-setting.model";
import { DefaultDestinationAttribute, GeneralMapping } from "../db/general-mapping.model";
import { SelectFormOption } from "../misc/select-form-option.model";

export type ExportSettingWorkspaceGeneralSetting = {
  reimbursable_expenses_object: ReimbursableExpensesObject | null,
  corporate_credit_card_expenses_object: CorporateCreditCardExpensesObject | null,
  auto_map_employees: AutoMapEmployee | null
}

export type ExportSettingGeneralMapping = {
  bank_account: DefaultDestinationAttribute
}

export type ExportSettingPost = {
  expense_group_settings: ExpenseGroupSettingPost,
  workspace_general_settings: ExportSettingWorkspaceGeneralSetting,
  general_mappings: ExportSettingGeneralMapping
}

export type ExportSettingGet = {
  expense_group_settings: ExpenseGroupSettingGet,
  workspace_general_settings: ExportSettingWorkspaceGeneralSetting,
  general_mappings: ExportSettingGeneralMapping,
  workspace_id: number
}

export interface ExportSettingFormOption extends SelectFormOption {
  value: ExpenseState | ReimbursableExpensesObject | CorporateCreditCardExpensesObject | ExpenseGroupingFieldOption | ExportDateType | string;
}

export class ExportSettingModel {
  static constructPayload(exportSettingsForm: FormGroup): ExportSettingPost {
    const emptyDestinationAttribute = {id: null, name: null};
    const exportSettingPayload: ExportSettingPost = {
      expense_group_settings: {
        expense_state: exportSettingsForm.get('expenseState')?.value,
        reimbursable_export_date_type: exportSettingsForm.get('reimbursableExportDate')?.value,
        ccc_export_date_type: exportSettingsForm.get('creditCardExportDate')?.value
      },
      workspace_general_settings: {
        reimbursable_expenses_object: exportSettingsForm.get('reimbursableExportType')?.value,
        corporate_credit_card_expenses_object: exportSettingsForm.get('creditCardExportType')?.value,
        auto_map_employees: exportSettingsForm.get('autoMapEmployees')?.value
      },
      general_mappings: {
        bank_account: exportSettingsForm.get('bankAccount')?.value ? exportSettingsForm.get('bankAccount')?.value : emptyDestinationAttribute
      }
    };
    return exportSettingPayload;
  }
}
