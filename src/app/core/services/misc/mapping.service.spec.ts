import { getTestBed, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { MappingService } from './mapping.service';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';
import { TenantFieldMapping } from '../../models/enum/enum.model';
import { ExpenseField } from '../../models/misc/expense-field.model';
import { MappingSettingResponse } from '../../models/db/mapping-setting.model';
import { mappingSettingPayload, postMappingSettingResponse } from './mapping.service.fixture';

describe('MappingService', () => {
  let service: MappingService;
  let injector: TestBed;
  let httpMock: HttpTestingController;
  const API_BASE_URL = environment.api_url;
  const workspace_id = environment.tests.workspaceId;

  beforeEach(() => {
    localStorage.setItem('workspaceId', environment.tests.workspaceId);
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule],
      providers: [MappingService]
    });
    injector = getTestBed();
    service = injector.inject(MappingService);
    httpMock = injector.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getXeroDestinationAttributes() service check', () => {
    service.getXeroDestinationAttributes([TenantFieldMapping.TENANT], true).subscribe(value => {
      expect(value).toEqual([]);
    });
    const req = httpMock.expectOne({
      method: 'GET',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/xero/destination_attributes/?attribute_types=TENANT&active=true`
    });
      req.flush([]);

  });

  it('getFyleExpenseFields() service check', () => {
    const response:ExpenseField[]=[
      {
          "attribute_type": "COST_CENTER",
          "display_name": "Cost Center"
      },
      {
          "attribute_type": "PROJECT",
          "display_name": "Project"
      },
      {
          "attribute_type": "REGION",
          "display_name": "Region"
      },
      {
          "attribute_type": "XERO_REGION",
          "display_name": "Xero Region"
      },
      {
          "attribute_type": "XERO_ITEM",
          "display_name": "Xero Item"
      },
      {
          "attribute_type": "XERO_FIELD",
          "display_name": "Xero Field"
      }
  ];
    service.getFyleExpenseFields().subscribe(value => {
      const responseKeys = Object.keys(response).sort();
      const actualKeys = Object.keys(value).sort();
      expect(actualKeys).toEqual(responseKeys);
    });
    const req = httpMock.expectOne({
      method: 'GET',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/fyle/expense_fields/`
    });
      req.flush(response);
  });

  it('getMappingSettings() service check', () => {
    const response:MappingSettingResponse = {
      count: 0, next: 'aa', previous: 'aa', results: []};
    service.getMappingSettings().subscribe(value => {
      const responseKeys = Object.keys(response).sort();
      const actualResponseKeys = Object.keys(value).sort();
      expect(actualResponseKeys).toEqual(responseKeys);
    });
    const req = httpMock.expectOne({
      method: 'GET',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/mappings/settings/`
    });
      req.flush(response);
  });

  it('getGroupedXeroDestinationAttributes() withdata service check', () => {
    const destinationAttributes = ['BANK_ACCOUNT', 'CONTACT', 'ACCOUNT', 'TENANT'];
    const response = {
      BANK_ACCOUNT: [],
        TAX_CODE: []
    };
    let responseKeys;
    let actualResponseKeys;
    service.getGroupedXeroDestinationAttributes(destinationAttributes).subscribe((value) => {
      responseKeys = Object.keys(response).sort();
      actualResponseKeys = Object.keys(value).sort();
    });
    expect(actualResponseKeys).toEqual(responseKeys);
    const req = httpMock.expectOne({
      method: 'GET',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/xero/destination_attributes/?attribute_types=BANK_ACCOUNT,CONTACT,ACCOUNT,TENANT`
    });
      req.flush([{"id": 45531, "attribute_type": "CONTACT", "display_name": "Contact", "value": "2285 Fyle Credit Card", "destination_id": "106", "auto_created": false, "active": null, "detail": {"account_type": "Credit Card", "fully_qualified_name": "2285 Fyle Credit Card"}, "created_at": "2022-04-14T06:09:07.537182Z", "updated_at": "2022-04-14T06:09:07.537205Z", "workspace": 216}]);
  });

  it('getGroupedXeroDestinationAttributes() without data service check', () => {
    const destinationAttributes = ['BANK_ACCOUNT', 'CONTACT', 'ACCOUNT', 'TENTANT'];
    const response = {
      BANK_ACCOUNT: [],
      TAX_CODE: []
    };
    let responseKeys;
    let actualResponseKeys;
    service.getGroupedXeroDestinationAttributes(destinationAttributes).subscribe((value) => {
      responseKeys = Object.keys(response).sort();
      actualResponseKeys = Object.keys(value).sort();
    });
    expect(actualResponseKeys).toEqual(responseKeys);
    const req = httpMock.expectOne({
      method: 'GET',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/xero/destination_attributes/?attribute_types=BANK_ACCOUNT,CONTACT,ACCOUNT,TENTANT`
    });
      req.flush([]);
  });

  it('should post MappingSettings', () => {
    service.postMappingSettings(mappingSettingPayload).subscribe((value) => {
      expect(value).toEqual(postMappingSettingResponse);
    });
    const req = httpMock.expectOne({
      method: 'POST',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/mappings/settings/`
    });

    req.flush(postMappingSettingResponse);
  });


  it('should emit getMappingPagesForSideNavBar', () => {
    service.refreshMappingPages();
    spyOn(service.getMappingPagesForSideNavBar, 'emit');
    const req = httpMock.expectOne({
      method: 'GET',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/mappings/settings/`
    });

    req.flush({});
    expect(service.getMappingPagesForSideNavBar.emit).toHaveBeenCalled();
  });

});
