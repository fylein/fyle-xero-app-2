import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AdvancedSettingsComponent } from './advanced-settings.component';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from 'src/app/shared/shared.module';
import { adminEmails, advancedSettingResponse, destinationAttribute, emailResponse, errorResponse, getadvancedSettingResponse, getadvancedSettingResponse2, mockPaymentSyncOptions, response } from './advanced-settings.fixture';
import { Router } from '@angular/router';
import { AdvancedSettingService } from 'src/app/core/services/configuration/advanced-setting.service';
import { MappingService } from 'src/app/core/services/misc/mapping.service';
import { WorkspaceService } from 'src/app/core/services/workspace/workspace.service';
import { of, throwError } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { OnboardingState, PaymentSyncDirection } from '../../../../core/models/enum/enum.model';
import { environment } from 'src/environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('AdvancedSettingsComponent', () => {
  let component: AdvancedSettingsComponent;
  let fixture: ComponentFixture<AdvancedSettingsComponent>;
  const routerSpy = { navigate: jasmine.createSpy('navigate'), url: '/path' };
  let router: Router;
  let advancedSettingService: AdvancedSettingService;
  let mappingService: MappingService;
  let workspace: WorkspaceService;
  let service1: any;
  let service2: any;
  let service3: any;
  let formbuilder: FormBuilder;
  let dialogSpy: jasmine.Spy;
  let dialogSpy1: jasmine.Spy;
  const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of({hours: 1,
    schedule_enabled: true,
    emails_selected: ["fyle@fyle.in"],
    email_added: {name: "fyle", email: 'fyle@fyle.in'}}), close: null });
  dialogRefSpyObj.componentInstance = { body: '' };

  beforeEach(async () => {
    localStorage.setItem('workspaceId', environment.tests.workspaceId);
    service1 = {
      postAdvancedSettings: () => of(advancedSettingResponse),
      getAdvancedSettings: () => of(getadvancedSettingResponse),
      getWorkspaceAdmins: () => of(adminEmails),
      getPaymentSyncOptions: () => mockPaymentSyncOptions,
      getFrequencyIntervals: () => [{label: '1 Hour', value: 1}],
      patchAdminEmailsEmitter: of(adminEmails),
    };

    service2 = {
      getXeroDestinationAttributes: () => of(destinationAttribute)
    };

    service3 = {
      getWorkspaceGeneralSettings: () => of(response),
      getOnboardingState: () => 'ADVANCED_CONFIGURATION',
      setOnboardingState: () => undefined,
      getWorkspaceId: () => environment.tests.workspaceId
    };
    await TestBed.configureTestingModule({
      imports: [ RouterTestingModule, HttpClientModule, FormsModule, ReactiveFormsModule, MatSnackBarModule, SharedModule, NoopAnimationsModule],
      declarations: [ AdvancedSettingsComponent ],
      providers: [ FormBuilder,
        { provide: Router, useValue: routerSpy },
        { provide: AdvancedSettingService, useValue: service1 },
        { provide: MappingService, useValue: service2 },
        { provide: WorkspaceService, useValue: service3 }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvancedSettingsComponent);
    component = fixture.componentInstance;
    formbuilder = TestBed.inject(FormBuilder);
    component.workspaceGeneralSettings = response;
    component.advancedSettings = getadvancedSettingResponse;
    const form = formbuilder.group({
      paymentSync: [PaymentSyncDirection.FYLE_TO_XERO],
      billPaymentAccount: [component.advancedSettings.general_mappings.payment_account?.id],
      changeAccountingPeriod: [component.advancedSettings.workspace_general_settings.change_accounting_period],
      autoCreateVendors: [component.advancedSettings.workspace_general_settings.auto_create_destination_entity],
      exportSchedule: [component.advancedSettings.workspace_schedules?.enabled ? component.advancedSettings.workspace_schedules.interval_hours : false],
      exportScheduleFrequency: [component.advancedSettings.workspace_schedules?.enabled ? component.advancedSettings.workspace_schedules.interval_hours : null],
      searchOption: [],
      emails: [emailResponse.emails_selected],
      addedEmail: []
    });
    component.advancedSettingsForm = form;
    router = TestBed.inject(Router);
    advancedSettingService = TestBed.inject(AdvancedSettingService);
    workspace = TestBed.inject(WorkspaceService);
    mappingService = TestBed.inject(MappingService);
    dialogSpy = spyOn(TestBed.get(MatSnackBar), 'open').and.returnValue(dialogRefSpyObj);
    dialogSpy1 = spyOn(TestBed.get(MatDialog), 'open').and.returnValue(dialogRefSpyObj);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('navigateToPreviousStep function check', () => {
    component.navigateToPreviousStep();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/workspaces/onboarding/import_settings']);
  });

  it('setupForm function check', () => {
    component.advancedSettings=getadvancedSettingResponse2;
    (component as any).setupForm();
    fixture.detectChanges();
    expect(component.isLoading).toBeFalse();
    component.advancedSettings.workspace_general_settings.sync_xero_to_fyle_payments = true;
    component.advancedSettings.workspace_general_settings.sync_fyle_to_xero_payments = false;
    (component as any).setupForm();
    fixture.detectChanges();
    expect(component.isLoading).toBeFalse();
  });

  it('Save Function check', () => {
    const form = formbuilder.group({
      paymentSync: [PaymentSyncDirection.FYLE_TO_XERO],
      billPaymentAccount: [component.advancedSettings.general_mappings.payment_account?.id],
      changeAccountingPeriod: [component.advancedSettings.workspace_general_settings.change_accounting_period],
      autoCreateVendors: [component.advancedSettings.workspace_general_settings.auto_create_destination_entity],
      exportSchedule: [component.advancedSettings.workspace_schedules?.enabled ? component.advancedSettings.workspace_schedules.interval_hours : false],
      exportScheduleFrequency: [component.advancedSettings.workspace_schedules?.enabled ? component.advancedSettings.workspace_schedules.interval_hours : null],
      searchOption: [],
      emails: [emailResponse.emails_selected],
      addedEmail: []
    });
    component.saveInProgress = false;
    component.advancedSettingsForm = form;
    component.isOnboarding = true;
    spyOn(advancedSettingService, 'postAdvancedSettings').and.callThrough();
    spyOn(workspace, 'getOnboardingState').and.callThrough();
    spyOn(workspace, 'setOnboardingState').and.callThrough();
    expect(component.save()).toBeUndefined();
    fixture.detectChanges();
    expect(advancedSettingService.postAdvancedSettings).toHaveBeenCalled();
    expect(workspace.getOnboardingState).toHaveBeenCalled();
    expect(workspace.setOnboardingState).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/workspaces/onboarding/done']);
  });

  it('Save Function check', () => {
    const form = formbuilder.group({
      paymentSync: [PaymentSyncDirection.FYLE_TO_XERO],
      billPaymentAccount: [component.advancedSettings.general_mappings.payment_account?.id],
      changeAccountingPeriod: [component.advancedSettings.workspace_general_settings.change_accounting_period],
      autoCreateVendors: [component.advancedSettings.workspace_general_settings.auto_create_destination_entity],
      exportSchedule: [component.advancedSettings.workspace_schedules?.enabled ? component.advancedSettings.workspace_schedules.interval_hours : false],
      exportScheduleFrequency: [component.advancedSettings.workspace_schedules?.enabled ? component.advancedSettings.workspace_schedules.interval_hours : null],
      searchOption: [],
      emails: [emailResponse.emails_selected],
      addedEmail: []
    });
    component.saveInProgress = false;
    component.advancedSettingsForm = form;
    component.isOnboarding = false;
    spyOn(advancedSettingService, 'postAdvancedSettings').and.callThrough();
    spyOn(workspace, 'getOnboardingState').and.returnValue(OnboardingState.COMPLETE);
    expect(component.save()).toBeUndefined();
    fixture.detectChanges();
    expect(advancedSettingService.postAdvancedSettings).toHaveBeenCalled();
    expect(workspace.getOnboardingState).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/workspaces/main/dashboard']);
  });

  it('Save FAILURE Function check', () => {
    const form = formbuilder.group({
      paymentSync: [PaymentSyncDirection.FYLE_TO_XERO],
      billPaymentAccount: [component.advancedSettings.general_mappings.payment_account?.id],
      changeAccountingPeriod: [component.advancedSettings.workspace_general_settings.change_accounting_period],
      autoCreateVendors: [component.advancedSettings.workspace_general_settings.auto_create_destination_entity],
      exportSchedule: [component.advancedSettings.workspace_schedules?.enabled ? component.advancedSettings.workspace_schedules.interval_hours : false],
      exportScheduleFrequency: [component.advancedSettings.workspace_schedules?.enabled ? component.advancedSettings.workspace_schedules.interval_hours : null],
      searchOption: [],
      emails: [emailResponse.emails_selected],
      addedEmail: []
    });
    component.saveInProgress = false;
    component.advancedSettingsForm = form;
    component.isOnboarding = false;
    spyOn(advancedSettingService, 'postAdvancedSettings').and.returnValue(throwError(errorResponse));
    expect(component.save()).toBeUndefined();
    fixture.detectChanges();
    expect(advancedSettingService.postAdvancedSettings).toHaveBeenCalled();
    expect(component.saveInProgress).toBeFalse();
  });

  it('createPaymentSyncWatcher function check', () => {
    component.advancedSettingsForm.controls.paymentSync.patchValue(PaymentSyncDirection.FYLE_TO_XERO);
    expect((component as any).createPaymentSyncWatcher()).toBeUndefined();
    fixture.detectChanges();
    component.advancedSettingsForm.controls.paymentSync.patchValue(PaymentSyncDirection.XERO_TO_FYLE);
    expect((component as any).createPaymentSyncWatcher()).toBeUndefined();
  });

  it('createScheduledWatcher function check', () => {
    component.advancedSettingsForm.controls.exportSchedule.patchValue(9);
    expect((component as any).createScheduledWatcher()).toBeUndefined();
    fixture.detectChanges();
    component.advancedSettingsForm.controls.exportSchedule.patchValue(0);
    expect((component as any).createScheduledWatcher()).toBeUndefined();
  });

  it('showPaymentSyncField function check', () => {
    expect(component.showPaymentSyncField()).toBeTruthy();
  });

});
