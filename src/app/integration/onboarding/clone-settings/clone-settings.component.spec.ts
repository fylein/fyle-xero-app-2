import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloneSettingsComponent } from './clone-settings.component';
import { HttpClientModule } from '@angular/common/http';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';
import { mockCloneSettingExist, mockCloneSettingsGet, mockGroupedDestinationAttribtues } from './clone-settings.fixture';
import { CloneSettingService } from 'src/app/core/services/configuration/clone-setting.service';
import { MappingService } from 'src/app/core/services/misc/mapping.service';
import { errorResponse, expenseFieldresponse, mockPatchExpenseFieldsFormArray } from 'src/app/shared/components/configuration/import-settings/import-settings.fixture';
import { getMappingSettingResponse } from 'src/app/shared/components/mapping/generic-mapping/generic-mapping.fixture';
import { ImportSettingService } from 'src/app/core/services/configuration/import-setting.service';
import { AdvancedSettingService } from 'src/app/core/services/configuration/advanced-setting.service';
import { adminEmails, mockPaymentSyncOptions } from 'src/app/shared/components/configuration/advanced-settings/advanced-settings.fixture';
import { MatMenuModule } from '@angular/material/menu';
import { environment } from 'src/environments/environment';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('CloneSettingsComponent', () => {
  let component: CloneSettingsComponent;
  let fixture: ComponentFixture<CloneSettingsComponent>;
  let formbuilder: FormBuilder;
  const routerSpy = { navigate: jasmine.createSpy('navigate'), url: '/path' };
  let router: Router;
  let service1: any;
  let service2: any;
  let service3: any;
  let dialogSpy: jasmine.Spy;
  const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of({}), close: null });
  dialogRefSpyObj.componentInstance = { body: '' };
  let matDialogMock: jasmine.SpyObj<MatDialog>;
  let dialogRefMock: jasmine.SpyObj<MatDialogRef<any>>;

  beforeEach(async () => {
    service1 = {
      checkCloneSettingsExists: () => of(mockCloneSettingExist),
      saveCloneSettings: () => of(mockCloneSettingsGet),
      getCloneSettings: () => of(mockCloneSettingsGet)
    };
    service2 = {
      getGroupedXeroDestinationAttributes: () => of(mockGroupedDestinationAttribtues),
      getFyleExpenseFields: () => of(expenseFieldresponse),
      getXeroField: () => of(expenseFieldresponse),
      getMappingSettings: () => of(getMappingSettingResponse)
    };
    service3 = {
      patchAdminEmailsEmitter: of(adminEmails),
      getPaymentSyncOptions: () => mockPaymentSyncOptions,
      getFrequencyIntervals: () => [{label: '1 Hour', value: 1}],
      getWorkspaceAdmins: () => of(adminEmails),
      openAddemailDialog: () => of(adminEmails)
    };
    await TestBed.configureTestingModule({
      declarations: [ CloneSettingsComponent ],
      imports: [
        HttpClientModule, MatDialogModule, MatSnackBarModule, MatMenuModule, NoopAnimationsModule
      ],
      providers: [
        FormBuilder,
        { provide: Router, useValue: routerSpy },
        { provide: CloneSettingService, useValue: service1 },
        { provide: MappingService, useValue: service2 },
        { provide: AdvancedSettingService, useValue: service3 },
        { provide: MatDialog, useValue: matDialogMock }, { provide: MatDialogRef, useValue: dialogRefMock }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    localStorage.setItem('workspaceId', environment.tests.workspaceId);
    fixture = TestBed.createComponent(CloneSettingsComponent);
    formbuilder = TestBed.inject(FormBuilder);
    component = fixture.componentInstance;
    matDialogMock = jasmine.createSpyObj('MatDialog', ['open']);
    dialogRefMock = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
    dialogRefMock.afterClosed.and.returnValue(of({
      hours: 2,
      emails_selected: [],
      email_added: 'test@example.com'
    }));

    matDialogMock.open.and.returnValue(dialogRefMock);
    component.cloneSettings = mockCloneSettingsGet;
    component.cloneSettingsForm = formbuilder.group({
      chartOfAccount: [mockCloneSettingsGet.import_settings.workspace_general_settings.import_categories],
      taxCode: [mockCloneSettingsGet.import_settings.workspace_general_settings.import_tax_codes],
      defaultTaxCode: [mockCloneSettingsGet.import_settings.general_mappings?.default_tax_code?.id ? mockCloneSettingsGet.import_settings.general_mappings.default_tax_code : null]
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('disableImportCoa and disableImportTax funtion should work', () => {
    component.disableImportCoa();
    component.disableImportTax();
    expect(component.cloneSettingsForm.value.chartOfAccount).toBeFalse();
    expect(component.cloneSettingsForm.value.taxCode).toBeFalse();
    expect(component.cloneSettingsForm.value.defaultTaxCode).toBeNull();
  });

  it('enableTaxImport and enableAccountImport funtion should work', () => {
    component.enableTaxImport();
    component.enableAccountImport();
    expect(component.cloneSettingsForm.value.chartOfAccount).toBeTrue();
    expect(component.cloneSettingsForm.value.taxCode).toBeTrue();
  });

  it('openAddemailDialog funtion should work', () => {
    expect(component.openAddemailDialog()).toBeUndefined();
  });

  it('resetConfiguraions funtion should work', () => {
    expect(component.resetConfiguraions()).toBeUndefined();
  });

  it('setupForm funtion should work', () => {
    component.cloneSettings.advanced_settings.workspace_general_settings.sync_xero_to_fyle_payments = true;
    component.cloneSettings.advanced_settings.workspace_general_settings.sync_fyle_to_xero_payments = false;
    // @ts-ignore
    expect(component.setupForm()).toBeUndefined();
  });

  it('save funtion should work', () => {
    component.cloneSettingsForm.controls.expenseFields.setValue([mockPatchExpenseFieldsFormArray]);
    expect(component.save()).toBeUndefined();

    spyOn(service1, 'saveCloneSettings').and.returnValue(throwError(errorResponse));
  });
});
