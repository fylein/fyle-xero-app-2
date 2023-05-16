import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloneSettingsComponent } from './clone-settings.component';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { mockCloneSettingExist, mockCloneSettingsGet, mockGroupedDestinationAttribtues } from './clone-settings.fixture';
import { CloneSettingService } from 'src/app/core/services/configuration/clone-setting.service';
import { MappingService } from 'src/app/core/services/misc/mapping.service';
import { expenseFieldresponse, mockPatchExpenseFieldsFormArray } from 'src/app/shared/components/configuration/import-settings/import-settings.fixture';
import { getMappingSettingResponse } from 'src/app/shared/components/mapping/generic-mapping/generic-mapping.fixture';
import { ImportSettingService } from 'src/app/core/services/configuration/import-setting.service';
import { AdvancedSettingService } from 'src/app/core/services/configuration/advanced-setting.service';
import { adminEmails, mockPaymentSyncOptions } from 'src/app/shared/components/configuration/advanced-settings/advanced-settings.fixture';
import { MatMenuModule } from '@angular/material/menu';

describe('CloneSettingsComponent', () => {
  let component: CloneSettingsComponent;
  let fixture: ComponentFixture<CloneSettingsComponent>;
  let formbuilder: FormBuilder;
  const routerSpy = { navigate: jasmine.createSpy('navigate'), url: '/path' };
  let router: Router;
  let service1: any;
  let service2: any;
  let service3: any;

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
      getMappingSettings: () => of(getMappingSettingResponse),
    };
    service3 = {
      patchAdminEmailsEmitter: of(adminEmails),
      getPaymentSyncOptions: () => mockPaymentSyncOptions,
      getFrequencyIntervals: () => [{label: '1 Hour', value: 1}],
      getWorkspaceAdmins: () => of(adminEmails),
    }
    await TestBed.configureTestingModule({
      declarations: [ CloneSettingsComponent ],
      imports: [
        HttpClientModule, MatDialogModule, MatSnackBarModule, MatMenuModule
      ],
      providers: [
        FormBuilder,
        { provide: Router, useValue: routerSpy },
        { provide: CloneSettingService, useValue: service1 },
        { provide: MappingService, useValue: service2 },
        { provide: AdvancedSettingService, useValue: service3 },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CloneSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
