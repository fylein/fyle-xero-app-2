import { getTestBed, TestBed } from '@angular/core/testing';
import { AdvancedSettingService } from './advanced-setting.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AdvancedSettingFormOption, AdvancedSettingGet, AdvancedSettingPost } from '../../models/configuration/advanced-setting.model';
import { environment } from 'src/environments/environment';
import { WorkspaceScheduleEmailOptions } from '../../models/db/workspace-schedule.model';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';
import { PaymentSyncDirection } from '../../models/enum/enum.model';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { AddEmailDialogComponent } from 'src/app/shared/components/configuration/advanced-settings/add-email-dialog/add-email-dialog.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('AdvancedSettingService', () => {
  let service: AdvancedSettingService;
  let injector: TestBed;
  let httpMock: HttpTestingController;
  const API_BASE_URL = environment.api_url;
  const workspace_id = 1;
  let dialogSpy: jasmine.Spy;
  const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of({}), close: null });
  dialogRefSpyObj.componentInstance = { body: '' };
  let matDialogMock: jasmine.SpyObj<MatDialog>;
  let dialogRefMock: jasmine.SpyObj<MatDialogRef<any>>;

  beforeEach(() => {
    localStorage.setItem('workspaceId', environment.tests.workspaceId);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatDialogModule, NoopAnimationsModule],
      providers: [AdvancedSettingService, FormBuilder, { provide: MatDialog, useValue: matDialogMock }, { provide: MatDialogRef, useValue: dialogRefMock }]
    });
    matDialogMock = jasmine.createSpyObj('MatDialog', ['open']);
    dialogRefMock = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
    dialogRefMock.afterClosed.and.returnValue(of({
      hours: 2,
      emails_selected: [],
      email_added: 'test@example.com'
    }));

    matDialogMock.open.and.returnValue(dialogRefMock);
    injector = getTestBed();
    service = injector.inject(AdvancedSettingService);
    httpMock = injector.inject(HttpTestingController);


  });


  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getAdvancedSettings service check', () => {
    const advancedSettingResponse:AdvancedSettingGet = {
      workspace_general_settings: {
        sync_fyle_to_xero_payments: false,
        sync_xero_to_fyle_payments: false,
        auto_create_destination_entity: true,
        change_accounting_period: true,
        auto_create_merchant_destination_entity: true
      },
      general_mappings: {
        payment_account: { id: '1', name: 'Fyle' }
      },
      workspace_schedules: {
        enabled: true,
        interval_hours: 10,
        start_datetime: new Date(),
        emails_selected: [],
        additional_email_options: []
      },
      workspace_id: 1
    };
    service.getAdvancedSettings().subscribe((value) => {
      expect(value).toEqual(advancedSettingResponse);
    });
    const req = httpMock.expectOne({
	      method: 'GET',
	      url: `${API_BASE_URL}/v2/workspaces/${workspace_id}/advanced_settings/`
	    });
    req.flush(advancedSettingResponse);
  });

  it('postAdvancedSettings service check', () => {
    const advancedSettingPayload: AdvancedSettingPost = {
      workspace_general_settings: {
        sync_fyle_to_xero_payments: false,
        sync_xero_to_fyle_payments: false,
        auto_create_destination_entity: true,
        change_accounting_period: true,
        auto_create_merchant_destination_entity: true
      },
      general_mappings: {
        payment_account: { id: '1', name: 'Fyle' }
      },
      workspace_schedules: {
        enabled: true,
        interval_hours: 10,
        start_datetime: new Date(),
        emails_selected: [],
        additional_email_options: []
      }
    };

    const advancedSettingResponse:AdvancedSettingGet = {
      workspace_general_settings: {
        sync_fyle_to_xero_payments: false,
        sync_xero_to_fyle_payments: false,
        auto_create_destination_entity: true,
        change_accounting_period: true,
        auto_create_merchant_destination_entity: true
      },
      general_mappings: {
        payment_account: { id: '1', name: 'Fyle' }
      },
      workspace_schedules: {
        enabled: true,
        interval_hours: 10,
        start_datetime: new Date(),
        emails_selected: [],
        additional_email_options: []
      },
      workspace_id: 1
    };
    service.postAdvancedSettings(advancedSettingPayload).subscribe(value => {
      expect(value).toEqual(advancedSettingResponse);
    });
    const req = httpMock.expectOne({
      method: 'PUT',
      url: `${API_BASE_URL}/v2/workspaces/${workspace_id}/advanced_settings/`
    });
  req.flush(advancedSettingResponse);
  });

  it('getWorkspaceAdmins function check', () => {
    const response: WorkspaceScheduleEmailOptions[] = [{name: 'fyle', email: 'fyle@fyle.in'}, {name: 'dhaara', email: 'fyle1@fyle.in'}];
    service.getWorkspaceAdmins().subscribe((value) => {
      expect(value).toEqual(response);
    });
    const req = httpMock.expectOne({
      method: 'GET',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/admins/`
    });
  req.flush(response);

  });

  it('should return an array of AdvancedSettingFormOption', () => {
    const expectedOptions: AdvancedSettingFormOption[] = [
      {
        label: 'None',
        value: 'None',
      },
      {
        label: 'Export Fyle ACH Payments to Xero',
        value: PaymentSyncDirection.FYLE_TO_XERO,
      },
      {
        label: 'Import Xero Payments into Fyle',
        value: PaymentSyncDirection.XERO_TO_FYLE,
      },
    ];

    const result = service.getPaymentSyncOptions();

    expect(result).toEqual(expectedOptions);
  });

  it('should return an array of AdvancedSettingFormOption with correct label and value', () => {
    const expectedOptions: AdvancedSettingFormOption[] = [...Array(24).keys()].map(day => {
      return {
        label: (day + 1) === 1 ? (day + 1) + ' Hour' : (day + 1) + ' Hours',
        value: day + 1
      };
    });

    const result = service.getFrequencyIntervals();

    expect(result).toEqual(expectedOptions);
  });

  it('should open the AddEmailDialogComponent and update form controls on dialog close', () => {
    const addedEmail: WorkspaceScheduleEmailOptions = {
      name: 'test',
      email: 'test@example.com'
    };
    const advancedSettingsForm: FormGroup = new FormGroup({
      exportScheduleFrequency: new FormControl(1),
      emails: new FormControl([]),
      addedEmail: new FormControl(addedEmail)
    });
    const adminEmails: WorkspaceScheduleEmailOptions[] = [];

    expect(service.openAddemailDialog(advancedSettingsForm, adminEmails)).toBeUndefined()
  });
});
