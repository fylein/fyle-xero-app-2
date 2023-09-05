import { AdvancedSettingGet } from "src/app/core/models/configuration/advanced-setting.model";
import { DestinationAttribute } from "src/app/core/models/db/destination-attribute.model";
import { WorkspaceSchedule, WorkspaceScheduleEmailOptions } from "src/app/core/models/db/workspace-schedule.model";
import { WorkspaceGeneralSetting } from "src/app/core/models/db/workspace-general-setting.model";
import { CorporateCreditCardExpensesObject, PaymentSyncDirection, ReimbursableExpensesObject } from "src/app/core/models/enum/enum.model";

export const response:WorkspaceGeneralSetting = {
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
  import_suppliers_as_merchants: false,
  map_merchant_to_contact: false,
  is_simplify_report_closure_enabled: true
};

export const advancedSettingResponse:AdvancedSettingGet = {
  workspace_general_settings: {
        sync_fyle_to_xero_payments: false,
        sync_xero_to_fyle_payments: false,
        auto_create_destination_entity: true,
        change_accounting_period: true,
        auto_create_merchant_destination_entity: true

      },
      general_mappings: {
        payment_account: {id: '1', name: 'Fyle'}
      },
      workspace_schedules: {
        enabled: true,
        interval_hours: 10,
        start_datetime: new Date("2022-01-16"),
        emails_selected: [],
        additional_email_options: []
      },
  workspace_id: 1
};
export const destinationAttribute: DestinationAttribute[] = [{
  id: 1,
  attribute_type: 'EMPLOYEE',
  display_name: "string",
  value: "string",
  destination_id: "string",
  active: true,
  created_at: new Date("2022-01-16"),
  updated_at: new Date("2022-01-16"),
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
  created_at: new Date("2022-01-16"),
  updated_at: new Date("2022-01-16"),
  workspace: 2,
  detail: {
    email: 'String',
    fully_qualified_name: 'string'
  }
}];
export const getadvancedSettingResponse:AdvancedSettingGet = {
  workspace_general_settings: {
    sync_fyle_to_xero_payments: false,
    sync_xero_to_fyle_payments: false,
    auto_create_destination_entity: true,
    change_accounting_period: true,
    auto_create_merchant_destination_entity: true

  },
  general_mappings: {
    payment_account: {id: '1', name: 'Fyle'}
  },
  workspace_schedules: {
    enabled: true,
    interval_hours: 10,
    start_datetime: new Date("2022-01-16"),
    emails_selected: ['fyle@fyle.in', 'integrations@fyle.in' ],
    additional_email_options: [{name: 'fyle3', email: 'fyle3@fyle.in'}]
  },
  workspace_id: 1
};

export const getadvancedSettingResponse2:AdvancedSettingGet = {
  workspace_general_settings: {
    sync_fyle_to_xero_payments: true,
    sync_xero_to_fyle_payments: false,
    auto_create_destination_entity: true,
    change_accounting_period: true,
    auto_create_merchant_destination_entity: true

  },
  general_mappings: {
    payment_account: {id: '1', name: 'Fyle'}
  },
  workspace_schedules: {
    enabled: true,
    interval_hours: 10,
    start_datetime: new Date("2022-01-16"),
    emails_selected: [],
    additional_email_options: []
  },
  workspace_id: 1
};
export const previewResponse = 'john.doe@acme.com - Pizza Hut - Client Meeting - Meals and Entertainment - C/2021/12/R/1 - https://app.fylehq.com/app/main/#/enterprise/view_expense/';
export const errorResponse = {
  status: 404,
  statusText: "Not Found",
  error: {
    id: 1,
    is_expired: true,
    company_name: 'Xero'
  }
};
export const emailResponse: WorkspaceSchedule = {
  id: 1,
  workspace: 1,
  enabled: false,
  start_datetime: new Date("2022-01-16"),
  interval_hours: 1,
  schedule: 1,
  emails_selected: ['fyle@fyle.in', 'integrations@fyle.in' ],
  additional_email_options: [{name: 'fyle3', email: 'fyle3@fyle.in'}]
};
export const adminEmails: WorkspaceScheduleEmailOptions[] = [ {name: 'fyle', email: 'fyle@fyle.in'}, {name: 'fyle2', email: 'fyle2@fyle.in'}];
export const memo = ['employee_email', 'merchant', 'purpose', 'category', 'report_number', 'expense_link'];

export const mockPaymentSyncOptions = [
  {
    label: 'None',
    value: 'None'
  },
  {
    label: 'Export Fyle ACH Payments to Xero',
    value: PaymentSyncDirection.FYLE_TO_XERO
  },
  {
    label: 'Import Xero Payments into Fyle',
    value: PaymentSyncDirection.XERO_TO_FYLE
  }
];
