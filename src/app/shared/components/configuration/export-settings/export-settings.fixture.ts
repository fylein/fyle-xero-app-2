import { ExportSettingFormOption, ExportSettingGet } from "src/app/core/models/configuration/export-setting.model";
import { GroupedDestinationAttribute } from "src/app/core/models/db/destination-attribute.model";
import { WorkspaceGeneralSetting } from "src/app/core/models/db/workspace-general-setting.model";
import { CorporateCreditCardExpensesObject, TenantFieldMapping, ExpenseState, CCCExpenseState, ExportDateType, ReimbursableExpensesObject, AutoMapEmployee } from "src/app/core/models/enum/enum.model";

export const export_settings: ExportSettingFormOption[] = [
  {
    label: 'Purchase Bill',
    value: ReimbursableExpensesObject.PURCHASE_BILL
  }
];

export const workspaceResponse: WorkspaceGeneralSetting = {
  auto_create_destination_entity: true,
  auto_map_employees: 'Email',
  change_accounting_period: true,
  charts_of_accounts: ['Expense'],
  corporate_credit_card_expenses_object: CorporateCreditCardExpensesObject.BANK_TRANSACTION,
  created_at: new Date("2022-04-27T11:07:17.694377Z"),
  id: 1,
  import_categories: false,
  import_projects: false,
  import_tax_codes: false,
  reimbursable_expenses_object: ReimbursableExpensesObject.PURCHASE_BILL,
  skip_cards_mapping: false,
  sync_fyle_to_xero_payments: false,
  sync_xero_to_fyle_payments: false,
  updated_at: new Date("2022-04-28T12:48:39.150177Z"),
  workspace: 1,
  import_customers: false,
  map_merchant_to_contact: false,
  is_simplify_report_closure_enabled: true
};
export const destinationAttribute: GroupedDestinationAttribute={
  BANK_ACCOUNT: [{
    id: 3,
    attribute_type: 'BANK_ACCOUNT',
    display_name: "string",
    value: "Fyle",
    destination_id: "1",
    active: true,
    created_at: new Date(),
    updated_at: new Date(),
    workspace: 2,
    detail: {
      email: 'String',
      fully_qualified_name: 'string'
    }
  }],
  TAX_CODE: []
};
export const exportResponse: ExportSettingGet = {
  expense_group_settings: {
    reimbursable_expense_state: ExpenseState.PAID,
    reimbursable_export_date_type: ExportDateType.CURRENT_DATE,
    ccc_expense_state: CCCExpenseState.PAID,
    ccc_export_date_type: ExportDateType.SPENT_AT
  },
  workspace_general_settings: {
    reimbursable_expenses_object: null,
    corporate_credit_card_expenses_object: CorporateCreditCardExpensesObject.BANK_TRANSACTION,
    auto_map_employees: AutoMapEmployee.EMAIL,
    is_simplify_report_closure_enabled: true
  },
  general_mappings: {
    bank_account: {id: '1', name: 'Fyle'}
  },
  workspace_id: 1
};

export const exportResponse1: ExportSettingGet = {
  expense_group_settings: {
    reimbursable_expense_state: ExpenseState.PAID,
    reimbursable_export_date_type: null,
    ccc_expense_state: CCCExpenseState.PAID,
    ccc_export_date_type: null
  },
  // @ts-ignore
  workspace_general_settings: undefined,
  general_mappings: {
    bank_account: {id: '1', name: 'Fyle'}
  },
  workspace_id: 1
};
export const replacecontent1 = `You have changed the export type of reimbursable expense from <b>Check</b> to <b>Bill</b>,
which would impact a few configurations in the <b>Advanced settings</b>. <br><br>Please revisit the <b>Advanced settings</b> to check and enable the
features that could help customize and automate your integration workflows.`;

export const replacecontent2 = `You have changed the export type of reimbursable expense from <b></b> to <b></b>,
which would impact a few configurations in the <b>Advanced settings</b>. <br><br>Please revisit the <b>Advanced settings</b> to check and enable the
features that could help customize and automate your integration workflows.`;

export const replacecontent3 = `You have changed the export type of credit card expense from <b>CREDIT CARD PURCHASE</b> to <b>Bill</b>,
which would impact a few configurations in the <b>Advanced settings</b>. <br><br>Please revisit the <b>Advanced settings</b> to check and enable the
features that could help customize and automate your integration workflows.`;

export const errorResponse = {
  status: 404,
  statusText: "Not Found",
  error: {
    id: 1,
    is_expired: true,
    company_name: 'Xero'
  }
};

export const mockAutoMapEmployeeOptions = [
  {
    label: 'None',
    value: null
  },
  {
    label: 'Employee name on Fyle to contact name on Xero',
    value: AutoMapEmployee.NAME
  },
  {
    label: 'Employee email on Fyle to contact email on Xero',
    value: AutoMapEmployee.EMAIL
  }
];

export const mockReimbursableExpenseGroupingDateOptions = [
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
