import { CorporateCreditCardExpensesObject, ReimbursableExpensesObject } from "../enum/enum.model";

export type PreviewPage = {
  fyleExpense?: boolean,
  xeroReimburse?: ReimbursableExpensesObject | null,
  xeroCCC?: CorporateCreditCardExpensesObject | null
};