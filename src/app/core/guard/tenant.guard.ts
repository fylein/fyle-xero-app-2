import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { forkJoin, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { globalCacheBusterNotifier } from 'ts-cacheable';
import { OnboardingState } from '../models/enum/enum.model';
import { XeroConnectorService } from '../services/configuration/xero-connector.service';
import { TrackingService } from '../services/integration/tracking.service';
import { WorkspaceService } from '../services/workspace/workspace.service';

@Injectable({
  providedIn: 'root'
})
export class TenantGuard implements CanActivate {

  constructor(
    private xeroConnectorService: XeroConnectorService,
    private router: Router,
    private snackBar: MatSnackBar,
    private trackingService: TrackingService,
    private workspaceService: WorkspaceService
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const workspaceId = this.workspaceService.getWorkspaceId();

      if (!workspaceId) {
        return this.router.navigateByUrl(`workspaces`);
      }

      return forkJoin(
        [
          this.xeroConnectorService.getTenantMappings()
        ]
      ).pipe(
        map(response => !!response),
        catchError(error => {
          if (error.status === 400) {
            globalCacheBusterNotifier.next();
            this.trackingService.onXeroAccountDisconnect();
            this.snackBar.open('Oops! You will need to select a tenant to proceed with the onboarding.', '', { duration: 7000 });
            return this.router.navigateByUrl('workspaces/onboarding/xero_connector');
          }
          return throwError(error);
        })
      );
  }

}
