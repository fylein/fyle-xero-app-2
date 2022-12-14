import { getTestBed, TestBed } from '@angular/core/testing';
import { AdvancedSettingService } from './advanced-setting.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AdvancedSettingGet, AdvancedSettingPost } from '../../models/configuration/advanced-setting.model';
import { environment } from 'src/environments/environment';

describe('AdvancedSettingService', () => {
  let service: AdvancedSettingService;
  let injector: TestBed;
  let httpMock: HttpTestingController;
  const API_BASE_URL = environment.api_url;
  const workspace_id = environment.tests.workspaceId;

  beforeEach(() => {
    localStorage.setItem('workspaceId', environment.tests.workspaceId);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
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
        start_datetime: new Date()
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
        start_datetime: new Date()
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
        start_datetime: new Date()
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

});
