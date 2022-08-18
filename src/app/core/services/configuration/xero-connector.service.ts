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
  connectXero(workspaceId: any, code:string): Observable<XeroCredentials> {
    globalCacheBusterNotifier.next();
    return this.apiService.post('/workspaces/' + workspaceId + '/connect_xero/authorization_code/', code
    );
  }

  @Cacheable({
    cacheBusterObserver: xeroCredentialsCache
  })
  getXeroCredentials(workspaceId: number): Observable<XeroCredentials> {
    return this.apiService.get('/workspaces/' + workspaceId + '/credentials/xero/', {});
  }

}
