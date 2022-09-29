import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ExportSettingGet, ExportSettingPost } from '../../models/configuration/export-setting.model';
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
    return this.apiService.get(`/v2/workspaces/${this.workspaceId}/export_settings/`, {});
  }

  postExportSettings(exportSettingsPayload: ExportSettingPost): Observable<ExportSettingGet> {
    return this.apiService.put(`/v2/workspaces/${this.workspaceId}/export_settings/`, exportSettingsPayload);
  }
}
