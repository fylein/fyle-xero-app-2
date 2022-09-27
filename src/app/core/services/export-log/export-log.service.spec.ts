import { getTestBed, TestBed } from '@angular/core/testing';

import { ExportLogService } from './export-log.service';
import { ExpenseGroupSetting } from '../../models/db/expense-group-setting.model';
import { ExpenseState, ExportDateType, FyleReferenceType } from '../../models/enum/enum.model';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';
import { ExpenseGroup, ExpenseGroupDescription, ExpenseGroupResponse } from '../../models/db/expense-group.model';

describe('ExportLogService', () => {
  let service: ExportLogService;
  let injector: TestBed;
  let httpMock: HttpTestingController;
  const xeroUrl = 'https://go.xero.com';
  const API_BASE_URL = environment.api_url;
  const workspace_id = environment.tests.workspaceId;
  const FYLE_APP_URL = environment.fyle_app_url;

  beforeEach(() => {
    // TODO: remove this temp hack
    localStorage.setItem('user', JSON.stringify({org_id: 'dummy'}));
    localStorage.setItem('workspaceId', environment.tests.workspaceId);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ExportLogService]
    });
    injector = getTestBed();
    service = injector.inject(ExportLogService);
    httpMock = injector.inject(HttpTestingController);
  });

  it('getExpenseGroupSettings service', () => {
    const response:ExpenseGroupSetting = {
      corporate_credit_card_expense_group_fields: ["employee_email", "report_id", "claim_number", "fund_source"],
      created_at: new Date("2022-04-13T10:29:18.802702Z"),
      reimbursable_expense_state: ExpenseState.PAYMENT_PROCESSING,
      id: 1,
      import_card_credits: false,
      reimbursable_expense_group_fields: ["employee_email", "report_id", "claim_number", "fund_source"],
      reimbursable_export_date_type: ExportDateType.CURRENT_DATE,
      updated_at: new Date("2022-04-13T10:29:18.802749Z"),
      workspace: 1,
      ccc_expense_state: ExpenseState.PAYMENT_PROCESSING,
      ccc_export_date_type: ExportDateType.APPROVED_AT
    };

    service.getExpenseGroupSettings().subscribe(result => {
      expect(result).toEqual(response);
    });
    const req = httpMock.expectOne({
      method: 'GET',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/fyle/expense_group_settings/`
    });
      req.flush(response);
  });

  it('generateFyleUrl() EXPENCE service check', () => {
    const response:string = `${FYLE_APP_URL}/app/main/#/view_expense/expense_id?org_id=dummy`;
    const expencegroup:ExpenseGroup = {
      id: 1,
      fund_source: 'dummy',
      description: {
        claim_number: FyleReferenceType.EXPENSE_REPORT,
        report_id: FyleReferenceType.EXPENSE_REPORT,
        employee_email: 'employee@gmail.com',
        expense_id: FyleReferenceType.EXPENSE,
        settlement_id: FyleReferenceType.PAYMENT
      },
      // Having any here is okay, different qbo exports has different structures
      response_logs: [],
      export_type: 'Expence',
      employee_name: 'Fyle',
      exported_at: new Date(),
      created_at: new Date(),
      updated_at: new Date(),
      workspace: +workspace_id,
      expenses: []
    };
    const actualResponse:string = service.generateFyleUrl(expencegroup, FyleReferenceType.EXPENSE);
    expect(actualResponse).toEqual(response);
  });

  it('generateFyleUrl() EXPENSE_REPORT service check', () => {
    const response:string = `${FYLE_APP_URL}/app/admin/#/reports/claim_number?org_id=dummy`;
    const expencegroup:ExpenseGroup = {
      id: 1,
      fund_source: 'dummy',
      description: {
        claim_number: FyleReferenceType.EXPENSE_REPORT,
        report_id: FyleReferenceType.EXPENSE_REPORT,
        employee_email: 'employee@gmail.com',
        expense_id: FyleReferenceType.EXPENSE,
        settlement_id: FyleReferenceType.PAYMENT
      },
      // Having any here is okay, different qbo exports has different structures
      response_logs: [],
      export_type: 'Expence',
      employee_name: 'Fyle',
      exported_at: new Date(),
      created_at: new Date(),
      updated_at: new Date(),
      workspace: +workspace_id,
      expenses: []
    };
    const actualResponse:string = service.generateFyleUrl(expencegroup, FyleReferenceType.EXPENSE_REPORT);
    expect(actualResponse).toEqual(response);
  });

  it('generateFyleUrl() PAYMENT service check', () => {
    const response:string = `${FYLE_APP_URL}/app/admin/#/settlements/settlement_id?org_id=dummy`;
    const expencegroup:ExpenseGroup = {
      id: 1,
      fund_source: 'dummy',
      description: {
        claim_number: FyleReferenceType.EXPENSE_REPORT,
        report_id: FyleReferenceType.EXPENSE_REPORT,
        employee_email: 'employee@gmail.com',
        expense_id: FyleReferenceType.EXPENSE,
        settlement_id: FyleReferenceType.PAYMENT
      },
      // Having any here is okay, different qbo exports has different structures
      response_logs: [],
      export_type: 'Expence',
      employee_name: 'Fyle',
      exported_at: new Date(),
      created_at: new Date(),
      updated_at: new Date(),
      workspace: +workspace_id,
      expenses: []
    };
    const actualResponse:string = service.generateFyleUrl(expencegroup, FyleReferenceType.PAYMENT);
    expect(actualResponse).toEqual(response);
  });

  it('getReferenceType() service claim_number check', () => {
    const payload:Partial<ExpenseGroupDescription> = {report_id: "rp3YxnytLrgS", claim_number: "C/2022/05/R/11", employee_email: "sravan.kumar@fyle.in"};
    const response = 'claim_number';
    const actualResponse = service.getReferenceType(payload);
    expect(actualResponse).toEqual(response);
  });

  it('getReferenceType() service expense_id check', () => {
    const payload:Partial<ExpenseGroupDescription> = { "expense_id": "txiLJWdg9cZc", "employee_email": "ashwin.t@fyle.in"};
    const response = 'expense_id';
    const actualResponse = service.getReferenceType(payload);
    expect(actualResponse).toEqual(response);
  });

  it('getReferenceType() service settlement_id check', () => {
    const payload:Partial<ExpenseGroupDescription> = { "settlement_id": "setUwjAkWcafS", "employee_email": "ashwin.t@fyle.in"};
    const response = 'settlement_id';
    const actualResponse = service.getReferenceType(payload);
    expect(actualResponse).toEqual(response);
  });

  it('getExpenseGroups service null check', () => {
    const response: ExpenseGroupResponse= {
      count: 0,
      next: 'null',
      previous: "xxx",
      results: []
    };
    service.getExpenseGroups('COMPLETE', 10, 5, null ).subscribe(result => {
      expect(result).toEqual(response);
    });
    const req = httpMock.expectOne({
      method: 'GET',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/fyle/expense_groups/?limit=10&offset=5&state=COMPLETE`
    });
      req.flush(response);
  });

  it('getExpenseGroups service start and end date check', () => {
    const response: ExpenseGroupResponse= {
      count: 0,
      next: 'null',
      previous: "xxx",
      results: []
    };

    const dates = {
      startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      endDate: new Date()
    };

    service.getExpenseGroups('COMPLETE', 10, 5, dates).subscribe(result => {
      expect(result).toEqual(response);
    });

    const req = httpMock.expectOne(
      req => req.method === 'GET' && req.url.includes(`${API_BASE_URL}/workspaces/${workspace_id}/fyle/expense_groups/`)
    );

    expect(req.request.params.get('limit')).toBe('10');
    expect(req.request.params.get('state')).toBe('COMPLETE');
    expect(req.request.params.get('offset')).toBe('5');

    const startDate = dates.startDate.toLocaleDateString().split('/');
    const endDate = dates.endDate.toLocaleDateString().split('/');

    expect(req.request.params.get('start_date')).toBe(`${startDate[2]}-${startDate[1]}-${startDate[0]}T00:00:00`);
    expect(req.request.params.get('end_date')).toBe(`${endDate[2]}-${endDate[1]}-${endDate[0]}T23:59:59`);

    req.flush(response);
  });

  it('getExpenseGroups service export Date check', () => {
    const response: ExpenseGroupResponse= {
      count: 0,
      next: 'null',
      previous: "xxx",
      results: []
    };

    const dates = {
      startDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - new Date().getDay()),
      endDate: new Date()
    };

    const exportAt = new Date();
    service.getExpenseGroups('COMPLETE', 10, 5, dates, exportAt).subscribe(result => {
      expect(result).toEqual(response);
    });
    const req = httpMock.expectOne(
      req => req.method === 'GET' && req.url.includes(`${API_BASE_URL}/workspaces/${workspace_id}/fyle/expense_groups/`)
    );

    expect(req.request.params.get('limit')).toBe('10');
    expect(req.request.params.get('state')).toBe('COMPLETE');
    expect(req.request.params.get('offset')).toBe('5');

    const startDate = dates.startDate.toLocaleDateString().split('/');
    const endDate = dates.endDate.toLocaleDateString().split('/');

    expect(req.request.params.get('start_date')).toBe(`${startDate[2]}-${startDate[1]}-${startDate[0]}T00:00:00`);
    expect(req.request.params.get('end_date')).toBe(`${endDate[2]}-${endDate[1]}-${endDate[0]}T23:59:59`);

    expect(req.request.params.get('exported_at')).toBeTruthy();
    req.flush(response);
  });

  it('generateExportTypeAndId() service null check', () => {
    const expencegroup:ExpenseGroup = {
      id: 1,
      fund_source: 'dummy',
      description: {
        claim_number: FyleReferenceType.EXPENSE_REPORT,
        report_id: FyleReferenceType.EXPENSE_REPORT,
        employee_email: 'employee@gmail.com',
        expense_id: FyleReferenceType.EXPENSE,
        settlement_id: FyleReferenceType.PAYMENT
      },
      // Having any here is okay, different qbo exports has different structures
      response_logs: {},
      export_type: 'Expence',
      employee_name: 'Fyle',
      exported_at: new Date(),
      created_at: new Date(),
      updated_at: new Date(),
      workspace: +workspace_id,
      expenses: []
    };
    const actualresponse = [null, null, null];
    const reponse = service.generateExportTypeAndId(expencegroup);
    expect(reponse).toEqual(actualresponse);
  });

  it('generateExportTypeAndId() service bill check', () => {
    const expencegroup:ExpenseGroup = {
      id: 1,
      fund_source: 'dummy',
      description: {
        claim_number: FyleReferenceType.EXPENSE_REPORT,
        report_id: FyleReferenceType.EXPENSE_REPORT,
        employee_email: 'employee@gmail.com',
        expense_id: FyleReferenceType.EXPENSE,
        settlement_id: FyleReferenceType.PAYMENT
      },
      // Having any here is okay, different qbo exports has different structures
      response_logs: {Invoices: [{Status:	"AUTHORISED", InvoiceID: 1}]},
      export_type: 'Expence',
      employee_name: 'Fyle',
      exported_at: new Date(),
      created_at: new Date(),
      updated_at: new Date(),
      workspace: +workspace_id,
      expenses: []
    };
    const exportUrl = `${xeroUrl}/AccountsPayable/View.aspx?invoiceID=1`;
    const actualresponse = [exportUrl, 1, 'Bill'];
    const reponse = service.generateExportTypeAndId(expencegroup);
    expect(reponse).toEqual(actualresponse);
  });

  it('generateExportTypeAndId() service JournalEntry check', () => {
    const expencegroup:ExpenseGroup = {
      id: 1,
      fund_source: 'dummy',
      description: {
        claim_number: FyleReferenceType.EXPENSE_REPORT,
        report_id: FyleReferenceType.EXPENSE_REPORT,
        employee_email: 'employee@gmail.com',
        expense_id: FyleReferenceType.EXPENSE,
        settlement_id: FyleReferenceType.PAYMENT
      },
      // Having any here is okay, different qbo exports has different structures
      response_logs: {BankTransactions: [{BankAccount: {AccountID:	1}, BankTransactionID: 1}]},
      export_type: 'Expence',
      employee_name: 'Fyle',
      exported_at: new Date(),
      created_at: new Date(),
      updated_at: new Date(),
      workspace: +workspace_id,
      expenses: []
    };
    const exportUrl = `${xeroUrl}/Bank/ViewTransaction.aspx?bankTransactionID=1&accountID=1`;
    const actualresponse = [exportUrl, 1, 'Bank Transaction'];
    const reponse = service.generateExportTypeAndId(expencegroup);
    expect(reponse).toEqual(actualresponse);
  });

});