import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { XeroCallbackComponent } from './xero-callback.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { XeroConnectorService } from '../core/services/configuration/xero-connector.service';
import { WorkspaceService } from '../core/services/workspace/workspace.service';
import { OnboardingState } from '../core/models/enum/enum.model';
import { of, throwError } from 'rxjs';
import { errorResponse, errorResponse1, response } from './xero-callback-routing.fixture';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('XeroCallbackComponent', () => {
  let component: XeroCallbackComponent;
  let fixture: ComponentFixture<XeroCallbackComponent>;
  let xeroConnectorService: XeroConnectorService;
  let workspace: WorkspaceService;
  let route: Router;
  let router: ActivatedRoute;
  const routerSpy = { navigate: jasmine.createSpy('navigate'), url: '/onboarding' };
  let dialogSpy: jasmine.Spy;
  const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of({title: 'FYLE',
  primaryCtaText: 'FYLE',
  contents: 'Added successfully',
  hideSecondaryCTA: false}), close: null });
  dialogRefSpyObj.componentInstance = { body: '' };
  beforeEach(async () => {
    const service1 = {
      connectXero: () => of(response)
    };
    const service2 = {
      getOnboardingState: () => OnboardingState.COMPLETE,
      getWorkspaceId: () => 1
    };
    await TestBed.configureTestingModule({
      imports: [ NoopAnimationsModule, RouterTestingModule.withRoutes([{path: 'xero_callback', component: XeroCallbackComponent}]), HttpClientModule, MatDialogModule, MatSnackBarModule],
      declarations: [ XeroCallbackComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: XeroConnectorService, useValue: service1 },
        { provide: WorkspaceService, useValue: service2 },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParams: { code: 'Fyle', realmId: 'Fyle' }
            }
          }
        }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(XeroCallbackComponent);
    component = fixture.componentInstance;
    route = TestBed.inject(Router);
    xeroConnectorService = TestBed.inject(XeroConnectorService);
    router = TestBed.inject(ActivatedRoute);
    workspace = TestBed.inject(WorkspaceService);
    spyOn(route, 'navigate');
    dialogSpy = spyOn(TestBed.get(MatDialog), 'open').and.returnValue(dialogRefSpyObj);
    fixture.detectChanges();
  });

  it('should create', () => {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        code: router.snapshot.queryParams.code,
        realmId: router.snapshot.queryParams.realmId
      }
  };
    spyOn(workspace, 'getOnboardingState').and.returnValue(OnboardingState.ADVANCED_CONFIGURATION);
    expect(component.ngOnInit()).toBeUndefined();
    fixture.detectChanges();
    expect(workspace.getOnboardingState).toHaveBeenCalled();
    expect(route.navigate).toHaveBeenCalledWith(['workspaces/onboarding/xero_connector'], navigationExtras);
  });

  it('should create', () => {
    spyOn(workspace, 'getOnboardingState').and.callThrough();
    spyOn(xeroConnectorService, 'connectXero').and.callThrough();
    expect(component.ngOnInit()).toBeUndefined();
    fixture.detectChanges();
    expect(workspace.getOnboardingState).toHaveBeenCalled();
    expect(xeroConnectorService.connectXero).toHaveBeenCalled();
    expect(route.navigate).toHaveBeenCalledWith([`/workspaces/main/dashboard`]);
  });

  it('should create', () => {
    spyOn(workspace, 'getOnboardingState').and.callThrough();
    spyOn(xeroConnectorService, 'connectXero').and.returnValue(throwError(errorResponse));
    expect(component.ngOnInit()).toBeUndefined();
    fixture.detectChanges();
    expect(workspace.getOnboardingState).toHaveBeenCalled();
    expect(xeroConnectorService.connectXero).toHaveBeenCalled();
    expect(route.navigate).toHaveBeenCalledWith([`/workspaces/onboarding/landing`]);
  });

  it('should create', () => {
    spyOn(workspace, 'getOnboardingState').and.callThrough();
    spyOn(xeroConnectorService, 'connectXero').and.returnValue(throwError(errorResponse1));
    expect(component.ngOnInit()).toBeUndefined();
    fixture.detectChanges();
    expect(workspace.getOnboardingState).toHaveBeenCalled();
    expect(xeroConnectorService.connectXero).toHaveBeenCalled();
    // Expect(route.navigate).toHaveBeenCalledWith([`/workspaces/onboarding/landing`]);
  });
});
