import { EventEmitter, Injectable, Output } from '@angular/core';
import { empty, Observable, Subject } from 'rxjs';
import { concatMap, expand, map, publishReplay, reduce, refCount } from 'rxjs/operators';
import { ApiService } from '../core/api.service';
import { WorkspaceService } from '../workspace/workspace.service';
import { MappingSettingResponse, MappingSource } from '../../models/db/mapping-setting.model';
import { ExpenseField } from '../../models/misc/expense-field.model';
import { Mapping, MappingDestination } from '../../models/db/mapping.model';
import { GeneralMapping } from '../../models/db/general-mapping.model';
import { TenantMapping } from '../../models/db/tenant-mapping.model';
import { Cacheable, CacheBuster } from 'ts-cacheable';
import { DestinationAttribute } from '../../models/db/destination-attribute.model';

const generalMappingsCache = new Subject<void>();

@Injectable({
  providedIn: 'root'
})
export class MappingService {

  @Output() getMappingPagesForSideNavBar: EventEmitter<MappingSettingResponse> = new EventEmitter();

  workspaceId = this.workspaceService.getWorkspaceId();

  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService) { }

  refreshMappingPages(): void {

    this.apiService.get(`/workspaces/${this.workspaceId}/mappings/settings/`, {}).subscribe((mappingSettingResponse: MappingSettingResponse) => {
      this.getMappingPagesForSideNavBar.emit(mappingSettingResponse);
    });
  }

  syncXeroDimensions() {

    return this.apiService.post(`/workspaces/${this.workspaceId}/xero/sync_dimensions/`, {}).pipe(
      map(data => data),
      publishReplay(1),
      refCount()
    );
  }

  syncFyleDimensions() {


    return this.apiService.post(`/workspaces/${this.workspaceId}/fyle/sync_dimensions/`, {}).pipe(
      map(data => data),
      publishReplay(1),
      refCount()
    );

  }

  refreshXeroDimensions() {


    return this.apiService.post(`/workspaces/${this.workspaceId}/xero/refresh_dimensions/`, {});
  }

  refreshFyleDimensions() {


    return this.apiService.post(`/workspaces/${this.workspaceId}/fyle/refresh_dimensions/`, {});
  }

  refreshDimension() {


    this.apiService.post(`/workspaces/${this.workspaceId}/xero/refresh_dimensions/`, {}).subscribe();
    this.apiService.post(`/workspaces/${this.workspaceId}/fyle/refresh_dimensions/`, {}).subscribe();
  }

  postFyleEmployees(): Observable<MappingSource[]> {

    return this.apiService.post(`/workspaces/${this.workspaceId}/fyle/employees/`, {}).pipe(
      map(data => data),
      publishReplay(1),
      refCount()
    );
  }

  postFyleCategories(): Observable<MappingSource[]> {


    return this.apiService.post(`/workspaces/${this.workspaceId}/fyle/categories/`, {}).pipe(
      map(data => data),
      publishReplay(1),
      refCount()
    );
  }

  postFyleProjects(): Observable<MappingSource[]> {


    return this.apiService.post(`/workspaces/${this.workspaceId}/fyle/projects/`, {}).pipe(
      map(data => data),
      publishReplay(1),
      refCount()
    );
  }

  postFyleCostCenters(): Observable<MappingSource[]> {


    return this.apiService.post(`/workspaces/${this.workspaceId}/fyle/cost_centers/`, {}).pipe(
      map(data => data),
      publishReplay(1),
      refCount()
    );
  }

  postExpenseCustomFields(): Observable<MappingSource[]> {


    return this.apiService.post(`/workspaces/${this.workspaceId}/fyle/expense_custom_fields/`, {}).pipe(
      map(data => data),
      publishReplay(1),
      refCount()
    );
  }

  postXeroTrackingCategories() {


    return this.apiService.post(`/workspaces/${this.workspaceId}/xero/tracking_categories/`, {}).pipe(
      map(data => data),
      publishReplay(1),
      refCount()
    );
  }

  postXeroItems() {


    return this.apiService.post(`/workspaces/${this.workspaceId}/xero/items/`, {}).pipe(
      map(data => data),
      publishReplay(1),
      refCount()
    );
  }

  postXeroContacts() {


    return this.apiService.post(`/workspaces/${this.workspaceId}/xero/contacts/`, {}).pipe(
      map(data => data),
      publishReplay(1),
      refCount()
    );
  }

  postXeroTenants() {


    return this.apiService.post(`/workspaces/${this.workspaceId}/xero/tenants/`, {}).pipe(
      map(data => data),
      publishReplay(1),
      refCount()
    );
  }

  postXeroAccounts() {


    return this.apiService.post(`/workspaces/${this.workspaceId}/xero/accounts/`, {}).pipe(
      map(data => data),
      publishReplay(1),
      refCount()
    );
  }


  getFyleEmployees(): Observable<MappingSource[]> {


    return this.apiService.get(`/workspaces/${this.workspaceId}/fyle/employees/`, {});
  }

  getFyleExpenseFields(): Observable<ExpenseField[]> {


    return this.apiService.get(`/workspaces/${this.workspaceId}/fyle/expense_fields/`, {});
  }

  getFyleCategories(): Observable<MappingSource[]> {


    return this.apiService.get(`/workspaces/${this.workspaceId}/fyle/categories/`, {});
  }

  getFyleExpenseCustomFields(attributeType: string): Observable<MappingSource[]> {


    return this.apiService.get(`/workspaces/${this.workspaceId}/fyle/expense_custom_fields/`, {
      attribute_type: attributeType
    });
  }

  getXeroFields(): Observable<ExpenseField[]> {


    return this.apiService.get(`/workspaces/${this.workspaceId}/xero/xero_fields/`, {});
  }

  getXeroTrackingCategories(attributeType: string): Observable<MappingDestination[]> {


    return this.apiService.get(`/workspaces/${this.workspaceId}/xero/tracking_categories/`, {
      attribute_type: attributeType
    });
  }

  getXeroContacts(): Observable<MappingDestination[]> {


    return this.apiService.get(`/workspaces/${this.workspaceId}/xero/contacts/`, {});
  }

  getBankAccounts(): Observable<MappingDestination[]> {


    return this.apiService.get(
      `/workspaces/${this.workspaceId}/xero/bank_accounts/`, {}
    );
  }

  getXeroTaxCodes(): Observable<MappingDestination[]> {

    return this.apiService.get(`/workspaces/${this.workspaceId}/xero/tax_codes/`, {});
  }

  getXeroTenants(): Observable<MappingDestination[]> {


    return this.apiService.get(`/workspaces/${this.workspaceId}/xero/tenants/`, {});
  }

  @CacheBuster({
    cacheBusterNotifier: generalMappingsCache
  })
  postGeneralMappings(generalMappings: GeneralMapping) {

    return this.apiService.post(`/workspaces/${this.workspaceId}/mappings/general/`, generalMappings);
  }

  @Cacheable({
    cacheBusterObserver: generalMappingsCache
  })
  getGeneralMappings(): Observable<GeneralMapping> {

    return this.apiService.get(
      `/workspaces/${this.workspaceId}/mappings/general/`, {}
    );
  }

  getTenantMappings(): Observable<TenantMapping> {

    return this.apiService.get(
      `/workspaces/${this.workspaceId}/mappings/tenant/`, {}
    );
  }

  getMappings(sourceType: string, uri: string, limit: number = 500, pageOffset: number = 0, tableDimension: number = 2): Observable<MappingSettingResponse> {

    const url = uri ? uri.split('/api')[1] : `/workspaces/${this.workspaceId}/mappings/?limit=${limit}&offset=${pageOffset}&source_type=${sourceType}&table_dimension=${tableDimension}`;
    return this.apiService.get(url, {});
  }

  getAllMappings(sourceType: string, limit: number, uri: string, pageOffset: number, tableDimension: number): Observable<Mapping[]> {
    const that = this;
    return this.getMappings(sourceType, uri, limit, pageOffset, tableDimension).pipe(expand((res: MappingSettingResponse) => {
      // Tslint:disable-next-line
      return res.next ? that.getMappings(sourceType, res.next, 500) : empty();
    }), concatMap((res: MappingSettingResponse) => res.results),
      reduce((arr: Mapping[], val: Mapping) => {
        arr.push(val);
        return arr;
      }, []));
  }

  postMappings(mapping: Mapping): Observable<Mapping> {

    return this.apiService.post(`/workspaces/${this.workspaceId}/mappings/`, mapping);
  }

  triggerAutoMapEmployees() {

    return this.apiService.post(`/workspaces/${this.workspaceId}/mappings/auto_map_employees/trigger/`, {});
  }

  getXeroDestinationAttributes(attributeTypes: string | string[], active:boolean = false): Observable<DestinationAttribute[]> {
    const params: {attribute_types: string | string[], active?: boolean} = {
      attribute_types: attributeTypes
    };

    if (active) {
      params.active = true;
    }

    return this.apiService.get(`/workspaces/${this.workspaceId}/xero/destination_attributes/`, params);
  }
}
