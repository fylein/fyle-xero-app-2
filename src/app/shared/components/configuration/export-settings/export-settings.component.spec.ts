import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AbstractControl, FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { MatSnackBarModule} from '@angular/material/snack-bar';
import { ExportSettingsComponent } from './export-settings.component';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from 'src/app/shared/shared.module';
import { CorporateCreditCardExpensesObject, ExpenseGroupingFieldOption, ExpenseState, ExportDateType, OnboardingState, ReimbursableExpensesObject, TenantFieldMapping } from 'src/app/core/models/enum/enum.model';
import { destinationAttribute, errorResponse, exportResponse, exportResponse1, mockAutoMapEmployeeOptions, mockCCCExpenseGroupingDateOptions, mockReimbursableExpenseGroupingDateOptions, replacecontent1, replacecontent2, workspaceResponse } from './export-settings.fixture';
import { MappingService } from 'src/app/core/services/misc/mapping.service';
import { WorkspaceService } from 'src/app/core/services/workspace/workspace.service';
import { ExportSettingService } from 'src/app/core/services/configuration/export-setting.service';
import { of, throwError } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { environment } from 'src/environments/environment';

describe('ExportSettingsComponent', () => {
  let component: ExportSettingsComponent;
  let fixture: ComponentFixture<ExportSettingsComponent>;
  let exportSettingService: ExportSettingService;
  let workspace: WorkspaceService;
  let mappingService: MappingService;
  let service1: any;
  let service2: any;
  let service3: any;
  const routerSpy = { navigate: jasmine.createSpy('navigate'), url: '/path' };
  let router: Router;
  let formbuilder: FormBuilder;
  let dialogSpy: jasmine.Spy;
  const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of({}), close: null });
  dialogRefSpyObj.componentInstance = { body: '' };
  beforeEach(async () => {
    localStorage.setItem('workspaceId', environment.tests.workspaceId);
    service1 = {
      getExportSettings: () => of(exportResponse),
      postExportSettings: () => of(exportResponse),
      getAutoMapEmployeeOptions: () => mockAutoMapEmployeeOptions,
      getReimbursableExpenseGroupingDateOptions: () => mockReimbursableExpenseGroupingDateOptions,
      getCCCExpenseGroupingDateOptions: () => mockCCCExpenseGroupingDateOptions
    };
    service2 = {
      getGroupedXeroDestinationAttributes: () => of(destinationAttribute),
      refreshMappingPages: () => undefined
    };
    service3 = {
      getWorkspaceGeneralSettings: () => of(workspaceResponse),
      getOnboardingState: () => OnboardingState.EXPORT_SETTINGS,
      setOnboardingState: () => undefined
    };
    await TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, HttpClientModule, RouterTestingModule, MatSnackBarModule, SharedModule, NoopAnimationsModule],
      declarations: [ ExportSettingsComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [ FormBuilder,
        { provide: Router, useValue: routerSpy },
        { provide: ExportSettingService, useValue: service1 },
        { provide: MappingService, useValue: service2 },
        { provide: WorkspaceService, useValue: service3 }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportSettingsComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    formbuilder = TestBed.inject(FormBuilder);
    workspace = TestBed.inject(WorkspaceService);
    mappingService = TestBed.inject(MappingService);
    exportSettingService = TestBed.inject(ExportSettingService);
    dialogSpy = spyOn(TestBed.get(MatDialog), 'open').and.returnValue(dialogRefSpyObj);
    component.exportSettings = exportResponse;
    component.exportSettingsForm = formbuilder.group({
      cccExpenseState: [component.exportSettings.expense_group_settings?.ccc_expense_state],
      reimbursableExpenseState: [component.exportSettings.expense_group_settings?.reimbursable_expense_state],
      reimbursableExpense: [component.exportSettings.workspace_general_settings?.reimbursable_expenses_object ? true : false],
      reimbursableExportType: [component.exportSettings.workspace_general_settings?.reimbursable_expenses_object],
      reimbursableExportDate: [component.exportSettings.expense_group_settings?.reimbursable_export_date_type],
      creditCardExpense: [component.exportSettings.workspace_general_settings?.corporate_credit_card_expenses_object ? true : false],
      creditCardExportType: [component.exportSettings.workspace_general_settings?.corporate_credit_card_expenses_object],
      bankAccount: [component.exportSettings.general_mappings?.bank_account?.id ? component.exportSettings.general_mappings.bank_account : 'dtd'],
      autoMapEmployees: [component.exportSettings.workspace_general_settings?.auto_map_employees],
      searchOption: []
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('save function check', () => {
    component.isOnboarding = true;
    expect(component.save()).toBeUndefined();
    fixture.detectChanges();
    component.exportSettings.workspace_general_settings.corporate_credit_card_expenses_object = null;
    component.exportSettings.workspace_general_settings.reimbursable_expenses_object = ReimbursableExpensesObject.PURCHASE_BILL;
    component.exportSettingsForm.controls.reimbursableExpense.patchValue(true);
    component.exportSettingsForm.controls.creditCardExpense.patchValue(true);
    component.saveInProgress = false;
    expect(component.save()).toBeUndefined();
    fixture.detectChanges();
    component.exportSettings.workspace_general_settings.reimbursable_expenses_object = ReimbursableExpensesObject.PURCHASE_BILL;
    component.exportSettings.workspace_general_settings.corporate_credit_card_expenses_object = CorporateCreditCardExpensesObject.BANK_TRANSACTION;
    component.exportSettingsForm.controls.reimbursableExpense.patchValue(false);
    component.exportSettingsForm.controls.creditCardExpense.patchValue(true);
    component.saveInProgress = false;
    fixture.detectChanges();
    expect(component.save()).toBeUndefined();
    component.exportSettings.workspace_general_settings.reimbursable_expenses_object = ReimbursableExpensesObject.PURCHASE_BILL;
    component.exportSettings.workspace_general_settings.corporate_credit_card_expenses_object = CorporateCreditCardExpensesObject.BANK_TRANSACTION;
    component.exportSettingsForm.controls.reimbursableExpense.patchValue(true);
    component.exportSettingsForm.controls.creditCardExpense.patchValue(true);
    component.saveInProgress = false;
    expect(component.save()).toBeUndefined();
  });

  it('getExportType function check', () => {
    const response = ReimbursableExpensesObject.PURCHASE_BILL;
    const output = response.toLowerCase().charAt(0).toUpperCase() + response.toLowerCase().slice(1);
    expect(component.getExportType(ReimbursableExpensesObject.PURCHASE_BILL)).toEqual(output);
  });

  it('navigateToPreviousStep function check', () => {
    expect(component.navigateToPreviousStep()).toBeUndefined();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/workspaces/onboarding/xero_connector']);
  });

  it('showConfirmationDialog function check', () => {
    expect((component as any).showConfirmationDialog()).toBeUndefined();
    fixture.detectChanges();
    expect(dialogSpy).toHaveBeenCalled();
  });

  it('generateGroupingLabel function check', () => {
    component.exportSettingsForm.controls.reimbursableExportType.patchValue(ReimbursableExpensesObject.PURCHASE_BILL);
    fixture.detectChanges();
    expect(component.generateGroupingLabel('reimbursable')).toEqual('How should the expenses be grouped?');
    const exporttype = component.getExportType(CorporateCreditCardExpensesObject.BANK_TRANSACTION);
    component.exportSettingsForm.controls.creditCardExportType.patchValue(CorporateCreditCardExpensesObject.BANK_TRANSACTION);
    fixture.detectChanges();
    expect(component.generateGroupingLabel('credit card')).toEqual('How should the expense in '+ exporttype + ' be grouped?');
  });

  it('showReimbursableAccountsPayableField function check', () => {
    component.tenantFieldMapping = TenantFieldMapping.TENANT;
    component.exportSettingsForm.controls.reimbursableExportType.patchValue(ReimbursableExpensesObject.PURCHASE_BILL);
    fixture.detectChanges();
    expect(component.showReimbursableAccountsPayableField()).toBeTrue();
  });

  it('setGeneralMappingsValidator function check', () => {
    component.exportSettingsForm.controls.creditCardExportType.patchValue(CorporateCreditCardExpensesObject.BANK_TRANSACTION);
    fixture.detectChanges();
    expect((component as any).setGeneralMappingsValidator()).toBeUndefined();
  });

  it('advancedSettingAffected function check', () => {
    component.exportSettings.workspace_general_settings.corporate_credit_card_expenses_object = CorporateCreditCardExpensesObject.BANK_TRANSACTION;
    component.exportSettings.workspace_general_settings.reimbursable_expenses_object = null;
    component.exportSettingsForm.controls.reimbursableExpense.patchValue(true);
    fixture.detectChanges();
    expect((component as any).advancedSettingAffected()).toBeTrue();
    expect((component as any).updateExportSettings()).toBeTrue();
    component.exportSettings.workspace_general_settings.reimbursable_expenses_object = null;
    component.exportSettings.workspace_general_settings.corporate_credit_card_expenses_object = null;
    fixture.detectChanges();
    expect((component as any).updateExportSettings()).toBeFalse();
    expect((component as any).advancedSettingAffected()).toBeFalse();
    component.exportSettings = exportResponse1;
    fixture.detectChanges();
    expect((component as any).updateExportSettings()).toBeFalse();
    expect((component as any).advancedSettingAffected()).toBeFalse();
  });

  it('replaceContentBasedOnConfiguration function check', () => {
    expect((component as any).replaceContentBasedOnConfiguration('BILL', 'CHECK', 'reimbursable').length).toBeGreaterThan(replacecontent1.length);
    expect((component as any).replaceContentBasedOnConfiguration('None', 'None', 'reimbursable').length).toBeGreaterThan(replacecontent2.length);
  });

  it('constructWarningMessage function check', () => {
    component.exportSettings.workspace_general_settings.reimbursable_expenses_object = null;
    component.exportSettings.workspace_general_settings.corporate_credit_card_expenses_object = CorporateCreditCardExpensesObject.BANK_TRANSACTION;
    component.exportSettingsForm.controls.reimbursableExpense.patchValue(true);
    component.exportSettingsForm.controls.creditCardExpense.patchValue(true);
    fixture.detectChanges();
    expect((component as any).constructWarningMessage().length).toBeGreaterThanOrEqual(0);
    component.exportSettingsForm.controls.reimbursableExpense.patchValue(true);
    component.exportSettingsForm.controls.creditCardExpense.patchValue(true);
    component.exportSettings.workspace_general_settings.reimbursable_expenses_object = ReimbursableExpensesObject.PURCHASE_BILL;
    component.exportSettings.workspace_general_settings.corporate_credit_card_expenses_object = null;
    component.exportSettingsForm.controls.creditCardExportType.setValue(CorporateCreditCardExpensesObject.BANK_TRANSACTION);
    component.exportSettingsForm.controls.reimbursableExportType.patchValue(ReimbursableExpensesObject.PURCHASE_BILL);
    fixture.detectChanges();
    expect((component as any).constructWarningMessage().length).toBeGreaterThanOrEqual(0);
    component.exportSettingsForm.controls.reimbursableExpense.patchValue(false);
    component.exportSettingsForm.controls.creditCardExpense.patchValue(true);
    component.exportSettings.workspace_general_settings.reimbursable_expenses_object = ReimbursableExpensesObject.PURCHASE_BILL;
    component.exportSettings.workspace_general_settings.corporate_credit_card_expenses_object = null;
    component.exportSettingsForm.controls.reimbursableExportType.patchValue(ReimbursableExpensesObject.PURCHASE_BILL);
    component.exportSettingsForm.controls.creditCardExportType.patchValue(CorporateCreditCardExpensesObject.BANK_TRANSACTION);
    fixture.detectChanges();
    expect((component as any).constructWarningMessage().length).toBeGreaterThanOrEqual(0);
    component.exportSettingsForm.controls.reimbursableExpense.patchValue(true);
    component.exportSettingsForm.controls.creditCardExpense.patchValue(false);
    component.exportSettings.workspace_general_settings.reimbursable_expenses_object = null;
    component.exportSettings.workspace_general_settings.corporate_credit_card_expenses_object = CorporateCreditCardExpensesObject.BANK_TRANSACTION;
    component.exportSettingsForm.controls.reimbursableExportType.patchValue(ReimbursableExpensesObject.PURCHASE_BILL);
    component.exportSettingsForm.controls.creditCardExportType.patchValue(CorporateCreditCardExpensesObject.BANK_TRANSACTION);
    expect((component as any).constructWarningMessage().length).toBeGreaterThanOrEqual(0);
  });

  it('constructPayloadAndSave function check', () => {
    component.isOnboarding = true;
    spyOn(workspace, 'getOnboardingState').and.returnValue(OnboardingState.ADVANCED_CONFIGURATION);
    expect((component as any).constructPayloadAndSave()).toBeUndefined();
  });

  it('constructPayloadAndSave function check', () => {
    spyOn(mappingService, 'refreshMappingPages').and.callThrough();
    component.isOnboarding = false;
    component.exportSettings.workspace_general_settings.reimbursable_expenses_object = null;
    component.exportSettings.workspace_general_settings.corporate_credit_card_expenses_object = null;
    fixture.detectChanges();
    expect((component as any).constructPayloadAndSave()).toBeUndefined();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/workspaces/main/dashboard']);
    expect(mappingService.refreshMappingPages).toHaveBeenCalled();
  });

  it('constructPayloadAndSave function check', () => {
    component.isOnboarding = false;
    component.exportSettings.workspace_general_settings.reimbursable_expenses_object = null;
    component.exportSettings.workspace_general_settings.corporate_credit_card_expenses_object = CorporateCreditCardExpensesObject.BANK_TRANSACTION;
    component.exportSettingsForm.controls.reimbursableExpense.patchValue(true);
    fixture.detectChanges();
    expect((component as any).constructPayloadAndSave()).toBeUndefined();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/workspaces/main/configuration/advanced_settings']);
  });

  it('constructPayloadAndSave function check for failure', () => {
    spyOn(exportSettingService, 'postExportSettings').and.returnValue(throwError(errorResponse));
    expect((component as any).constructPayloadAndSave()).toBeUndefined();
    fixture.detectChanges();
    expect(exportSettingService.postExportSettings).toHaveBeenCalled();
    expect(component.saveInProgress).toBeFalse();
  });

});
