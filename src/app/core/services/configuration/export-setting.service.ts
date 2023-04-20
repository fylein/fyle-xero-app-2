import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ExportSettingFormOption, ExportSettingGet, ExportSettingPost } from '../../models/configuration/export-setting.model';
import { ApiService } from '../core/api.service';
import { WorkspaceService } from '../workspace/workspace.service';
import { AutoMapEmployee, ExportDateType } from '../../models/enum/enum.model';

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
    return this.apiService.get(`/v2/workspaces/${this.workspaceId}/export_settings/`, {});
  }

  postExportSettings(exportSettingsPayload: ExportSettingPost): Observable<ExportSettingGet> {
    return this.apiService.put(`/v2/workspaces/${this.workspaceId}/export_settings/`, exportSettingsPayload);
  }

  getAutoMapEmployeeOptions(): ExportSettingFormOption[] {
    return [
      {
        label: 'None',
        value: null
      },
      {
        label: 'Employee name on Fyle to contact name on Xero',
        value: AutoMapEmployee.NAME
      },
      {
        label: 'Employee email on Fyle to contact email on Xero',
        value: AutoMapEmployee.EMAIL
      }
    ];
  }

  getReimbursableExpenseGroupingDateOptions(): ExportSettingFormOption[] {
     return [
      {
        label: 'Current Date',
        value: ExportDateType.CURRENT_DATE
      },
      {
        label: 'Verification Date',
        value: ExportDateType.VERIFIED_AT
      },
      {
        label: 'Spend Date',
        value: ExportDateType.SPENT_AT
      },
      {
        label: 'Approval Date',
        value: ExportDateType.APPROVED_AT
      },
      {
        label: 'Last Spend Date',
        value: ExportDateType.LAST_SPENT_AT
      }
    ];
  }
}
