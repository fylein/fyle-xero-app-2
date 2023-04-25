import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CloneSetting } from '../../models/configuration/clone-setting.model';
import { ApiService } from '../core/api.service';
import { WorkspaceService } from '../workspace/workspace.service';

@Injectable({
  providedIn: 'root'
})
export class CloneSettingService {

  workspaceId = this.workspaceService.getWorkspaceId();

  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService
  ) { }

  getCloneSettings(): Observable<CloneSetting> {
    return this.apiService.get(`/v2/workspaces/${this.workspaceId}/clone_settings/`, {});
  }
}
