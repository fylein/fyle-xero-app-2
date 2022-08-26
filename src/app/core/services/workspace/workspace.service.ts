import { Injectable } from '@angular/core';
import { ApiService } from '../core/api.service';
import { Observable } from 'rxjs';
import { StorageService } from '../core/storage.service';
import { Workspace } from '../../models/db/workspace.model';
import { OnboardingState } from '../../models/enum/enum.model';
import { map, publishReplay, refCount } from 'rxjs/operators';
import { WorkspaceGeneralSetting } from '../../models/db/workspace-general-setting.model';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceService {

  constructor(
    private apiService: ApiService,
    private storageService: StorageService) { }

  createWorkspace(): Observable<Workspace> {
    return this.apiService.post('/workspaces/', {});
  }

  getWorkspaces(orgId: any): Observable<Workspace[]> {
    return this.apiService.get(`/workspaces/`, {
      org_id: orgId
    });
  }

  getWorkspaceById(id:number): Observable<Workspace> {
    return this.apiService.get(`/workspaces/${id}/`, {});
  }

  getWorkspaceId(): string {
    return this.storageService.get('workspaceId');
  }

  getWorkspaceGeneralSettings(): Observable<WorkspaceGeneralSetting> {
    return this.apiService.get(`/workspaces/${this.getWorkspaceId()}/settings/general/`, {});
  }

  getOnboardingState(): OnboardingState {
    return this.storageService.get('onboardingState');
  }

  setOnboardingState(onboardingState: OnboardingState): void {
    return this.storageService.set('onboardingState', onboardingState);
  }

  syncXeroDimensions() {
    const workspaceId = this.getWorkspaceId();

    return this.apiService.post(`/workspaces/${workspaceId}/xero/sync_dimensions/`, {}).pipe(
        map(data => data),
        publishReplay(1),
        refCount()
    );
  }

  syncFyleDimensions() {
    const workspaceId = this.getWorkspaceId();

    return this.apiService.post(`/workspaces/${workspaceId}/fyle/sync_dimensions/`, {}).pipe(
        map(data => data),
        publishReplay(1),
        refCount()
      );
  }

  refreshXeroDimensions() {
    const workspaceId = this.getWorkspaceId();

    return this.apiService.post(`/workspaces/${workspaceId}/xero/refresh_dimensions/`, {});
  }

  refreshFyleDimensions() {
    const workspaceId = this.getWorkspaceId();

    return this.apiService.post(`/workspaces/${workspaceId}/fyle/refresh_dimensions/`, {});
  }

}
