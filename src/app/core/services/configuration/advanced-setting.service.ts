import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Cacheable, CacheBuster } from 'ts-cacheable';
import { AdvancedSettingGet, AdvancedSettingPost } from '../../models/configuration/advanced-setting.model';
import { ApiService } from '../core/api.service';
import { WorkspaceSchedule, WorkspaceScheduleEmailOptions } from '../../models/db/workspace-schedule.model';
import { WorkspaceService } from '../workspace/workspace.service';

const advancedSettingsCache$ = new Subject<void>();
@Injectable({
  providedIn: 'root'
})
export class AdvancedSettingService {
  workspaceId = this.workspaceService.getWorkspaceId()

  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService
  ) { }

  @Cacheable({
    cacheBusterObserver: advancedSettingsCache$
  })
  getAdvancedSettings(): Observable<AdvancedSettingGet> {
    return this.apiService.get(`/v2/workspaces/${this.workspaceId}/advanced_settings/`, {});
  }

  @CacheBuster({
    cacheBusterNotifier: advancedSettingsCache$
  })
  postAdvancedSettings(advancedSettingPayload: AdvancedSettingPost): Observable<AdvancedSettingGet> {
    return this.apiService.put(`/v2/workspaces/${this.workspaceId}/advanced_settings/`, advancedSettingPayload);
  }

  getWorkspaceAdmins(): Observable<[WorkspaceScheduleEmailOptions]> {
    return this.apiService.get(`/workspaces/${this.workspaceService.getWorkspaceId()}/admins/`, {});
  }
}
