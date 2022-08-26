import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Cacheable, CacheBuster, globalCacheBusterNotifier } from 'ts-cacheable';
import { XeroCredentials } from '../../models/configuration/xero-connector.model';
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
    return this.apiService.post(`/workspaces/${workspaceId}/connect_xero/authorization_code/`, code
    );
  }

  @Cacheable({
    cacheBusterObserver: xeroCredentialsCache
  })
  getXeroCredentials(workspaceId: string): Observable<XeroCredentials> {
    return this.apiService.get(`/workspaces/${workspaceId}/credentials/xero/`, {});
  }

  @CacheBuster({
    cacheBusterNotifier: xeroCredentialsCache
  })
  revokeXeroConnection(workspaceId: string) {
    return this.apiService.post(`/workspaces/${workspaceId}/connection/xero/revoke/`, {});
  }

  @Cacheable()
  getXeroTokenHealth(workspaceId: string): Observable<{}> {
    return this.apiService.get(`/workspaces/${workspaceId}/xero/token_health/`, {});
  }

}
