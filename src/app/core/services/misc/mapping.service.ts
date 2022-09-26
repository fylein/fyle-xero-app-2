import { EventEmitter, Injectable, Output } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { Cacheable } from 'ts-cacheable';
import { DestinationAttribute, GroupedDestinationAttribute } from '../../models/db/destination-attribute.model';
import { ExtendedExpenseAttributeResponse } from '../../models/db/expense-attribute.model';
import { MappingSetting, MappingSettingPost, MappingSettingResponse } from '../../models/db/mapping-setting.model';
import { MappingPost, MappingStats, PostMappingResponse } from '../../models/db/mapping.model';
import { MappingState } from '../../models/enum/enum.model';
import { ExpenseField } from '../../models/misc/expense-field.model';
import { ApiService } from '../core/api.service';
import { WorkspaceService } from '../workspace/workspace.service';

@Injectable({
  providedIn: 'root'
})
export class MappingService {

  @Output() getMappingPagesForSideNavBar: EventEmitter<MappingSettingResponse> = new EventEmitter();

  @Output() showWalkThroughTooltip: EventEmitter<void> = new EventEmitter();

  workspaceId: string = this.workspaceService.getWorkspaceId();

  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService
  ) { }

  getXeroDestinationAttributes(attributeTypes: string | string[], active:boolean = false): Observable<DestinationAttribute[]> {
    const params: {attribute_types: string | string[], active?: boolean} = {
      attribute_types: attributeTypes
    };

    if (active) {
      params.active = true;
    }
    return this.apiService.get(`/workspaces/${this.workspaceId}/xero/destination_attributes/`, params);
  }

  getDistinctXeroDestinationAttributes(attributeTypes: string[]): Observable<DestinationAttribute[]> {
    return this.apiService.get(`/workspaces/${this.workspaceId}/xero/xero_attributes/`, {
      attribute_types: attributeTypes
    });
  }

  getGroupedXeroDestinationAttributes(attributeTypes: string[]): Observable<GroupedDestinationAttribute> {
    return from(this.getXeroDestinationAttributes(attributeTypes).toPromise().then((response: DestinationAttribute[]) => {
      return response.reduce((groupedAttributes: GroupedDestinationAttribute | any, attribute: DestinationAttribute) => {
        const group: DestinationAttribute[] = groupedAttributes[attribute.attribute_type] || [];
        group.push(attribute);
        groupedAttributes[attribute.attribute_type] = group;

        return groupedAttributes;
      }, {
        BANK_ACCOUNT: [],
        TAX_CODE: []
      });
    }));
  }

  @Cacheable()
  getFyleExpenseFields(): Observable<ExpenseField[]> {
    const response:ExpenseField[]=[
      {
          "attribute_type": "BANK_ACCOUN",
          "display_name": "Bank Account"
      },
      {
          "attribute_type": "TAX_CODE",
          "display_name": "Tax Code"
      }
    ];
    // Return of(response);
    return this.apiService.get(`/workspaces/${this.workspaceId}/fyle/expense_fields/`, {});
  }

  // TODO: cache this safely later
  getMappingSettings(): Observable<MappingSettingResponse> {
    return this.apiService.get(`/workspaces/${this.workspaceId}/mappings/settings/`, {});
  }

  refreshMappingPages(): void {
    this.apiService.get(`/workspaces/${this.workspaceId}/mappings/settings/`, {}).subscribe((mappingSettingResponse: MappingSettingResponse) => {
      this.getMappingPagesForSideNavBar.emit(mappingSettingResponse);
    });
  }

  postMappingSettings(mappingSettingPayload: MappingSettingPost[]): Observable<MappingSetting[]> {
    return this.apiService.post(`/workspaces/${this.workspaceId}/mappings/settings/`, mappingSettingPayload);
  }

  getMappingStats(sourceType: string, destinationType: string): Observable<MappingStats> {
    return this.apiService.get(`/workspaces/${this.workspaceId}/mappings/stats/`, { source_type: sourceType, destination_type: destinationType });
  }

  postMapping(mapping: MappingPost): Observable<PostMappingResponse> {
    return this.apiService.post(`/workspaces/${this.workspaceId}/mappings/`, mapping);
  }

  getMappings(mappingState: MappingState, allAlphabets: boolean, limit: number, offset: number, alphabetsFilter: string[], sourceType: string, destinationType: string): Observable<ExtendedExpenseAttributeResponse> {
    return this.apiService.get(
      `/workspaces/${this.workspaceId}/mappings/expense_attributes/`,
      {
        limit,
        offset,
        all_alphabets: allAlphabets,
        mapped: mappingState === MappingState.ALL ? MappingState.ALL : false,
        mapping_source_alphabets: alphabetsFilter.length ? alphabetsFilter : null,
        source_type: sourceType,
        destination_type: destinationType
      }
    );
  }

  emitWalkThroughTooltip(): void {
    this.showWalkThroughTooltip.emit();
  }

  deleteMappingSetting(mappingSettingId: number): Observable<{}> {
    return this.apiService.delete(`/workspaces/${this.workspaceId}/mappings/settings/${mappingSettingId}/`);
  }

  triggerAutoMapEmployees(): Observable<{}> {
    return this.apiService.post(`/workspaces/${this.workspaceId}/mappings/auto_map_employees/trigger/`, {});
  }

  getXeroField(): Observable<ExpenseField[]> {
    return this.apiService.get(`/workspaces/${this.workspaceId}/xero/xero_fields/`, {});
  }
}
