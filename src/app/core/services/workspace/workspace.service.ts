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
    const response:WorkspaceGeneralSetting = {
      auto_create_destination_entity: true,
      change_accounting_period: true,
      charts_of_accounts: ['Expense'],
      created_at: new Date("2022-04-27T11:07:17.694377Z"),
      id: 1,
      import_categories: false,
      import_projects: false,
      import_tax_codes: false,
      skip_cards_mapping: false,
      sync_fyle_to_xero_payments: false,
      sync_xero_to_fyle_payments: false,
      updated_at: new Date("2022-04-28T12:48:39.150177Z"),
      workspace: 5,
      reimbursable_expenses_object: '',
      corporate_credit_card_expenses_object: '',
      map_merchant_to_contact: false,
      auto_map_employees: '',
      import_customers: false
    };
    // Return of(response);
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

  getCurrency() {
    return this.storageService.get('currency');
  }

}
