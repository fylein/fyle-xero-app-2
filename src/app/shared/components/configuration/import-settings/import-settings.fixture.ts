import { ExpenseFieldsFormOption, ImportSettingGet } from "src/app/core/models/configuration/import-setting.model";
import { GeneralMapping } from "src/app/core/models/db/general-mapping.model";
import { WorkspaceGeneralSetting } from "src/app/core/models/db/workspace-general-setting.model";
import { MappingDestinationField, MappingSourceField } from "src/app/core/models/enum/enum.model";
import { ExpenseField } from "src/app/core/models/misc/expense-field.model";
import { MappingSetting } from "src/app/core/models/db/mapping-setting.model";
import { DestinationAttribute } from "src/app/core/models/db/destination-attribute.model";
import { XeroCredentials } from "src/app/core/models/configuration/xero-connector.model";

const workspaceresponse:WorkspaceGeneralSetting = {
  auto_create_destination_entity: true,
  change_accounting_period: true,
  charts_of_accounts: ['Expense'],
  created_at: new Date("2022-04-27T11:07:17.694377Z"),
  id: 1,
  import_categories: false,
  import_projects: false,
  import_tax_codes: false,
  skip_cards_mapping: false,
  sync_fyle_to_xero_payments: false,
  sync_xero_to_fyle_payments: false,
  updated_at: new Date("2022-04-28T12:48:39.150177Z"),
  workspace: 1,
  reimbursable_expenses_object: "",
  corporate_credit_card_expenses_object: "",
  auto_map_employees: "",
  import_customers: false,
  map_merchant_to_contact: false,
  is_simplify_report_closure_enabled: true
};

const general_mappings:GeneralMapping = {
  id: 1,
  created_at: new Date(),
  updated_at: new Date(),
  workspace: 1,
  bank_account: { name: 'fyle', id: "1" },
  default_tax_code: { name: 'fyle', id: '1' },
  payment_account: { name: 'fyle', id: '1' }
};

const mapping_settings: MappingSetting[] = [{
  id: 1,
  created_at: new Date(),
  updated_at: new Date(),
  workspace: 1,
  source_field: MappingSourceField.TAX_GROUP,
  destination_field: MappingSourceField.PROJECT,
  import_to_fyle: true,
  is_custom: true,
  source_placeholder: null
},
{
  id: 2,
  created_at: new Date(),
  updated_at: new Date(),
  workspace: 1,
  source_field: 'CUSTOM_FIELD',
  destination_field: MappingDestinationField.BANK_ACCOUNT,
  import_to_fyle: false,
  is_custom: true,
  source_placeholder: null
}];
export const getImportsettingResponse: ImportSettingGet={
  general_mappings: general_mappings,
  mapping_settings: mapping_settings,
  workspace_general_settings: workspaceresponse,
  workspace_id: 1
};

export const expenseFieldresponse:ExpenseField[]=[
  {
      "attribute_type": "COST_CENTER",
      "display_name": "Cost Center"
  },
  {
      "attribute_type": "PROJECT",
      "display_name": "Project"
  },
  {
      "attribute_type": "REGION",
      "display_name": "Region"
  },
  {
      "attribute_type": "XERO_REGION",
      "display_name": "Xero Region"
  },
  {
      "attribute_type": "XERO_ITEM",
      "display_name": "Xero Item"
  },
  {
      "attribute_type": "XERO_FIELD",
      "display_name": "Xero Field"
  }
];
export const xeroField:ExpenseFieldsFormOption[] = [{
  source_field: MappingSourceField.TAX_GROUP,
  destination_field: MappingDestinationField.ACCOUNT,
  import_to_fyle: true,
  disable_import_to_fyle: true,
  source_placeholder: null
}];
export const xeroField1:ExpenseFieldsFormOption[] = [{
  source_field: MappingSourceField.PROJECT,
  destination_field: MappingDestinationField.ACCOUNT,
  import_to_fyle: true,
  disable_import_to_fyle: true,
  source_placeholder: null
}];
export const chartOfAccountTypesList: string[] = [
  'Expense', 'Other Expense', 'Fixed Asset', 'Cost of Goods Sold', 'Current Liability', 'Equity',
  'Other Current Asset', 'Other Current Liability', 'Long Term Liability', 'Current Asset'
];

export const postImportsettingresponse={
  general_mappings: {default_tax_code: {name: 'fyle', id: '1'}},
  mapping_settings: [{
    source_field: MappingSourceField.PROJECT,
    destination_field: MappingDestinationField.CONTACT,
    import_to_fyle: true,
    is_custom: false,
    source_placeholder: 'Fyle'
  }],
  workspace_general_settings: {charts_of_accounts: ["Expense"],
  import_categories: true,
  import_tax_codes: true,
  import_vendors_as_merchants: true},
  workspace_id: 1
};
export const destinationAttribute: DestinationAttribute[] = [{
  id: 1,
  attribute_type: 'EMPLOYEE',
  display_name: "string",
  value: "string",
  destination_id: "string",
  active: true,
  created_at: new Date(),
  updated_at: new Date(),
  workspace: 2,
  detail: {
    email: 'String',
    fully_qualified_name: 'string'
  }
},
{
  id: 1,
  attribute_type: 'VENDOR',
  display_name: "string",
  value: "string",
  destination_id: "string",
  active: true,
  created_at: new Date(),
  updated_at: new Date(),
  workspace: 2,
  detail: {
    email: 'String',
    fully_qualified_name: 'string'
  }
}];
export const XeroCredentialsResponse: XeroCredentials = {
  country: "GB",
  created_at: new Date("2021-10-05T11:56:13.883015Z"),
  id: 219,
  refresh_token: "AB",
  company_name: 'Xero',
  updated_at: new Date("2022-05-06T13:13:25.893837Z"),
  workspace: 1
};
export const errorResponse = {
  status: 404,
  statusText: "Not Found",
  error: {
    id: 1,
    is_expired: true,
    company_name: 'Xero'
  }
};
