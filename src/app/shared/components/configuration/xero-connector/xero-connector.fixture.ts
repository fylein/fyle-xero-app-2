import { ExportSettingGet } from "src/app/core/models/configuration/export-setting.model";
import { ExpenseState, ReimbursableExpensesObject, CorporateCreditCardExpensesObject, AutoMapEmployee } from "src/app/core/models/enum/enum.model";

export const response = {
  id: 1,
  refresh_token: 'fyle',
  is_expired: false,
  realm_id: 'realmId',
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
    expense_state: ExpenseState.PAID,
    reimbursable_export_date_type: null,
    ccc_export_date_type: null
  },
  workspace_general_settings: {
    reimbursable_expenses_object: ReimbursableExpensesObject.PURCHASE_BILL,
    corporate_credit_card_expenses_object: CorporateCreditCardExpensesObject.BANK_TRANSACTION,
    auto_map_employees: AutoMapEmployee.EMAIL
  },
  general_mappings: {
    bank_account: {id: '1', name: 'Fyle'}
  },
  workspace_id: 1
};
