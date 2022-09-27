import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
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

  xeroShortCode: any;

  constructor(
    private apiService: ApiService,
    private userService: UserService,
    private workspaceService: WorkspaceService
  ) { }

  @Cacheable()
  getExpenseGroupSettings(): Observable<ExpenseGroupSetting> {
    return this.apiService.get(`/workspaces/${this.workspaceId}/fyle/expense_group_settings/`, {});
  }

  getExpenseGroups(state: string, limit: number, offset: number, selectedDateFilter: SelectedDateFilter | null, exportedAt: Date | void): Observable<ExpenseGroupResponse> {
    const params: any = {
      limit,
      offset,
      state
    };

    if (selectedDateFilter) {
      const startDate = selectedDateFilter.startDate.toLocaleDateString().split('/');
      const endDate = selectedDateFilter.endDate.toLocaleDateString().split('/');
      params.start_date = `${startDate[2]}-${startDate[1]}-${startDate[0]}T00:00:00`;
      params.end_date = `${endDate[2]}-${endDate[1]}-${endDate[0]}T23:59:59`;
    }

    if (exportedAt) {
      params.exported_at = exportedAt;
    }

    const response:any = {"count": 1, "next": null, "previous": null, "results": [{"id": 6553, "expenses": [{"id": 11944, "employee_email": "sravan.kumar@fyle.in", "employee_name": "sravan k", "category": "WIP", "sub_category": null, "project": "Bebe Rexha", "org_id": "orPJvXuoLqvJ", "expense_id": "tx75COnDBjXm", "expense_number": "E/2022/05/T/11", "claim_number": "C/2022/05/R/11", "amount": 65.0, "currency": "USD", "foreign_amount": null, "foreign_currency": null, "tax_amount": null, "tax_group_id": null, "settlement_id": "setHwMulHK6X3", "reimbursable": true, "billable": null, "exported": false, "state": "PAID", "vendor": null, "cost_center": "Adidas", "purpose": null, "report_id": "rp3YxnytLrgS", "corporate_card_id": null, "file_ids": [], "spent_at": "2021-01-11T17:00:00Z", "approved_at": "2022-05-24T13:54:57.723000Z", "expense_created_at": "2022-05-24T13:53:31.773336Z", "expense_updated_at": "2022-05-24T15:54:56.794866Z", "created_at": "2022-05-25T06:02:02.489342Z", "updated_at": "2022-05-25T06:02:02.489360Z", "fund_source": "PERSONAL", "verified_at": null, "custom_properties": {"Card": "", "Killua": "", "Classes": "", "avc_123": null, "New Field": "", "Multi field": "", "Testing This": "", "abc in [123]": null, "POSTMAN FIELD": "", "Netsuite Class": ""}, "paid_on_qbo": false, "payment_number": "P/2022/05/R/9"}], "fund_source": "PERSONAL", "description": {"project": "Bebe Rexha", "report_id": "rp3YxnytLrgS", "fund_source": "PERSONAL", "claim_number": "C/2022/05/R/11", "employee_email": "sravan.kumar@fyle.in"}, "response_logs": {"time": "2022-05-24T23:02:44.641-07:00", "Purchase": {"Id": "2675", "Line": [{"Id": "1", "Amount": 65.0, "DetailType": "AccountBasedExpenseLineDetail", "Description": "sravan.kumar@fyle.in -  - WIP", "AccountBasedExpenseLineDetail": {"AccountRef": {"name": "3510 Food", "value": "106"}, "TaxCodeRef": {"value": "NON"}, "BillableStatus": "NotBillable"}}], "domain": "QBO", "sparse": false, "TxnDate": "2022-05-25", "MetaData": {"CreateTime": "2022-05-24T23:02:44-07:00", "LastUpdatedTime": "2022-05-24T23:02:44-07:00"}, "TotalAmt": 65.0, "EntityRef": {"name": "Amazon", "type": "Vendor", "value": "94"}, "SyncToken": "0", "AccountRef": {"name": "Savings", "value": "36"}, "PurchaseEx": {"any": [{"nil": false, "name": "{http://schema.intuit.com/finance/v3}NameValue", "scope": "javax.xml.bind.JAXBElement$GlobalScope", "value": {"Name": "TxnType", "Value": "54"}, "globalScope": true, "declaredType": "com.intuit.schema.finance.v3.NameValue", "typeSubstituted": false}]}, "CurrencyRef": {"name": "United States Dollar", "value": "USD"}, "CustomField": [], "PaymentType": "Cash", "PrivateNote": "Reimbursable expense by sravan.kumar@fyle.in on 2021-01-11", "DepartmentRef": {"name": "Bebe Rexha", "value": "2"}}}, "employee_name": "sravan k", "created_at": "2022-05-25T06:02:02.590420Z", "exported_at": "2022-05-25T06:02:44.912376Z", "updated_at": "2022-05-25T06:02:44.912506Z", "workspace": 286}]};
    // Return of(response)
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
