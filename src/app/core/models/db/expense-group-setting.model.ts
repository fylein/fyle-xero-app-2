import { ExpenseState, CCCExpenseState, ExportDateType } from "../enum/enum.model";

export type ExpenseGroupSettingPost = {
  reimbursable_expense_state: ExpenseState;
  reimbursable_export_date_type: ExportDateType | null;
  ccc_expense_state: CCCExpenseState;
  ccc_export_date_type: ExportDateType | null;
};

export interface ExpenseGroupSetting extends ExpenseGroupSettingPost {
  id: number;
  reimbursable_expense_group_fields: string[];
  reimbursable_export_date_type: ExportDateType;
  corporate_credit_card_expense_group_fields: string[];
  ccc_export_date_type: ExportDateType;
  import_card_credits: boolean;
  created_at: Date;
  updated_at: Date;
  workspace: number;
}

export interface ExpenseGroupSettingGet extends ExpenseGroupSettingPost {
}
