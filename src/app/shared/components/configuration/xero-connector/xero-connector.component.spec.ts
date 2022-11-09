import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { XeroConnectorComponent } from './xero-connector.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedModule } from 'src/app/shared/shared.module';
import { ActivatedRoute, Router } from '@angular/router';
import { XeroConnectorService } from 'src/app/core/services/configuration/xero-connector.service';
import { of, throwError } from 'rxjs';
import { errorResponse, errorResponse2, exportResponse, response, tenant, Tenantresponse } from './xero-connector.fixture';
import { ExportSettingService } from 'src/app/core/services/configuration/export-setting.service';
import { WorkspaceService } from 'src/app/core/services/workspace/workspace.service';
import { ConfirmationDialog } from 'src/app/core/models/misc/confirmation-dialog.model';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from 'src/app/core/services/core/auth.service';
import { environment } from 'src/environments/environment';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormBuilder } from '@angular/forms';

describe('XeroConnectorComponent', () => {
  let component: XeroConnectorComponent;
  let fixture: ComponentFixture<XeroConnectorComponent>;
  let router: Router;
  let xeroService: XeroConnectorService;
  let exportService: ExportSettingService;
  let workspaceService: WorkspaceService ;
  let authService: AuthService;
  let formbuilder: FormBuilder;
  let service: any;
  let service2: any;
  let service3: any;
  let service4: any;
  let activatedRoute: ActivatedRoute;
  const model: ConfirmationDialog = {
    title: 'FYLE',
    primaryCtaText: 'FYLE',
    contents: 'Added successfully',
    hideSecondaryCTA: false
  };
  let dialogSpy: jasmine.Spy;
  let dialogSpy1: jasmine.Spy;
  const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of({}), close: '' });
  dialogRefSpyObj.componentInstance = { body: '' };
  beforeEach(async () => {
    localStorage.setItem('user', JSON.stringify({ org_id: 'dummy', org_name: 'Fyle' }));
    service = {
      getXeroCredentials: () => of(response),
      connectXero: () => of(response),
      revokeXeroConnection: () => of(response),
      getXeroTenants: () => of(tenant),
      postXeroTenants: () => of(tenant),
      postTenantMapping: () => of(Tenantresponse),
      getTenantMappings: () => of(Tenantresponse)
    };
    service2 = {
      getExportSettings: () => of(exportResponse)
    };
    service3 = {
      refreshXeroDimensions: () => of({}),
      setOnboardingState: () => undefined,
      getWorkspaceId: () => environment.tests.workspaceId
    };
    service4 = {
      logout: () => undefined,
      redirectToFyleOAuth: () => undefined,
      redirectToXeroOAuth: () => undefined
    };
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, SharedModule, MatSnackBarModule, NoopAnimationsModule],
      declarations: [XeroConnectorComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: XeroConnectorService, useValue: service },
        { provide: ExportSettingService, useValue: service2 },
        { provide: WorkspaceService, useValue: service3 },
        { provide: AuthService, useValue: service4},
        { provide: MAT_DIALOG_DATA, useValue: model }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(XeroConnectorComponent);
    component = fixture.componentInstance;
    formbuilder = TestBed.inject(FormBuilder);
    router = TestBed.get(Router);
    xeroService = TestBed.inject(XeroConnectorService);
    exportService = TestBed.inject(ExportSettingService);
    workspaceService = TestBed.inject(WorkspaceService);
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    activatedRoute = TestBed.inject(ActivatedRoute);
    dialogSpy = spyOn(TestBed.get(MatDialog), 'open').and.returnValue(dialogRefSpyObj);
    dialogSpy1 = spyOn(TestBed.get(MatSnackBar), 'open').and.returnValue(dialogRefSpyObj);
    component.tenantList = tenant;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should create, export ervice fails', () => {
    spyOn(xeroService, 'getXeroCredentials').and.callThrough();
    spyOn(exportService, 'getExportSettings').and.returnValue(throwError(errorResponse));
    expect(component.ngOnInit()).toBeUndefined();
    fixture.detectChanges();
    expect(component.isLoading).toBeFalse();
    expect(component.showDisconnectXero).toBeTrue();
    expect(xeroService.getXeroCredentials).toHaveBeenCalled();
    expect(exportService.getExportSettings).toHaveBeenCalled();
  });

  it('should create', () => {
    spyOn(xeroService, 'getXeroCredentials').and.callThrough();
    spyOn(exportService, "getExportSettings").and.callThrough();
    expect(component.ngOnInit()).toBeUndefined();
    fixture.detectChanges();
    // Expect(component.showDisconnectXero).toBeTrue();
    expect(component.isLoading).toBeFalse();
    expect(component.isContinueDisabled).toBeFalse();
    expect(xeroService.getXeroCredentials).toHaveBeenCalled();
    expect(exportService.getExportSettings).toHaveBeenCalled();
  });

  it('should create in failure', () => {
    spyOn(xeroService, 'getXeroCredentials').and.returnValue(throwError(errorResponse));
    expect(component.ngOnInit()).toBeUndefined();
    fixture.detectChanges();
    expect(component.isLoading).toBeFalse();
    expect(component.isXeroConnected).toBeFalsy();
    expect(xeroService.getXeroCredentials).toHaveBeenCalled();
  });

  it('continueToNextStep=> isContinueDisabled = false function check', () => {
    spyOn(router, 'navigate');
    const form = formbuilder.group({
      xeroTenant: '25d7b4cd-ed1c-4c5c-80e5-c058b87db8a1'
      });
    component.xeroConnectorForm = form;
    component.isContinueDisabled = false;
    fixture.detectChanges();
    expect(component.continueToNextStep()).toBeUndefined();
    expect(router.navigate).toHaveBeenCalledWith([`/workspaces/onboarding/export_settings`]);
  });

  it('continueToNextStep=> isContinueDisabled = false and xerocompanyname is fyle function check', () => {
    spyOn(router, 'navigate');
    component.isContinueDisabled = false;
    component.xeroCompanyName = 'fyle';
    fixture.detectChanges();
    expect(component.continueToNextStep()).toBeUndefined();
    expect(router.navigate).toHaveBeenCalledWith([`/workspaces/onboarding/export_settings`]);
  });

  it('continueToNextStep => isContinueDisabled = true function check', () => {
    component.isContinueDisabled = true;
    fixture.detectChanges();
    expect(component.continueToNextStep()).toBeUndefined();
  });

  it('disconnectXero function check', () => {
    spyOn(xeroService, 'revokeXeroConnection').and.callThrough();
    component.xeroCompanyName = 'Xero-Fyle';
    fixture.detectChanges();
    expect(component.disconnectXero()).toBeUndefined();
    expect(xeroService.revokeXeroConnection).toHaveBeenCalled();
  });

  it('disconnectXero function check', () => {
    spyOn(xeroService, 'getXeroCredentials').and.returnValue(throwError(errorResponse2));
    component.xeroCompanyName = 'Xero-Fyle';
    fixture.detectChanges();
    expect(component.disconnectXero()).toBeUndefined();
    expect(xeroService.getXeroCredentials).toHaveBeenCalled();
  });

  it('postXeroCredential function connectXero success check', () => {
    component.xeroConnectionInProgress = true;
    spyOn(xeroService, 'connectXero').and.callThrough();
    spyOn(xeroService, 'postXeroTenants').and.callThrough();
    expect((component as any).postXeroCredentials('ssdsdsdsdsd', 'dsdsdsdsdsds')).toBeUndefined();
    fixture.detectChanges();
    expect(xeroService.connectXero).toHaveBeenCalled();
    expect(xeroService.postXeroTenants).toHaveBeenCalled();
  });

  it('postXeroCredential function connectXero failure check', () => {
    component.xeroConnectionInProgress = true;
    spyOn(xeroService, 'connectXero').and.returnValue(throwError(errorResponse));
    spyOn(router, 'navigate');
    expect((component as any).postXeroCredentials('ssdsdsdsdsd', 'dsdsdsdsdsds')).toBeUndefined();
    fixture.detectChanges();
    expect(xeroService.connectXero).toHaveBeenCalled();
    expect(dialogSpy1).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/workspaces/onboarding/landing']);
  });

  it('postXeroCredential function connectXero failure with message check', () => {
    component.xeroConnectionInProgress = true;
    spyOn(xeroService, 'connectXero').and.returnValue(throwError(errorResponse2));
    spyOn(router, 'navigate');
    expect((component as any).postXeroCredentials('ssdsdsdsdsd', 'dsdsdsdsdsds')).toBeUndefined();
    fixture.detectChanges();
    expect(xeroService.connectXero).toHaveBeenCalled();
    expect(dialogSpy).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/workspaces/onboarding/landing']);
  });

  it('showWarningDialog function check', () => {
    spyOn(router, 'navigate');
    expect((component as any).showWarningDialog()).toBeUndefined();
    fixture.detectChanges();
    expect(dialogSpy).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/workspaces/onboarding/landing']);
  });

  it('switchFyleOrg() function check', () => {
    spyOn(authService, 'logout').and.callThrough();
    spyOn(authService, 'redirectToFyleOAuth').and.callThrough();
    expect(component.switchFyleOrg()).toBeUndefined();
    fixture.detectChanges();
    expect(authService.logout).toHaveBeenCalled();
    expect(authService.redirectToFyleOAuth).toHaveBeenCalled();
  });

  it('connectXero() function check', () => {
    expect(component.connectXero()).toBeUndefined();
  });

  it('Activerouter values', () => {
    activatedRoute.snapshot.queryParams = { code: 'bar', realmId: 'bar' };
    expect(component.ngOnInit()).toBeUndefined();
    fixture.detectChanges();
    expect(component.isLoading).toBeFalse();
  });

  it('getTenant function check', () => {
    expect(component.getTenant()).toBeUndefined();
    expect(component.tenantList).toBe(tenant);
  });

  it('postTenant function check', () => {
    expect(component.postTenant()).toBeUndefined();
    expect(component.tenantList).toBe(tenant);
  });
});
