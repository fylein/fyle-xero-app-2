import { ComponentFixture, getTestBed, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HeaderComponent } from './header.component';
import { TrimCharacterPipe } from '../../../pipes/trim-character.pipe';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from 'src/app/shared/shared.module';
import { XeroConnectorService } from 'src/app/core/services/configuration/xero-connector.service';
import { AuthService } from 'src/app/core/services/core/auth.service';
import { WorkspaceService } from 'src/app/core/services/workspace/workspace.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, ReplaySubject, throwError } from 'rxjs';
import { response, Tenantresponse } from '../../configuration/xero-connector/xero-connector.fixture';
import { NavigationStart, Router, RouterEvent } from '@angular/router';
import { Renderer2, Type } from '@angular/core';
import { environment } from 'src/environments/environment';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let injector: TestBed;
  let xeroConnectorService: XeroConnectorService;
  let authService: AuthService;
  let workspace: WorkspaceService;
  let service1: any;
  let service2: any;
  let service3: any;
  let service4: any;
  let renderer2: Renderer2;
  let dialogSpy: jasmine.Spy;
  // Let methodSpy: jasmine.Spy;
  const eventSubject = new ReplaySubject<RouterEvent>(1);
  const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of({}), close: null });
  dialogRefSpyObj.componentInstance = { body: '' };
  const routerMock = {
    navigate: jasmine.createSpy('navigate'),
        events: eventSubject.asObservable(),
        url: 'test/url'
  };
  beforeEach(async () => {
    service1 = {
      logout: () => undefined,
      redirectToFyleOAuth: () => undefined,
      redirectToXeroOAuth: () => undefined,
      redirectToOnboardingLogin: () => undefined,
      redirectToOnboardingLanding: () => undefined
    };

    service2 = {
      revokeXeroConnection: () => of(response),
      getXeroCredentials: () => of(response),
      getTenantMappings: () => of(Tenantresponse)
    };
    const eve = new Event('click', {});
    service3 = {
      listen: () => of({eve})
    };

    service4 = {
      getCurrency: () => 'USD',
      patchWorkspace: () => of({ app: 'done' }),
      getWorkspaceCreatedAt: () => new Date('2022-06-05T09:30:00.000Z'),
      getWorkspaceId: () => environment.tests.workspaceId
    };
    const localStorageDump = {
      email: 'fyle@fyle.in',
      access_token: 'kkk',
      refresh_token: 'uuuu',
      employee_email: 'fyle@fyle.in',
      full_name: 'Fyle Integration',
      user_id: '12',
      org_id: '12',
      org_name: 'Fyle Integration'
    };
    localStorage.setItem('user', JSON.stringify(localStorageDump));
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, SharedModule, MatDialogModule, HttpClientTestingModule],
      declarations: [HeaderComponent, TrimCharacterPipe],
      providers: [
        { provide: AuthService, useValue: service1},
        { provide: XeroConnectorService, useValue: service2},
        { provide: Router, useValue: routerMock},
        { provide: Renderer2, useValue: service3},
        { provide: WorkspaceService, useValue: service4}
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    injector = getTestBed();
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    xeroConnectorService = TestBed.inject(XeroConnectorService);
    renderer2 = fixture.componentRef.injector.get<Renderer2>(Renderer2 as Type<Renderer2>);
    workspace = TestBed.inject(WorkspaceService);
    spyOn(renderer2, 'listen').and.callThrough();
    fixture.detectChanges();
    dialogSpy = spyOn(TestBed.get(MatDialog), 'open').and.returnValue(dialogRefSpyObj);
    component.currency = {
      fyle_currency: 'USD',
      xero_currency: 'USD'
    };
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should create', () => {
    spyOn(xeroConnectorService, 'getXeroCredentials').and.callThrough();
    expect(component.ngOnInit()).toBeUndefined();
    eventSubject.next(new NavigationStart(1, 'export_log'));
    fixture.detectChanges();
    expect(xeroConnectorService.getXeroCredentials).toHaveBeenCalled();
    expect(component.showBackButton).toBeTrue();
    expect(component.activePage).toEqual('Export Log');
  });

  it('component failure response', () => {
    const response = { status: 404, statusText: "Not Found", error: { id: 2, company_name: 'Xero' } };
    spyOn(xeroConnectorService, 'getXeroCredentials').and.returnValue(throwError(response));
    expect(component.ngOnInit()).toBeUndefined();
    fixture.detectChanges();
    expect(xeroConnectorService.getXeroCredentials).toHaveBeenCalled();
    expect(component.isXeroConnected).toBeFalse();
  });

  it('navigate function check', () => {
    expect(component.navigateBack()).toBeUndefined();
  });

  it('showOrHideProfileDropdown function check', () => {
    component.isProfileExpanded = true;
    fixture.detectChanges();
    component.showOrHideProfileDropdown();
    fixture.detectChanges();
    expect(component.isProfileExpanded).toBeFalse();

    component.isProfileExpanded = false;
    fixture.detectChanges();
    component.showOrHideProfileDropdown();
    fixture.detectChanges();
    expect(component.isProfileExpanded).toBeTrue();
  });

  it('showOrHideProfileDropdown function check', () => {
    component.isHelpSectionExpanded = true;
    fixture.detectChanges();
    component.showOrHideHelpDropdown();
    fixture.detectChanges();
    expect(component.isHelpSectionExpanded).toBeFalse();

    component.isHelpSectionExpanded = false;
    fixture.detectChanges();
    component.showOrHideHelpDropdown();
    fixture.detectChanges();
    expect(component.isHelpSectionExpanded).toBeTrue();
  });

  it('get active page name', () => {
    expect((component as any).getActivePageName('/workspaces/main/dashboard')).toBe('Dashboard');
    expect((component as any).getActivePageName('/workspaces/main/export_log')).toBe('Export Log');
    expect((component as any).getActivePageName('/workspaces/main/mapping/project')).toBe('project mapping');
    expect((component as any).getActivePageName('/workspaces/main/configuration/export_settings')).toBe('Export Settings');
    expect((component as any).getActivePageName('/workspaces/main/configuration/import_settings')).toBe('Import Settings');
    expect((component as any).getActivePageName('/workspaces/main/configuration/advanced_settings')).toBe('Advanced Settings');
    expect((component as any).getActivePageName('/workspaces/onboarding/advanced_settings')).toBe('');
    expect((component as any).getActivePageName('/')).toBe('Dashboard');
  });

  it('logout function check', () => {
    spyOn(authService, 'logout').and.callThrough();
    spyOn(authService, 'redirectToOnboardingLogin').and.callThrough();
    expect(component.logout()).toBeUndefined();
    fixture.detectChanges();
    expect(authService.logout).toHaveBeenCalled();
    expect(authService.redirectToOnboardingLogin).toHaveBeenCalled();
  });

  it('switchFyleOrg() function check', () => {
    spyOn(authService, 'logout').and.callThrough();
    spyOn(authService, 'redirectToFyleOAuth').and.callThrough();
    expect(component.switchFyleOrg()).toBeUndefined();
    fixture.detectChanges();
    expect(authService.logout).toHaveBeenCalled();
    expect(authService.redirectToFyleOAuth).toHaveBeenCalled();
  });

  it('DisconnectXero function check', () => {
    spyOn(xeroConnectorService, 'revokeXeroConnection').and.callThrough();
    spyOn(authService, 'redirectToOnboardingLanding').and.callThrough();
    component.disconnectXero();
    fixture.detectChanges();
    expect(xeroConnectorService.revokeXeroConnection).toHaveBeenCalled();
    expect(authService.redirectToOnboardingLanding).toHaveBeenCalled();
    expect(dialogSpy).toHaveBeenCalled();
  });

  it('decode function check', () => {
    const decodedValue = component.decode('add%2Fsub');
    expect(decodedValue).toBe('add/sub');
  });
});
