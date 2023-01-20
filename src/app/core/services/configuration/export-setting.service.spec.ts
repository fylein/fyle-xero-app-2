import { getTestBed, TestBed } from '@angular/core/testing';
import { ExportSettingService } from './export-setting.service';
import { ExportSettingGet, ExportSettingPost } from '../../models/configuration/export-setting.model';
import { ExpenseState, ReimbursableExpensesObject, CorporateCreditCardExpensesObject, ExportDateType, AutoMapEmployee } from '../../models/enum/enum.model';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';

describe('ExportSettingService', () => {
  let service: ExportSettingService;
  let injector: TestBed;
  let httpMock: HttpTestingController;
  const API_BASE_URL = environment.api_url;
  const workspace_id = environment.tests.workspaceId;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ExportSettingService]
    });
    injector = getTestBed();
    service = injector.inject(ExportSettingService);
    httpMock = injector.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  it('getExportSettings service check attributes check', () => {
    const response: ExportSettingGet = {
      expense_group_settings: {
        reimbursable_expense_state: ExpenseState.PAID,
        reimbursable_export_date_type: ExportDateType.APPROVED_AT,
        ccc_expense_state: ExpenseState.PAID
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
    service.getExportSettings().subscribe((value) => {
      expect(value).toEqual(response);
    });
    const req = httpMock.expectOne({
      method: 'GET',
      url: `${API_BASE_URL}/v2/workspaces/${workspace_id}/export_settings/`
    });
    req.flush(response);

  });

  it('postEmployeeSettings service check', () => {
    const exportSettingPayload: ExportSettingPost = {
      expense_group_settings: {
        reimbursable_expense_state: ExpenseState.PAID,
        reimbursable_export_date_type: ExportDateType.APPROVED_AT,
        ccc_expense_state: ExpenseState.PAID
      },
      workspace_general_settings: {
        reimbursable_expenses_object: ReimbursableExpensesObject.PURCHASE_BILL,
        corporate_credit_card_expenses_object: CorporateCreditCardExpensesObject.BANK_TRANSACTION,
        auto_map_employees: AutoMapEmployee.EMAIL
      },
      general_mappings: {
        bank_account: {id: '1', name: 'Fyle'}
      }
    };
    const response: ExportSettingGet={
      expense_group_settings: {
        reimbursable_expense_state: ExpenseState.PAID,
        reimbursable_export_date_type: null,
        ccc_expense_state: ExpenseState.PAID
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
    service.postExportSettings(exportSettingPayload).subscribe(value => {
      expect(value).toEqual(response);
    });
    const req = httpMock.expectOne({
      method: 'PUT',
      url: `${API_BASE_URL}/v2/workspaces/${workspace_id}/export_settings/`
    });
    req.flush(response);

  });

});
