import { getTestBed, TestBed } from '@angular/core/testing';
import { AdvancedSettingService } from './advanced-setting.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AdvancedSettingGet, AdvancedSettingPost } from '../../models/configuration/advanced-setting.model';
import { environment } from 'src/environments/environment';
import { WorkspaceScheduleEmailOptions } from '../../models/db/workspace-schedule.model';
import { MatDialogModule } from '@angular/material/dialog';
import { of } from 'rxjs';

describe('AdvancedSettingService', () => {
  let service: AdvancedSettingService;
  let injector: TestBed;
  let httpMock: HttpTestingController;
  const API_BASE_URL = environment.api_url;
  const workspace_id = environment.tests.workspaceId;
  let dialogSpy: jasmine.Spy;
  const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of({}), close: null });
  dialogRefSpyObj.componentInstance = { body: '' };

  beforeEach(() => {
    localStorage.setItem('workspaceId', environment.tests.workspaceId);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatDialogModule],
      providers: [AdvancedSettingService]
    });
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

  it('openAddemailDialog function check', () => {
    // TODO
    // expect(component.openAddemailDialog()).toBeUndefined();
    // fixture.detectChanges();
    // expect(dialogSpy1).toHaveBeenCalled();
  });

});
