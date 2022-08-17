import { getTestBed, TestBed } from '@angular/core/testing';
import { WorkspaceService } from './workspace.service';
import { Workspace } from '../../models/db/workspace.model';
import { EmployeeFieldMapping, OnboardingState } from '../../models/enum/enum.model';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';

describe('WorkspaceService', () => {
  let service: WorkspaceService;
  let injector: TestBed;
  let httpMock: HttpTestingController;
  const API_BASE_URL = environment.api_url;
  const workspace_id = environment.tests.workspaceId;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [WorkspaceService]
    });
    injector = getTestBed();
    service = injector.inject(WorkspaceService);
    httpMock = injector.inject(HttpTestingController);
  });

  xit('getWorkspaceid service', () => {
    const id = JSON.stringify(service.getWorkspaceId());
    const org = +workspace_id;
    if (id){
      expect(+id).toEqual(org);
    } else {
      expect(id).toBeNull();
    }

  });

  it('setOnboardingState and getOnboardingState service', () => {
    service.setOnboardingState(OnboardingState.COMPLETE);
    const state = 'COMPLETE';
    const response = service.getOnboardingState();
    expect(state).toEqual(response);
  });

  it('createWorkspace service', () => {
    const responseKeys:Workspace = {
      id: 1,
      name: "Test Sample Statement - GBP",
      user: [1],
      fyle_org_id: "orunxXsIajSE",
      xero_short_code: "",
      last_synced_at: new Date("2022-04-13T10:29:18.796760Z"),
      source_synced_at: new Date("2022-04-13T10:29:18.796760Z"),
      destination_synced_at: new Date("2022-04-13T10:29:18.796760Z"),
      created_at: new Date("2022-04-13T10:29:18.796760Z"),
      updated_at: new Date("2022-04-13T10:29:18.796760Z")
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
      id: 1,
      name: "Test Sample Statement - GBP",
      user: [1],
      fyle_org_id: "orunxXsIajSE",
      xero_short_code: "",
      last_synced_at: new Date("2022-04-13T10:29:18.796760Z"),
      source_synced_at: new Date("2022-04-13T10:29:18.796760Z"),
      destination_synced_at: new Date("2022-04-13T10:29:18.796760Z"),
      created_at: new Date("2022-04-13T10:29:18.796760Z"),
      updated_at: new Date("2022-04-13T10:29:18.796760Z")
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
      source_synced_at: new Date("2022-04-13T10:29:18.796760Z"),
      destination_synced_at: new Date("2022-04-13T10:29:18.796760Z"),
      created_at: new Date("2022-04-13T10:29:18.796760Z"),
      updated_at: new Date("2022-04-13T10:29:18.796760Z")
    };
    service.getWorkspaceById(+workspace_id).subscribe(value => {
      expect(value).toEqual(responseKeys);
    });
    const req = httpMock.expectOne(
      req => req.method === 'GET' && req.url.includes(`${API_BASE_URL}/workspaces`)
    );
  req.flush(responseKeys);
  });

});
