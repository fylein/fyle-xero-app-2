import { FormGroup } from "@angular/forms";
import { MappingDestinationField, MappingSourceField } from "../enum/enum.model";
import { DefaultDestinationAttribute, GeneralMapping } from "../db/general-mapping.model";
import { MappingSetting } from "../db/mapping-setting.model";
import { SelectFormOption } from "../misc/select-form-option.model";
import { WorkspaceGeneralSetting } from "../db/workspace-general-setting.model";

export type ImportSettingWorkspaceGeneralSetting = {
  import_categories: boolean,
  charts_of_accounts: string[],
  import_tax_codes: boolean,
  import_customers: boolean,
  import_suppliers_as_merchants: boolean
}

export type ImportSettingGeneralMapping = {
  default_tax_code: DefaultDestinationAttribute
}

export type ImportSettingMappingSetting = {
  source_field: MappingSourceField | string,
  destination_field: MappingDestinationField | string,
  import_to_fyle: boolean,
  is_custom: boolean,
  source_placeholder: string | null
}

export type ImportSettingPost = {
  workspace_general_settings: ImportSettingWorkspaceGeneralSetting,
  general_mappings: ImportSettingGeneralMapping,
  mapping_settings: ImportSettingMappingSetting[]
}

export type ExpenseFieldsFormOption = {
  source_field: MappingSourceField | string,
  destination_field: MappingDestinationField | string,
  import_to_fyle: boolean,
  disable_import_to_fyle: boolean,
  source_placeholder: string | null
}

export type ImportSettingGet = {
  workspace_general_settings: WorkspaceGeneralSetting,
  general_mappings: GeneralMapping,
  mapping_settings: MappingSetting[],
  workspace_id:number
}

export interface ImportSettingFormOption extends SelectFormOption {
  value: string;
}


export class ImportSettingModel {
  static constructPayload(importSettingsForm: FormGroup, customMappingSettings: MappingSetting[]): ImportSettingPost {
    const emptyDestinationAttribute = {id: null, name: null};
    const chartOfAccounts = ImportSettingModel.formatChartOfAccounts(importSettingsForm.get('chartOfAccountTypes')?.value);
    const importSettingPayload: ImportSettingPost = {
      workspace_general_settings: {
        import_categories: importSettingsForm.get('chartOfAccount')?.value,
        charts_of_accounts: importSettingsForm.get('chartOfAccount')?.value ? chartOfAccounts : ['Expense'],
        import_tax_codes: importSettingsForm.get('taxCode')?.value,
        import_suppliers_as_merchants: importSettingsForm.get('importSuppliersAsMerchants')?.value,
        import_customers: importSettingsForm.get('importCustomers')?.value ? importSettingsForm.get('importCustomers')?.value : false
      },
      general_mappings: {
        default_tax_code: importSettingsForm.get('defaultTaxCode')?.value ? importSettingsForm.get('defaultTaxCode')?.value : emptyDestinationAttribute
      },
      mapping_settings: ImportSettingModel.formatMappingSettings(importSettingsForm.get('expenseFields')?.value, customMappingSettings)
    };
    return importSettingPayload;
  }

  static formatChartOfAccounts(chartOfAccounts: {enabled: boolean, name: string}[]): string[] {
    return chartOfAccounts.filter(chartOfAccount => chartOfAccount.enabled).map(chartOfAccount => chartOfAccount.name.toUpperCase());
  }

  static formatMappingSettings(expenseFields: ExpenseFieldsFormOption[], existingMappingSettings: MappingSetting[]): ImportSettingMappingSetting[] {
    const mappingSettings: ImportSettingMappingSetting[] = [];
    expenseFields.forEach((expenseField: ExpenseFieldsFormOption) => {
      if (expenseField.source_field) {
        mappingSettings.push({
          source_field: expenseField.source_field,
          destination_field: expenseField.destination_field,
          import_to_fyle: expenseField.import_to_fyle,
          is_custom: expenseField.source_field === MappingSourceField.COST_CENTER || expenseField.source_field === MappingSourceField.PROJECT ? false : true,
          source_placeholder: expenseField.source_placeholder ? expenseField.source_placeholder : null
        });
      }
    });

    // Add custom mapping payload to preserve them
    existingMappingSettings.forEach((existingMappingSetting: MappingSetting) => {
      if (!mappingSettings.find(mappingSetting => mappingSetting.source_field === existingMappingSetting.source_field && !existingMappingSetting.import_to_fyle)) {
        mappingSettings.push({
          source_field: existingMappingSetting.source_field,
          destination_field: existingMappingSetting.destination_field,
          import_to_fyle: existingMappingSetting.import_to_fyle,
          is_custom: existingMappingSetting.is_custom,
          source_placeholder: existingMappingSetting.source_placeholder
        });
      }
    });

    return mappingSettings;
  }
}
