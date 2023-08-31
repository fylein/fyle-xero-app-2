import { getTestBed, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { MappingService } from './mapping.service';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';
import { FyleField, MappingDestinationField, MappingState, TenantFieldMapping } from '../../models/enum/enum.model';
import { ExpenseField } from '../../models/misc/expense-field.model';
import { MappingSettingResponse } from '../../models/db/mapping-setting.model';
import { destinationAttributes, FyleExpenseFieldsresponse, getMappingsresponse, GroupedXeroDestinationAttributesresponse, MappingPostpayload, mappingSettingPayload, MappingSettingsresponse, MappingStatsresponse, postMappingResponse, postMappingSettingResponse, response } from './mapping.service.fixture';
import { Mapping, MappingPost, MappingStats } from '../../models/db/mapping.model';
import { xeroField } from 'src/app/shared/components/configuration/import-settings/import-settings.fixture';
import { DestinationAttribute } from '../../models/db/destination-attribute.model';

describe('MappingService', () => {
  let service: MappingService;
  let injector: TestBed;
  let httpMock: HttpTestingController;
  const API_BASE_URL = environment.api_url;
  const workspace_id = 1;

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
    service.getXeroDestinationAttributes([MappingDestinationField.ACCOUNT], true).subscribe(value => {
      expect(value).toEqual([]);
    });
    const req = httpMock.expectOne({
      method: 'GET',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/xero/destination_attributes/?attribute_types__in=ACCOUNT&active=true`
    });
      req.flush([]);

  });

  it('getFyleExpenseFields() service check', () => {
    service.getFyleExpenseFields().subscribe(value => {
      const responseKeys = Object.keys(FyleExpenseFieldsresponse).sort();
      const actualKeys = Object.keys(value).sort();
      expect(actualKeys).toEqual(responseKeys);
    });
    const req = httpMock.expectOne({
      method: 'GET',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/fyle/expense_fields/`
    });
      req.flush(FyleExpenseFieldsresponse);
  });

  it('getMappingSettings() service check', () => {
    service.getMappingSettings().subscribe(value => {
      const responseKeys = Object.keys(MappingSettingsresponse).sort();
      const actualResponseKeys = Object.keys(value).sort();
      expect(actualResponseKeys).toEqual(responseKeys);
    });
    const req = httpMock.expectOne({
      method: 'GET',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/mappings/settings/`
    });
      req.flush(MappingSettingsresponse);
  });

  it('getGroupedXeroDestinationAttributes() withdata service check', () => {
    let responseKeys;
    let actualResponseKeys;
    service.getGroupedXeroDestinationAttributes(destinationAttributes).subscribe((value) => {
      responseKeys = Object.keys(response).sort();
      actualResponseKeys = Object.keys(value).sort();
    });
    expect(actualResponseKeys).toEqual(responseKeys);
    const req = httpMock.expectOne({
      method: 'GET',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/xero/destination_attributes/?attribute_types__in=BANK_ACCOUNT,CONTACT,ACCOUNT,TENANT`
    });
      req.flush(GroupedXeroDestinationAttributesresponse);
  });

  it('getGroupedXeroDestinationAttributes() without data service check', () => {
    let responseKeys;
    let actualResponseKeys;
    service.getGroupedXeroDestinationAttributes(destinationAttributes).subscribe((value) => {
      responseKeys = Object.keys(response).sort();
      actualResponseKeys = Object.keys(value).sort();
    });
    expect(actualResponseKeys).toEqual(responseKeys);
    const req = httpMock.expectOne({
      method: 'GET',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/xero/destination_attributes/?attribute_types__in=BANK_ACCOUNT,CONTACT,ACCOUNT,TENANT`
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

  it('getDistinctXeroDestinationAttributes() service check', () => {
    service.getDistinctXeroDestinationAttributes([TenantFieldMapping.TENANT]).subscribe(value => {
      expect(value).toEqual([]);
    });
    const req = httpMock.expectOne({
      method: 'GET',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/xero/xero_attributes/?attribute_types=TENANT`
    });
      req.flush([]);

  });

  it('getMappingStats() service check', () => {
    service.getMappingStats(FyleField.CATEGORY, FyleField.PROJECT).subscribe((value) => {
      const responseKeys = Object.keys(MappingStatsresponse).sort();
      const actualKeys = Object.keys(value).sort();
      expect(actualKeys).toEqual(responseKeys);
    });
    const req = httpMock.expectOne({
      method: 'GET',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/mappings/stats/?source_type=CATEGORY&destination_type=PROJECT&app_name=XERO`
    });
      req.flush(MappingStatsresponse);
  });

  it('postmapping() service check', () => {
    service.postMapping(MappingPostpayload).subscribe((value) => {
      expect(value).toEqual(postMappingResponse);
    });
    const req = httpMock.expectOne({
      method: 'POST',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/mappings/`
    });
      req.flush(postMappingResponse);
  });

  it('getMappings() service check', () => {
    service.getMappings(MappingState.ALL, 1, 1, [], FyleField.CATEGORY, FyleField.TAX_GROUP).subscribe(value => {
      const responseKeys = Object.keys(getMappingsresponse).sort();
      const actualResponseKeys = Object.keys(value).sort();
      expect(actualResponseKeys).toEqual(responseKeys);
    });
    const req = httpMock.expectOne({
      method: 'GET',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/mappings/expense_attributes/?limit=1&offset=1&mapped=ALL&source_type=CATEGORY&destination_type=TAX_GROUP&app_name=XERO`
    });
      req.flush(getMappingsresponse);
  });

  it('getMappings() service check', () => {
    service.getMappings(MappingState.UNMAPPED, 1, 1, ['A'], FyleField.CATEGORY, FyleField.TAX_GROUP).subscribe(value => {
      const responseKeys = Object.keys(getMappingsresponse).sort();
      const actualResponseKeys = Object.keys(value).sort();
      expect(actualResponseKeys).toEqual(responseKeys);
    });
    const req = httpMock.expectOne({
      method: 'GET',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/mappings/expense_attributes/?limit=1&offset=1&mapped=false&source_type=CATEGORY&destination_type=TAX_GROUP&app_name=XERO&mapping_source_alphabets=A`
    });
      req.flush(getMappingsresponse);
  });

  it('should emit walkThroughTooltip', () => {
    spyOn(service.showWalkThroughTooltip, 'emit');
    service.emitWalkThroughTooltip();
    expect(service.showWalkThroughTooltip.emit).toHaveBeenCalled();
  });

  it('should delete MappingSettings', () => {
    service.deleteMappingSetting(11).subscribe((value) => {
      expect(value).toEqual({});
    });
    const req = httpMock.expectOne({
      method: 'DELETE',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/mappings/settings/11/`
    });

    req.flush({});
  });

  it('triggerAutoMapEmployees() service check', () => {
    service.triggerAutoMapEmployees().subscribe(value => {
      expect(value).toEqual({});
    });
    const req = httpMock.expectOne({
      method: 'POST',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/mappings/auto_map_employees/trigger/`
    });
      req.flush({});
  });

  it('getXeroField() service check', () => {
    service.getXeroField().subscribe(value => {
      expect(value).toEqual([]);
    });
    const req = httpMock.expectOne({
      method: 'GET',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/xero/xero_fields/`
    });
      req.flush([]);
  });

});
