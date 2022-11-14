import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { tenant, Tenantresponse } from 'src/app/shared/components/configuration/xero-connector/xero-connector.fixture';
import { environment } from 'src/environments/environment';
import { XeroConnectorService } from '../services/configuration/xero-connector.service';
import { WorkspaceService } from '../services/workspace/workspace.service';
import { TenantGuard } from './tenant.guard';
import { Xeroresponse } from './workspace.fixture';

describe('WorkspacesGuard', () => {
  let guard: TenantGuard;
  let act: ActivatedRouteSnapshot;
  let route: RouterStateSnapshot;
  let xero: XeroConnectorService;
  let workspace: WorkspaceService;
const router = {
  navigateByUrl: jasmine.createSpy('navigateByUrl')
};
let dialogSpy: jasmine.Spy;
const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of({}), close: null });
dialogRefSpyObj.componentInstance = { body: '' };
beforeEach(() => {
  const service1 = {
    getTenantMappings: () => throwError({status: 400})
  };
  const service2 = {
    getWorkspaceId: () => null
  };
  TestBed.configureTestingModule({
    imports: [RouterTestingModule, HttpClientModule, MatSnackBarModule],
    providers: [
      { provide: XeroConnectorService, useValue: service1 },
      { provide: WorkspaceService, useValue: service2 },
      { provide: Router, useValue: router }
    ]
  });
  guard = TestBed.inject(TenantGuard);
  xero = TestBed.inject(XeroConnectorService);
  workspace = TestBed.inject(WorkspaceService);
  dialogSpy = spyOn(TestBed.get(MatSnackBar), 'open').and.returnValue(dialogRefSpyObj);
});


  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('canActivate function check', () => {
    spyOn(xero, 'getTenantMappings').and.returnValue(of(Tenantresponse));
    spyOn(workspace, 'getWorkspaceId').and.returnValue(environment.tests.workspaceId);
    const rest = guard.canActivate(act, route).valueOf();
    expect(rest).toBeDefined();
    expect(xero.getTenantMappings).toHaveBeenCalled();
    expect(workspace.getWorkspaceId).toHaveBeenCalled();
  });

  it('canActivate function check', () => {
    spyOn(workspace, 'getWorkspaceId').and.callThrough();
    expect(guard.canActivate(act, route)).toBeUndefined();
    expect(workspace.getWorkspaceId).toHaveBeenCalled();
    expect(router.navigateByUrl).toHaveBeenCalledWith('workspaces');
  });
});
