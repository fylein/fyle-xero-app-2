import { getTestBed, TestBed } from '@angular/core/testing';

import { ExportLogService } from './export-log.service';
import { ExpenseGroupSetting } from '../../models/db/expense-group-setting.model';
import { ExpenseState, ExportDateType } from '../../models/enum/enum.model';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';

describe('ExportLogService', () => {
  let service: ExportLogService;
  let injector: TestBed;
  let httpMock: HttpTestingController;
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

});