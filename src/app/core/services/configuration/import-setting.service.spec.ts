import { getTestBed, TestBed } from '@angular/core/testing';
import { ImportSettingService } from './import-setting.service';
import { ImportSettingPost, ImportSettingModel } from '../../models/configuration/import-setting.model';
import { MappingSourceField, MappingDestinationField } from '../../models/enum/enum.model';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';
import { getImportsettingResponse } from 'src/app/shared/components/configuration/import-settings/import-settings.fixture';

describe('ImportSettingService', () => {
  let service: ImportSettingService;
  let injector: TestBed;
  let httpMock: HttpTestingController;
  const API_BASE_URL = environment.api_url;
  const workspace_id = environment.tests.workspaceId;

  beforeEach(() => {
    localStorage.setItem('workspaceId', environment.tests.workspaceId);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ImportSettingService]
    });
    injector = getTestBed();
    service = injector.inject(ImportSettingService);
    httpMock = injector.inject(HttpTestingController);
  });


  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getImportSettings service attribute check', () => {
    service.getImportSettings().subscribe((value) => {
      expect(value).toEqual(getImportsettingResponse);
    });
    const req = httpMock.expectOne({
      method: 'GET',
      url: `${API_BASE_URL}/v2/workspaces/${workspace_id}/import_settings/`
    });
    req.flush(getImportsettingResponse);
  });

  it('postImportSettings service check', () => {
    const employeeSettingPayload: ImportSettingPost = {
      workspace_general_settings: {
        import_categories: true,
        charts_of_accounts: ImportSettingModel.formatChartOfAccounts([{enabled: true, name: 'expence'}]),
        import_tax_codes: true,
        import_customers: false
      },
      general_mappings: {
        default_tax_code: {id: '1', name: 'Fyle'}
      },
      mapping_settings: [{
        source_field: MappingSourceField.PROJECT,
        destination_field: MappingDestinationField.ACCOUNT,
        import_to_fyle: true,
        is_custom: false,
        source_placeholder: ''
      },
      {
        source_field: MappingSourceField.COST_CENTER,
        destination_field: MappingDestinationField.BANK_ACCOUNT,
        import_to_fyle: false,
        is_custom: false,
        source_placeholder: ''
      }]
    };
    service.postImportSettings(employeeSettingPayload).subscribe(value => {
      expect(value).toEqual(getImportsettingResponse);
    });
    const req = httpMock.expectOne({
      method: 'PUT',
      url: `${API_BASE_URL}/v2/workspaces/${workspace_id}/import_settings/`
    });
    req.flush(getImportsettingResponse);
  });
});
