import { getTestBed, TestBed } from '@angular/core/testing';
import { XeroConnectorService } from './xero-connector.service';
import { XeroCredentials } from '../../models/configuration/xero-connector.model';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';
import { of } from 'rxjs';
import { WorkspaceService } from '../workspace/workspace.service';

describe('XeroConnectorService', () => {
  let service: XeroConnectorService;
  let injector: TestBed;
  let httpMock: HttpTestingController;
  const API_BASE_URL = environment.api_url;
  const workspace_id = environment.tests.workspaceId;

  beforeEach(() => {
    const service1 = {
      getWorkspaceId: () => workspace_id
    };
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [XeroConnectorService,
        { provide: WorkspaceService, useValue: service1 }
      ]
    });
    injector = getTestBed();
    service = injector.inject(XeroConnectorService);
    httpMock = injector.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getXeroCredentials service attribuite check', () => {
    const response: XeroCredentials = {
      country: "GB",
      created_at: new Date("2021-10-05T11:56:13.883015Z"),
      id: 219,
      refresh_token: "AB",
      updated_at: new Date("2022-05-06T13:13:25.893837Z"),
      workspace: 1
    };
    service.getXeroCredentials(+workspace_id).subscribe((value) => {
      value.refresh_token="AB";
      expect(value).toEqual(response);
    });
    const req = httpMock.expectOne({
      method: 'GET',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/credentials/xero/`
    });
    req.flush(response);
  });

  
    it('connectXero service check', () => {
      const response={
        id: 1,
        refresh_token: 'fyle',
        is_expired: false,
        realm_id: 'realmId',
        country: 'india',
        company_name: 'Fyle',
        created_at: new Date(),
        updated_at: new Date(),
        workspace: +workspace_id
      };
      service.connectXero(workspace_id,'yyyyy').subscribe(value => {
        expect(value).toEqual(response);
      });
      const req = httpMock.expectOne({
        method: 'POST',
        url: `${API_BASE_URL}/workspaces/${workspace_id}/connect_xero/authorization_code/`
      });
      req.flush(response);
    });

});
