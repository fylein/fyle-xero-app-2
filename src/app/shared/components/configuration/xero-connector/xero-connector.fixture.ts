import { ExportSettingGet } from "src/app/core/models/configuration/export-setting.model";
import { DestinationAttribute } from "src/app/core/models/db/destination-attribute.model";
import { TenantMapping } from "src/app/core/models/db/tenant-mapping.model";
import { ExpenseState, CCCExpenseState, AutoMapEmployee } from "src/app/core/models/enum/enum.model";

export const response = {
  id: 1,
  refresh_token: 'fyle',
  is_expired: false,
  code: 'realmId',
  country: 'india',
  company_name: 'Fyle',
  created_at: new Date(),
  updated_at: new Date(),
  workspace: 2
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

export const errorResponse2 = {
  status: 404,
  statusText: "Not Found",
  error: {
    id: 1,
    is_expired: true,
    company_name: 'Xero',
    message: 'Please choose the correct Xero account'
  }
};

export const exportResponse: ExportSettingGet = {
  expense_group_settings: {
    reimbursable_expense_state: ExpenseState.PAID,
    reimbursable_export_date_type: null,
    ccc_expense_state: CCCExpenseState.PAID,
    ccc_export_date_type: null
  },
  workspace_general_settings: {
    reimbursable_expenses_object: null,
    corporate_credit_card_expenses_object: null,
    auto_map_employees: AutoMapEmployee.EMAIL,
    is_simplify_report_closure_enabled: true
  },
  general_mappings: {
    bank_account: {id: '1', name: 'Fyle'}
  },
  workspace_id: 1
};

export const tenant: DestinationAttribute[] = [
  {
    active: false,
    attribute_type: "TENANT",
    created_at: new Date("2022-08-29T08:02:06.216066Z"),
    destination_id: "25d7b4cd-ed1c-4c5c-80e5-c058b87db8a1",
    detail: {
      email: "string",
      fully_qualified_name: "string"
    },
    display_name: "Tenant",
    id: 13671,
    updated_at: new Date("2022-08-29T08:02:06.216097Z"),
    value: "Demo Company (Global)",
    workspace: 162
  }
];
export const Tenantresponse: TenantMapping = {
  id: 123,
  tenant_name: 'Xero',
  tenant_id: 'xcy',
  connection_id: "string",
  created_at: new Date("2022-08-29T08:02:06.216097Z"),
  updated_at: new Date("2022-08-29T08:02:06.216097Z"),
  workspace: 2
};
