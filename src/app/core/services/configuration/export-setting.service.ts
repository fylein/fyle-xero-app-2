import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ExportSettingGet, ExportSettingPost } from '../../models/configuration/export-setting.model';
import { AutoMapEmployee, CorporateCreditCardExpensesObject, ExpenseState, ExportDateType, ReimbursableExpensesObject } from '../../models/enum/enum.model';
import { ApiService } from '../core/api.service';
import { WorkspaceService } from '../workspace/workspace.service';

@Injectable({
  providedIn: 'root'
})
export class ExportSettingService {
  workspaceId = this.workspaceService.getWorkspaceId();
  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService
  ) { }

  getExportSettings(): Observable<ExportSettingGet>{
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
    // Return of(response);
    return this.apiService.get(`/v2/workspaces/${this.workspaceId}/export_settings/`, {});
  }

  postExportSettings(exportSettingsPayload: ExportSettingPost): Observable<ExportSettingGet> {
    return this.apiService.put(`/v2/workspaces/${this.workspaceId}/export_settings/`, exportSettingsPayload);
  }
}
