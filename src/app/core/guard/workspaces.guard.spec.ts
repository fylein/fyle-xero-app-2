import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { WorkspacesGuard } from './workspaces.guard';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { XeroConnectorService } from '../services/configuration/xero-connector.service';
import { of, throwError } from 'rxjs';
import { WorkspaceService } from '../services/workspace/workspace.service';
import { XeroPreferenceresponse, Xeroresponse, errorResponse } from './workspace.fixture';
import { environment } from 'src/environments/environment';

describe('WorkspacesGuard', () => {
  let guard: WorkspacesGuard;
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
      getXeroCredentials: () => of(Xeroresponse),
      getXeroTokenHealth: () => of({})
    };
    const service2 = {
      getOnboardingState: () => 'COMPLETE',
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
    guard = TestBed.inject(WorkspacesGuard);
    xero = TestBed.inject(XeroConnectorService);
    workspace = TestBed.inject(WorkspaceService);
    dialogSpy = spyOn(TestBed.get(MatSnackBar), 'open').and.returnValue(dialogRefSpyObj);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('canActivate function check', () => {
    spyOn(xero, 'getXeroCredentials').and.callThrough();
    spyOn(workspace, 'getWorkspaceId').and.returnValue(environment.tests.workspaceId);
    const rest = guard.canActivate(act, route).valueOf();
    expect(rest).toBeDefined();
    expect(xero.getXeroCredentials).toHaveBeenCalled();
    expect(workspace.getWorkspaceId).toHaveBeenCalled();
  });

  it('canActivate function check2', () => {
    spyOn(workspace, 'getWorkspaceId').and.callThrough();
    expect(guard.canActivate(act, route)).toBeUndefined();
    expect(workspace.getWorkspaceId).toHaveBeenCalled();
    expect(router.navigateByUrl).toHaveBeenCalledWith('workspaces');
  });

  it('canActivate function check3', () => {
    spyOn(xero, 'getXeroCredentials').and.returnValue(throwError(errorResponse));
    spyOn(workspace, 'getWorkspaceId').and.returnValue(environment.tests.workspaceId);
    spyOn(workspace, 'getOnboardingState').and.callThrough();
    expect(guard.canActivate(act, route)).toBeDefined();
    expect(xero.getXeroCredentials).toHaveBeenCalled();
    expect(workspace.getWorkspaceId).toHaveBeenCalled();
    // Expect(workspace.getOnboardingState).toHaveBeenCalled();
    // Expect(router.navigateByUrl).toHaveBeenCalledWith('workspaces/onboarding/xero_connector');
  });

});
