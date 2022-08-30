import { Injectable } from '@angular/core';
import { ApiService } from '../core/api.service';
import { Observable, of } from 'rxjs';
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
    const responseKeys:Workspace = {
      id: 2,
      name: "Test Sample Statement - GBP",
      user: [1],
      fyle_org_id: "orunxXsIajSE",
      xero_short_code: "",
      last_synced_at: new Date("2022-04-13T10:29:18.796760Z"),
      source_synced_at: new Date("2022-04-13T10:29:18.796760Z"),
      destination_synced_at: new Date("2022-04-13T10:29:18.796760Z"),
      onboarding_state: OnboardingState.CONNECTION,
      created_at: new Date("2022-04-13T10:29:18.796760Z"),
      updated_at: new Date("2022-04-13T10:29:18.796760Z"),
      fyle_currency: 'USD',
      xero_currency: 'USD'
    };
    // Return of(responseKeys);
    return this.apiService.post('/workspaces/', {});
  }

  getWorkspaces(orgId: any): Observable<Workspace[]> {
    const responseKeys:Workspace[] = [{
      id: 2,
      name: "Test Sample Statement - GBP",
      user: [1],
      fyle_org_id: "orunxXsIajSE",
      xero_short_code: "",
      last_synced_at: new Date("2022-04-13T10:29:18.796760Z"),
      source_synced_at: new Date("2022-04-13T10:29:18.796760Z"),
      destination_synced_at: new Date("2022-04-13T10:29:18.796760Z"),
      onboarding_state: OnboardingState.CONNECTION,
      created_at: new Date("2022-04-13T10:29:18.796760Z"),
      updated_at: new Date("2022-04-13T10:29:18.796760Z"),
      fyle_currency: 'USD',
      xero_currency: 'USD'
    }];
    // Return of(responseKeys);
    return this.apiService.get(`/workspaces/`, {
      org_id: orgId
    });
  }

  getWorkspaceById(id:number): Observable<Workspace> {
    const responseKeys:Workspace = {
      id: 2,
      name: "Test Sample Statement - GBP",
      user: [1],
      fyle_org_id: "orunxXsIajSE",
      xero_short_code: "",
      last_synced_at: new Date("2022-04-13T10:29:18.796760Z"),
      source_synced_at: new Date("2022-04-13T10:29:18.796760Z"),
      destination_synced_at: new Date("2022-04-13T10:29:18.796760Z"),
      onboarding_state: OnboardingState.CONNECTION,
      created_at: new Date("2022-04-13T10:29:18.796760Z"),
      updated_at: new Date("2022-04-13T10:29:18.796760Z"),
      fyle_currency: 'USD',
      xero_currency: 'USD'
    };
    // Return of(responseKeys);
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

    // Return of({});
    return this.apiService.post(`/workspaces/${workspaceId}/xero/sync_dimensions/`, {}).pipe(
        map(data => data),
        publishReplay(1),
        refCount()
    );
  }

  syncFyleDimensions() {
    const workspaceId = this.getWorkspaceId();

    // Return of({});
    return this.apiService.post(`/workspaces/${workspaceId}/fyle/sync_dimensions/`, {}).pipe(
        map(data => data),
        publishReplay(1),
        refCount()
      );
  }

  refreshXeroDimensions() {
    // Return of({});
    const workspaceId = this.getWorkspaceId();

    return this.apiService.post(`/workspaces/${workspaceId}/xero/refresh_dimensions/`, {});
  }

  refreshFyleDimensions() {
    const workspaceId = this.getWorkspaceId();

    return this.apiService.post(`/workspaces/${workspaceId}/fyle/refresh_dimensions/`, {});
  }

  getFyleCurrency() {
    return this.storageService.get('currency');
  }

}
