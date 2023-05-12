import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { RouterTestingModule } from '@angular/router/testing';
import { FormArray, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ImportSettingsComponent } from './import-settings.component';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from 'src/app/shared/shared.module';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { chartOfAccountTypesList, errorResponse, destinationAttribute, expenseFieldresponse, getImportsettingResponse, postImportsettingresponse, XeroCredentialsResponse, xeroField, xeroField1, mockXeroFields } from './import-settings.fixture';
import { FyleField, MappingDestinationField, OnboardingState } from 'src/app/core/models/enum/enum.model';
import { ImportSettingService } from 'src/app/core/services/configuration/import-setting.service';
import { WorkspaceService } from 'src/app/core/services/workspace/workspace.service';
import { XeroConnectorService } from 'src/app/core/services/configuration/xero-connector.service';
import { MappingService } from '../../../../core/services/misc/mapping.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from 'src/environments/environment';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('ImportSettingsComponent', () => {
  let component: ImportSettingsComponent;
  let fixture: ComponentFixture<ImportSettingsComponent>;
  const routerSpy = { navigate: jasmine.createSpy('navigate'), url: '/path' };
  let router: Router;
  let formbuilder: FormBuilder;
  let importSettingService: ImportSettingService;
  let workspace: WorkspaceService;
  let xeroConnectorService: XeroConnectorService;
  let mappingService: MappingService;
  let service1: any;
  let service2: any;
  let service3: any;
  let service4: any;
  let dialogSpy: jasmine.Spy;
  const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of({source_field: MappingDestinationField.TAX_CODE,
    destination_field: MappingDestinationField.ACCOUNT,
    import_to_fyle: true,
    name: MappingDestinationField.TAX_CODE,
    disable_import_to_fyle: true,
    source_placeholder: 'close'}), close: null });
  dialogRefSpyObj.componentInstance = { body: '' };
  beforeEach(async () => {
    localStorage.setItem('workspaceId', environment.tests.workspaceId);
    service1 = {
      getImportSettings: () => of(getImportsettingResponse),
      postImportSettings: () => of(postImportsettingresponse),
      getChartOfAccountTypesList: () => chartOfAccountTypesList,
      createChartOfAccountField: () => formbuilder.group({
        enabled: [true],
        name: ['Expense'],
      }),
      createExpenseField: () => void 0,
      getXeroExpenseFields: () => mockXeroFields
    };
    service2 = {
      getFyleExpenseFields: () => of(expenseFieldresponse),
      getXeroDestinationAttributes: () => of(destinationAttribute),
      refreshMappingPages: () => undefined,
      getXeroField: () => of(expenseFieldresponse)
    };
    service3 = {
      getOnboardingState: () => 'IMPORT_SETTINGS',
      setOnboardingState: () => undefined,
      getWorkspaceId: () => environment.tests.workspaceId
    };
    service4 = {
      getXeroCredentials: () => of(XeroCredentialsResponse)
    };
    await TestBed.configureTestingModule({
      imports: [ MatDialogModule, NoopAnimationsModule, RouterTestingModule, HttpClientModule, FormsModule, ReactiveFormsModule, MatDialogModule, MatSnackBarModule, SharedModule],
      declarations: [ ImportSettingsComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [ FormBuilder,
        { provide: Router, useValue: routerSpy },
        { provide: ImportSettingService, useValue: service1 },
        { provide: MappingService, useValue: service2 },
        { provide: WorkspaceService, useValue: service3 },
        { provide: XeroConnectorService, useValue: service4 }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportSettingsComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    formbuilder = TestBed.inject(FormBuilder);
    workspace = TestBed.inject(WorkspaceService);
    mappingService = TestBed.inject(MappingService);
    importSettingService = TestBed.inject(ImportSettingService);
    xeroConnectorService = TestBed.inject(XeroConnectorService);
    dialogSpy = spyOn(TestBed.get(MatDialog), 'open').and.returnValue(dialogRefSpyObj);
    component.importSettings = getImportsettingResponse;
    component.chartOfAccountTypesList = chartOfAccountTypesList;
    component.xeroExpenseFields = xeroField.concat();
    const chartOfAccountTypeFormArray = component.chartOfAccountTypesList.map((type) => importSettingService.createChartOfAccountField(type, ['Expense']));
    const expenseFieldsFormArray = xeroField.map((field) => {
      return formbuilder.group({
        source_field: [field.source_field],
        destination_field: [field.destination_field],
        import_to_fyle: [field.import_to_fyle],
        disable_import_to_fyle: [field.disable_import_to_fyle],
        source_placeholder: ['']
      });
    });

    component.importSettingsForm = formbuilder.group({
      chartOfAccount: [component.importSettings.workspace_general_settings.import_categories],
      chartOfAccountTypes: formbuilder.array(chartOfAccountTypeFormArray),
      expenseFields: formbuilder.array(expenseFieldsFormArray),
      taxCode: [component.importSettings.workspace_general_settings.import_tax_codes],
      defaultTaxCode: [component.importSettings.general_mappings?.default_tax_code?.id ? component.importSettings.general_mappings.default_tax_code : null],
      searchOption: [],
      xeroCutomers: [component.importSettings.workspace_general_settings.import_customers]
    });
    component.fyleExpenseFields = expenseFieldresponse.map(field => field.attribute_type);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnigit function check', () => {
    spyOn(importSettingService, 'getImportSettings').and.callThrough();
    spyOn(mappingService, 'getFyleExpenseFields').and.callThrough();
    expect(component.ngOnInit()).toBeUndefined();
    fixture.detectChanges();
    expect(importSettingService.getImportSettings).toHaveBeenCalled();
    expect(mappingService.getFyleExpenseFields).toHaveBeenCalled();
    expect(component.isLoading).toBeTrue();
  });

  it('navigateToPreviousStep function check', () => {
    expect(component.navigateToPreviousStep()).toBeUndefined();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/workspaces/onboarding/export_settings']);
  });

  it('createExpenceField function check', () => {
    const chartOfAccountTypeFormArray = component.chartOfAccountTypesList.map((type) => importSettingService.createChartOfAccountField(type, ['Expense']));
    const expenseFieldsFormArray = [formbuilder.group({
        source_field: ['COST_CENTER'],
        destination_field: ['ITEM'],
        import_to_fyle: [true],
        disable_import_to_fyle: [false],
        source_placeholder: ['']
      })];

    component.importSettingsForm = formbuilder.group({
      chartOfAccount: [component.importSettings.workspace_general_settings.import_categories],
      chartOfAccountTypes: formbuilder.array(chartOfAccountTypeFormArray),
      expenseFields: formbuilder.array(expenseFieldsFormArray),
      taxCode: [component.importSettings.workspace_general_settings.import_tax_codes],
      defaultTaxCode: [component.importSettings.general_mappings?.default_tax_code?.id ? component.importSettings.general_mappings.default_tax_code : null],
      searchOption: [],
      xeroCutomers: [component.importSettings.workspace_general_settings.import_customers]
    });
    expect(component.createExpenseField('Project')).toBeUndefined();
  });

  it('Save function check', () => {
    component.saveInProgress=false;
    component.isOnboarding = true;
    spyOn(importSettingService, 'postImportSettings').and.callThrough();
    spyOn(workspace, 'getOnboardingState').and.callThrough();
    spyOn(workspace, 'setOnboardingState').and.callThrough();
    expect(component.save()).toBeUndefined();
    fixture.detectChanges();
    expect(importSettingService.postImportSettings).toHaveBeenCalled();
    expect(workspace.getOnboardingState).toHaveBeenCalled();
    expect(workspace.setOnboardingState).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/workspaces/onboarding/advanced_settings']);
  });

  it('Save function else check', () => {
    component.saveInProgress=false;
    component.isOnboarding = false;
    spyOn(importSettingService, 'postImportSettings').and.callThrough();
    spyOn(workspace, 'getOnboardingState').and.returnValue(OnboardingState.COMPLETE);
    expect(component.save()).toBeUndefined();
    fixture.detectChanges();
    expect(importSettingService.postImportSettings).toHaveBeenCalled();
    expect(workspace.getOnboardingState).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/workspaces/main/dashboard']);
  });

  it('Save function Failure check', () => {
    component.saveInProgress=false;
    component.isOnboarding = false;
    spyOn(importSettingService, 'postImportSettings').and.returnValue(throwError(errorResponse));
    spyOn(workspace, 'getOnboardingState').and.returnValue(OnboardingState.COMPLETE);
    expect(component.save()).toBeUndefined();
    fixture.detectChanges();
    expect(importSettingService.postImportSettings).toHaveBeenCalled();
    expect(component.saveInProgress).toBeFalse();
  });

  it('showFyleExpenseFormPreview function check', () => {
    const chartOfAccountTypeFormArray = component.chartOfAccountTypesList.map((type) => importSettingService.createChartOfAccountField(type, ['Expense']));
    console.log('component.xeroExpenseFields',component.xeroExpenseFields)
    const expenseFieldsFormArray = component.xeroExpenseFields.map((field) => {
      return formbuilder.group({
        source_field: [field.source_field],
        destination_field: [field.destination_field],
        import_to_fyle: [field.import_to_fyle, null],
        disable_import_to_fyle: [field.disable_import_to_fyle],
        source_placeholder: ['']
      });
    });

    component.importSettingsForm = formbuilder.group({
      chartOfAccount: [component.importSettings.workspace_general_settings.import_categories],
      chartOfAccountTypes: formbuilder.array(chartOfAccountTypeFormArray),
      expenseFields: formbuilder.array(expenseFieldsFormArray),
      taxCode: [component.importSettings.workspace_general_settings.import_tax_codes],
      defaultTaxCode: [component.importSettings.general_mappings?.default_tax_code?.id ? component.importSettings.general_mappings.default_tax_code : null],
      searchOption: [],
      xeroCutomers: [component.importSettings.workspace_general_settings.import_customers]
    });
    expect(component.showFyleExpenseFormPreview()).toBeUndefined();
    fixture.detectChanges();
    expect(dialogSpy).toHaveBeenCalled();
  });

  it('createTaxCodeWatcher function check', () => {
    component.importSettingsForm.controls.taxCode.patchValue(true);
    expect((component as any).createTaxCodeWatcher()).toBeUndefined();
    fixture.detectChanges();
    component.importSettingsForm.controls.taxCode.patchValue(false);
    expect((component as any).createTaxCodeWatcher()).toBeUndefined();
  });

  it('chartOfAccountTypes function check', () => {
    const response = component.importSettingsForm.get('chartOfAccountTypes') as FormArray;
    expect(component.chartOfAccountTypes).toEqual(response);
  });

  it('createImportCustomerWatcher function check', () => {
    component.importSettingsForm.controls.importCustomers.patchValue(true);
    expect((component as any).createImportCustomerWatcher()).toBeUndefined();
    fixture.detectChanges();
    expect(component.fyleExpenseFields).toBeDefined();
    component.importSettingsForm.controls.importCustomers.patchValue(false);
    expect((component as any).createImportCustomerWatcher()).toBeUndefined();
    fixture.detectChanges();
    expect(component.fyleExpenseFields).toBeDefined();
  });

  it('createExpenseFieldWatcher function check', () => {
    component.isProjectMapped = true;
    expect((component as any).createExpenseFieldWatcher()).toBeUndefined();
    component.customMappedFyleFields = [FyleField.PROJECT];
    component.xeroExpenseFields = xeroField;
    const expenseFieldsFormArray = component.xeroExpenseFields.map((field) => {
      return formbuilder.group({
        source_field: [field.source_field],
        destination_field: [field.destination_field],
        import_to_fyle: [field.import_to_fyle],
        disable_import_to_fyle: [field.disable_import_to_fyle],
        source_placeholder: ['']
      });
    });
    component.importSettingsForm.controls.expenseFields.patchValue([expenseFieldsFormArray]);
    expect((component as any).createExpenseFieldWatcher()).toBeUndefined();
    fixture.detectChanges();
    expect(component.fyleExpenseFields).toBeDefined();
    component.xeroExpenseFields = xeroField1;
    const expenseFieldsFormArray1 = component.xeroExpenseFields.map((field) => {
      return formbuilder.group({
        source_field: [field.source_field],
        destination_field: [field.destination_field],
        import_to_fyle: [field.import_to_fyle],
        disable_import_to_fyle: [field.disable_import_to_fyle],
        source_placeholder: ['']
      });
    });
    component.importSettingsForm.controls.expenseFields.patchValue([expenseFieldsFormArray1]);
    expect((component as any).createExpenseFieldWatcher()).toBeUndefined();
    fixture.detectChanges();
    expect(component.fyleExpenseFields).toBeDefined();
  });
});
