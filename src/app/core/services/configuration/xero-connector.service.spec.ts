import { getTestBed, TestBed } from '@angular/core/testing';
import { XeroConnectorService } from './xero-connector.service';
import { XeroCredentials } from '../../models/configuration/xero-connector.model';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';
import { WorkspaceService } from '../workspace/workspace.service';
import { DestinationAttribute } from '../../models/db/destination-attribute.model';
import { TenantMapping, TenantMappingPost } from '../../models/db/tenant-mapping.model';

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
      id: +workspace_id,
      refresh_token: "AB",
      company_name: 'Xero',
      updated_at: new Date("2022-05-06T13:13:25.893837Z"),
      workspace: 1
    };
    service.getXeroCredentials(workspace_id).subscribe((value) => {
      value.refresh_token = "AB";
      expect(value).toEqual(response);
    });
    const req = httpMock.expectOne(
      req => req.method === 'GET' && req.url.includes(`${API_BASE_URL}/workspaces`)
    );
    req.flush(response);
  });


  it('connectXero service check', () => {
    const response = {
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
    service.connectXero(workspace_id, 'yyyyy').subscribe(value => {
      expect(value).toEqual(response);
    });
    const req = httpMock.expectOne(
      req => req.method === 'POST' && req.url.includes(`${API_BASE_URL}/workspaces`)
    );
    req.flush(response);
  });

  it('revokeXeroConnection service check', () => {
    const response = {};
    service.revokeXeroConnection(workspace_id).subscribe(value => {
      expect(value).toEqual(response);
    });
    const req = httpMock.expectOne(
      req => req.method === 'POST' && req.url.includes(`${API_BASE_URL}/workspaces/${workspace_id}/connection/xero/revoke/`)
    );
    req.flush(response);
  });

  it('getXeroTokenHealth service check', () => {
    const response = {};
    service.getXeroTokenHealth(workspace_id).subscribe(value => {
      expect(value).toEqual(response);
    });
    const req = httpMock.expectOne({
      method: 'GET',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/xero/token_health/`
    });
    req.flush(response);
  });

  it('getXeroTenantList service check', () => {
    const response: DestinationAttribute[] = [
      {
        active: false,
        attribute_type: "TENANT",
        created_at: new Date("2022-08-29T08:02:06.216066Z"),
        destination_id: "25d7b4cd-ed1c-4c5c-80e5-c058b87db8a1",
        detail: {
          email: "string",
          fully_qualified_name: "string"
        },
        display_name: "Tenant",
        id: 13671,
        updated_at: new Date("2022-08-29T08:02:06.216097Z"),
        value: "Demo Company (Global)",
        workspace: 162
      }
    ];
    service.getXeroTenants().subscribe(value => {
      const keys = Object.keys(value).sort();
      const responseKeys = Object.keys(response).sort();
      expect(keys).toEqual(responseKeys);
    });
    const req = httpMock.expectOne({
      method: 'GET',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/xero/tenants/`
    });
    req.flush(response);
  });

  it('postTenantMappings service check', () => {
    const response: TenantMapping = {
      id: 123,
      tenant_name: 'Xero',
      tenant_id: 'xcy',
      connection_id: "string",
      created_at: new Date("2022-08-29T08:02:06.216097Z"),
      updated_at: new Date("2022-08-29T08:02:06.216097Z"),
      workspace: +workspace_id
    };
    const tenantMappingPayload: TenantMappingPost = {
      tenantId: 'xcy',
      tenantName: 'Xero'
    };
    service.postTenantMappings(tenantMappingPayload).subscribe(value => {
      expect(value).toBe(response);
    });
    const req = httpMock.expectOne({
      method: 'POST',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/mappings/tenant/`
    });
    req.flush(response);
  });
});
