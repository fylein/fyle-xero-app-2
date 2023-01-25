import { getTestBed, TestBed } from '@angular/core/testing';
import { WorkspaceService } from './workspace.service';
import { Workspace } from '../../models/db/workspace.model';
import { OnboardingState } from '../../models/enum/enum.model';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';
import { WorkspaceGeneralSetting } from '../../models/db/workspace-general-setting.model';
import { Observable } from 'rxjs';

describe('WorkspaceService', () => {
  let service: WorkspaceService;
  let injector: TestBed;
  let httpMock: HttpTestingController;
  const API_BASE_URL = environment.api_url;
  const workspace_id = environment.tests.workspaceId;

  beforeEach(() => {
    localStorage.setItem('workspaceId', environment.tests.workspaceId);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [WorkspaceService]
    });
    injector = getTestBed();
    service = injector.inject(WorkspaceService);
    httpMock = injector.inject(HttpTestingController);
  });

  it('getWorkspaceid service', () => {
    const id = service.getWorkspaceId();
    const org = workspace_id;
    expect(id.toString()).toEqual(org);
  });

  it('setOnboardingState and getOnboardingState service', () => {
    service.setOnboardingState(OnboardingState.COMPLETE);
    const state = 'COMPLETE';
    const response = service.getOnboardingState();
    expect(state).toEqual(response);
  });

  it('createWorkspace service', () => {
    const responseKeys:Workspace = {
      id: 2,
      name: "Test Sample Statement - GBP",
      user: [1],
      fyle_org_id: "orunxXsIajSE",
      xero_short_code: "",
      last_synced_at: new Date("2022-04-13T10:29:18.796760Z"),
      ccc_last_synced_at: new Date("2022-04-13T10:29:18.796760Z"),
      source_synced_at: new Date("2022-04-13T10:29:18.796760Z"),
      destination_synced_at: new Date("2022-04-13T10:29:18.796760Z"),
      created_at: new Date("2022-04-13T10:29:18.796760Z"),
      updated_at: new Date("2022-04-13T10:29:18.796760Z"),
      onboarding_state: OnboardingState.CONNECTION,
      fyle_currency: 'USD',
      xero_currency: 'USD'
    };
    service.createWorkspace().subscribe((value) => {
      expect(value).toEqual(responseKeys);
    });
    const req = httpMock.expectOne({
      method: 'POST',
      url: `${API_BASE_URL}/workspaces/`
    });
  req.flush(responseKeys);
  });

  it('getWorkspace details service', () => {
    const responseKeys:Workspace[] = [{
      id: 2,
      name: "Test Sample Statement - GBP",
      user: [1],
      fyle_org_id: "orunxXsIajSE",
      xero_short_code: "",
      last_synced_at: new Date("2022-04-13T10:29:18.796760Z"),
      ccc_last_synced_at: new Date("2022-04-13T10:29:18.796760Z"),
      source_synced_at: new Date("2022-04-13T10:29:18.796760Z"),
      destination_synced_at: new Date("2022-04-13T10:29:18.796760Z"),
      created_at: new Date("2022-04-13T10:29:18.796760Z"),
      updated_at: new Date("2022-04-13T10:29:18.796760Z"),
      onboarding_state: OnboardingState.CONNECTION,
      fyle_currency: 'USD',
      xero_currency: 'USD'
    }];
    service.getWorkspaces('1').subscribe(value => {
      expect(value).toEqual(responseKeys);
    });
    const req = httpMock.expectOne({
      method: 'GET',
      url: `${API_BASE_URL}/workspaces/?org_id=1`
    });
  req.flush(responseKeys);
  });

  it('getWorkspaceById service', () => {
    const responseKeys:Workspace = {
      id: 2,
      name: "Test Sample Statement - GBP",
      user: [1],
      fyle_org_id: "orunxXsIajSE",
      xero_short_code: "",
      last_synced_at: new Date("2022-04-13T10:29:18.796760Z"),
      ccc_last_synced_at: new Date("2022-04-13T10:29:18.796760Z"),
      source_synced_at: new Date("2022-04-13T10:29:18.796760Z"),
      destination_synced_at: new Date("2022-04-13T10:29:18.796760Z"),
      onboarding_state: OnboardingState.CONNECTION,
      created_at: new Date("2022-04-13T10:29:18.796760Z"),
      updated_at: new Date("2022-04-13T10:29:18.796760Z"),
      fyle_currency: 'USD',
      xero_currency: 'USD'
    };
    service.getWorkspaceById(+workspace_id).subscribe(value => {
      expect(value).toEqual(responseKeys);
    });
    const req = httpMock.expectOne(
      req => req.method === 'GET' && req.url.includes(`${API_BASE_URL}/workspaces`)
    );
  req.flush(responseKeys);
  });

  it('WorkspacegeneralSetting service', () => {
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
      workspace: 1,
      reimbursable_expenses_object: '',
      corporate_credit_card_expenses_object: '',
      map_merchant_to_contact: false,
      auto_map_employees: '',
      import_customers: false,
      is_simplify_report_closure_enabled: false
    };
    service.getWorkspaceGeneralSettings().subscribe((value) => {
      expect(value).toEqual(response);
    });
    const req = httpMock.expectOne({
      method: 'GET',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/settings/general/`
    });
  req.flush(response);
  });

  it('syncFyleDimensions service', () => {
    expect(service.syncFyleDimensions()).toBeTruthy();
  });

  it('syncXeroDimensions service', () => {
    expect(service.syncXeroDimensions()).toBeTruthy();
  });

  it('getFyleCurrency service', () => {
    const response = {
      fyle_currency: 'USD',
      xero_currency: 'USD'
    };
    localStorage.setItem('currency', JSON.stringify(response));
    const currency = service.getCurrency();
    expect(currency).toEqual(response);
  });

  it('patchworkspace service check', () => {
    const response={
      app: 'done'
    };
    service.patchWorkspace().subscribe((value) => {
      expect(value).toBeDefined();
    });
    const req = httpMock.expectOne({
      method: 'PATCH',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/`
    });
  req.flush(response);
  });

  it('getWorkspaceCreatedAt function check', () => {
    expect(service.getWorkspaceCreatedAt()).toBeDefined(Date);
  });
});
