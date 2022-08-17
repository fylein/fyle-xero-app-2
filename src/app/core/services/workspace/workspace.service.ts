import { Injectable } from '@angular/core';
import { ApiService } from '../core/api.service';
import { Observable } from 'rxjs';
import { StorageService } from '../core/storage.service';
import { Workspace } from '../../models/db/workspace.model';
import { OnboardingState } from '../../models/enum/enum.model';

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

  getWorkspaceById(): Observable<Workspace> {
    const workspaceId = this.getWorkspaceId();
    return this.apiService.get(`/workspaces/${workspaceId}/`, {});
  }

  getWorkspaceId(): number|null {
    const id = this.storageService.get('workspaceId');
    return id ? +id : null;
  }

  getOnboardingState(): OnboardingState {
    return this.storageService.get('onboardingState');
  }

  setOnboardingState(onboardingState: OnboardingState): void {
    return this.storageService.set('onboardingState', onboardingState);
  }
  // TODO: Add a method with implicit workspace id and replace calls everwhere
}
