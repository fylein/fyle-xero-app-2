import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { getImportsettingResponse } from 'src/app/shared/components/configuration/import-settings/import-settings.fixture';
import { ImportSettingGet, ImportSettingModel, ImportSettingPost } from '../../models/configuration/import-setting.model';
import { MappingDestinationField, MappingSourceField } from '../../models/enum/enum.model';
import { ApiService } from '../core/api.service';
import { WorkspaceService } from '../workspace/workspace.service';

@Injectable({
  providedIn: 'root'
})
export class ImportSettingService {
  workspaceId = this.workspaceService.getWorkspaceId()

  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService
  ) { }

  getImportSettings() {
    return this.apiService.get(`/v2/workspaces/${this.workspaceId}/import_settings/`, {});
  }

  postImportSettings(exportSettingsPayload: ImportSettingPost){
    return this.apiService.put(`/v2/workspaces/${this.workspaceId}/import_settings/`, exportSettingsPayload);
  }
}
