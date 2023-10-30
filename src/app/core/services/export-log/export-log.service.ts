import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Cacheable } from 'ts-cacheable';
import { ExpenseGroupSetting } from '../../models/db/expense-group-setting.model';
import { ExpenseGroup, ExpenseGroupDescription, ExpenseGroupResponse } from '../../models/db/expense-group.model';
import { FyleReferenceType } from '../../models/enum/enum.model';
import { SelectedDateFilter } from '../../models/misc/date-filter.model';
import { ApiService } from '../core/api.service';
import { UserService } from '../misc/user.service';
import { WorkspaceService } from '../workspace/workspace.service';


@Injectable({
  providedIn: 'root'
})
export class ExportLogService {

  workspaceId: string = this.workspaceService.getWorkspaceId();

  private org_id: string = this.userService.getUserProfile().org_id;

  xeroShortCode: string;

  constructor(
    private apiService: ApiService,
    private userService: UserService,
    private workspaceService: WorkspaceService
  ) { }

  @Cacheable()
  getExpenseGroupSettings(): Observable<ExpenseGroupSetting> {
    return this.apiService.get(`/workspaces/${this.workspaceId}/fyle/expense_group_settings/`, {});
  }

  getExpenseGroups(state: string, limit: number, offset: number, selectedDateFilter: SelectedDateFilter | null, exportedAt: string | void): Observable<ExpenseGroupResponse> {
    const params: any = {
      limit,
      offset
    };
    params.tasklog__status = state;
    if (selectedDateFilter) {
      const startDate = selectedDateFilter.startDate.toLocaleDateString().split('/');
      const endDate = selectedDateFilter.endDate.toLocaleDateString().split('/');
      params.exported_at__gte = `${startDate[2]}-${startDate[1]}-${startDate[0]}T00:00:00`;
      params.exported_at__lte = `${endDate[2]}-${endDate[1]}-${endDate[0]}T23:59:59`;
    }

    if (exportedAt) {
      params.exported_at__gte = exportedAt;
    }
    return this.apiService.get(`/workspaces/${this.workspaceId}/fyle/expense_groups/`, params);
  }

  generateExportTypeAndId(expenseGroup: ExpenseGroup) {
    let exportRedirection = null;
    let exportType = null;
    let exportId = null;
    let accountId = null;
    const xeroUrl = 'https://go.xero.com';
    if ('Invoices' in expenseGroup.response_logs && expenseGroup.response_logs.Invoices) {
      exportType = 'Bill';
      exportId = expenseGroup.response_logs.Invoices[0].InvoiceID;
      if (this.xeroShortCode) {
        exportRedirection = `${xeroUrl}/organisationlogin/default.aspx?shortcode=${this.xeroShortCode}&redirecturl=/AccountsPayable/Edit.aspx?InvoiceID=${exportId}`;
      } else {
        exportRedirection = `${xeroUrl}/AccountsPayable/View.aspx?invoiceID=${exportId}`;
      }
    } else if ('BankTransactions' in expenseGroup.response_logs && expenseGroup.response_logs.BankTransactions) {
      exportType = 'Bank Transaction';
      exportId = expenseGroup.response_logs.BankTransactions[0].BankTransactionID;
      accountId = expenseGroup.response_logs.BankTransactions[0].BankAccount.AccountID;
      if (this.xeroShortCode) {
        exportRedirection = `${xeroUrl}/organisationlogin/default.aspx?shortcode=${this.xeroShortCode}&redirecturl=/Bank/ViewTransaction.aspx?bankTransactionID=${exportId}`;
      } else {
        exportRedirection = `${xeroUrl}/Bank/ViewTransaction.aspx?bankTransactionID=${exportId}&accountID=${accountId}`;
      }
    }

    return [exportRedirection, exportId, exportType];
  }

  getReferenceType(description: Partial<ExpenseGroupDescription>): FyleReferenceType {
    let referenceType = FyleReferenceType.EXPENSE_REPORT;

    if (FyleReferenceType.EXPENSE in description) {
      referenceType = FyleReferenceType.EXPENSE;
    } else if (FyleReferenceType.EXPENSE_REPORT in description) {
      referenceType = FyleReferenceType.EXPENSE_REPORT;
    } else if (FyleReferenceType.PAYMENT in description) {
      referenceType = FyleReferenceType.PAYMENT;
    }

    return referenceType;
  }

  generateFyleUrl(expenseGroup: ExpenseGroup, referenceType: FyleReferenceType) : string {
    let url = `${environment.fyle_app_url}/app/`;
    if (referenceType === FyleReferenceType.EXPENSE) {
      url += `main/#/view_expense/${expenseGroup.description.expense_id}`;
    } else if (referenceType === FyleReferenceType.EXPENSE_REPORT) {
      url += `admin/#/reports/${expenseGroup.description.report_id}`;
    } else if (referenceType === FyleReferenceType.PAYMENT) {
      url += `admin/#/settlements/${expenseGroup.description.settlement_id}`;
    }

    return `${url}?org_id=${this.org_id}`;
  }
}
