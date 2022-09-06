import { Injectable } from '@angular/core';
import { Observable, of, Subject, throwError } from 'rxjs';
import { Cacheable, CacheBuster, globalCacheBusterNotifier } from 'ts-cacheable';
import { XeroCredentials } from '../../models/configuration/xero-connector.model';
import { DestinationAttribute } from '../../models/db/destination-attribute.model';
import { TenantMapping, TenantMappingPost } from '../../models/db/tenant-mapping.model';
import { ApiService } from '../core/api.service';
import { WorkspaceService } from '../workspace/workspace.service';

const xeroCredentialsCache = new Subject<void>();


@Injectable({
  providedIn: 'root'
})
export class XeroConnectorService {
  workspaceId = this.workspaceService.getWorkspaceId();

  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService
  ) { }

  @CacheBuster({
    cacheBusterNotifier: xeroCredentialsCache
  })
  connectXero(workspaceId: string, code:string): Observable<XeroCredentials> {
    globalCacheBusterNotifier.next();
    const response: XeroCredentials = {
      country: "GB",
      created_at: new Date("2021-10-05T11:56:13.883015Z"),
      id: +workspaceId,
      refresh_token: "AB",
      company_name: 'Xero',
      updated_at: new Date("2022-05-06T13:13:25.893837Z"),
      workspace: 1
    };
    // Return of(response);
    return this.apiService.post(`/workspaces/${workspaceId}/connect_xero/authorization_code/`, code);
  }

  @Cacheable({
    cacheBusterObserver: xeroCredentialsCache
  })
  getXeroCredentials(workspaceId: string): Observable<XeroCredentials> {
    const response: XeroCredentials = {
      country: "GB",
      created_at: new Date("2021-10-05T11:56:13.883015Z"),
      id: +workspaceId,
      refresh_token: "AB",
      company_name: 'Xero',
      updated_at: new Date("2022-05-06T13:13:25.893837Z"),
      workspace: 1
    };
    const errorResponse = {
      status: 404,
      statusText: "Not Found",
      error: {
        id: 1,
        is_expired: true,
        company_name: 'Xero'
      }
    };
    // Return throwError(errorResponse)
    // Return of(response);
    return this.apiService.get(`/workspaces/${workspaceId}/credentials/xero/`, {});
  }

  @CacheBuster({
    cacheBusterNotifier: xeroCredentialsCache
  })
  revokeXeroConnection(workspaceId: string) {
    // Return of({});
    return this.apiService.post(`/workspaces/${workspaceId}/connection/xero/revoke/`, {});
  }

  @Cacheable()
  getXeroTokenHealth(workspaceId: string): Observable<{}> {
    // Return of({});
    return this.apiService.get(`/workspaces/${workspaceId}/xero/token_health/`, {});
  }

  getXeroTenants(): Observable<DestinationAttribute[]> {
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
    // Return of(response);

    return this.apiService.get(`/workspaces/${this.workspaceId}/xero/tenants/`, {});
  }

  postTenantMappings(tenantMappingPayload: TenantMappingPost): Observable<TenantMapping> {
    const response: TenantMapping = {
      id: 123,
      tenant_name: 'Xero',
      tenant_id: 'xcy',
      connection_id: "string",
      created_at: new Date("2022-08-29T08:02:06.216097Z"),
      updated_at: new Date("2022-08-29T08:02:06.216097Z"),
      workspace: +this.workspaceId
    };
    // Return of(response);
    return this.apiService.post(`/workspaces/${this.workspaceId}/mappings/tenant/`, tenantMappingPayload);
  }

}
