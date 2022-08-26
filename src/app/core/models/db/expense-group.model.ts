import { FyleReferenceType } from "../enum/enum.model";
import { Expense } from "./expense.model";

export type ExpenseGroupDescription = {
  [FyleReferenceType.EXPENSE_REPORT]: string;
  [FyleReferenceType.REPORT_ID]: string;
  employee_email: string;
  [FyleReferenceType.EXPENSE]: string;
  [FyleReferenceType.PAYMENT]: string;
};

export type ExpenseGroup = {
  id: number;
  fund_source: string;
  description: ExpenseGroupDescription;
  export_type: string;
  employee_name: string;
  exported_at: Date;
  created_at: Date;
  updated_at: Date;
  workspace: number;
  expenses: Expense[];
};

export type ExpenseGroupResponse = {
  count: number;
  next: string;
  previous: string;
  results: ExpenseGroup[];
};

export interface ExpenseGroupList {
  exportedAt: Date;
  employee: [string, string];
  expenseType: 'Credit Card' | 'Reimbursable';
  referenceNumber: string;
  exportedAs: string;
  xeroUrl: string;
  fyleUrl: string;
  fyleReferenceType: FyleReferenceType;
  expenses: Expense[];
}

export type ExportableExpenseGroup = {
  exportable_expense_group_ids: number[];
};
