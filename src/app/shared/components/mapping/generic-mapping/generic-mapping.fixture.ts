import { DestinationAttribute } from "src/app/core/models/db/destination-attribute.model";
import { MappingSetting, MappingSettingResponse, MinimalMappingSetting } from "src/app/core/models/db/mapping-setting.model";
import { MappingList, MappingPost, MappingStats } from "src/app/core/models/db/mapping.model";
import { MappingDestinationField, MappingSourceField, MappingState } from "src/app/core/models/enum/enum.model";
import { environment } from "src/environments/environment";
import { expenseAttribute } from "../../dashboard/dashboard-resolve-mapping-error-dialog/dashboard-resolve-mapping.fixture";
const API_BASE_URL = environment.cluster_domain_api_url;
const workspace_id = 1;
export const mappingSetting:MappingSetting[] = [{
  id: 1,
  created_at: new Date(),
  updated_at: new Date(),
  workspace: 2,
  source_field: "CATEGORY",
  destination_field: MappingDestinationField.ACCOUNT,
  import_to_fyle: true,
  is_custom: true,
  source_placeholder: 'string'
}];
export const mappinglist: MappingList[] = [{
  fyle: {
      id: 1,
      value: 'string'
  },
  xero: {
      id: 'string',
      value: 'string'
  },
  autoMapped: true,
  state: MappingState.ALL,
  index: 0
},
{
  fyle: {
      id: 1,
      value: 'string'
  },
  xero: {
      id: 'string',
      value: 'string'
  },
  autoMapped: true,
  state: MappingState.UNMAPPED,
  index: 1
}];
export const minimaMappingSetting:MinimalMappingSetting = {
  source_field: MappingSourceField.PROJECT,
  destination_field: MappingDestinationField.ACCOUNT
};

export const minimaMappingSetting1:MinimalMappingSetting = {
  source_field: "CATEGORY",
  destination_field: MappingDestinationField.ACCOUNT
};

const destination:DestinationAttribute = {
  id: 1,
  attribute_type: 'VENDOR',
  display_name: 'Vendor',
  value: 'dummy',
  destination_id: '1',
  active: true,
  created_at: new Date(),
  updated_at: new Date(),
  workspace: 2,
  detail: {
    email: 'dummy@gmail.com',
    fully_qualified_name: 'Fyle'
  }
};

export const MappingPostpayload: MappingPost = {
  source_type: 'Payment',
  source_value: 'dummy',
  destination_type: 'Expence',
  destination_id: '1',
  destination_value: 'dummy'
};

export const response = {
    source_type: 'Payment',
    source_value: 'dummy',
    destination_type: 'Expence',
    destination_id: '1',
    destination_value: 'dummy'
};

export const response1 = {
  "count": 125,
  "next": `${API_BASE_URL}/workspaces/${workspace_id}/mappings/expense_attributes/?all_alphabets=true&destination_type=ACCOUNT&limit=3&mapped=ALL&mapping_source_alphabets=null&offset=6&source_type=CATEGORY`,
  "previous": `${API_BASE_URL}/workspaces/${workspace_id}/mappings/expense_attributes/?all_alphabets=true&destination_type=ACCOUNT&limit=3&mapped=ALL&mapping_source_alphabets=null&source_type=CATEGORY`,
  "results": [
    {
      mapping: [{
        id: 1,
        source: {
          id: 1,
          attribute_type: 'string',
          display_name: 'string',
          value: 'string',
          source_id: 1,
          auto_mapped: true,
          active: true,
          created_at: new Date(),
          updated_at: new Date(),
          workspace: 1,
          detail: {
            location: 'string',
            full_name: 'string',
            department_id: 'string',
            department: 'string',
            department_code: 'string',
            employee_code: 'string'
          }
        },
        destination: {
          id: 1,
          attribute_type: 'VENDOR',
          display_name: 'Vendor',
          value: 'dummy',
          destination_id: '1',
          active: true,
          created_at: new Date(),
          updated_at: new Date(),
          workspace: +workspace_id,
          detail: {
            email: 'dummy@gmail.com',
            fully_qualified_name: 'Fyle'
          }
        },
        created_at: new Date(),
        updated_at: new Date(),
        workspace: 2
      }
      ]

    }
  ]
};
export const getMappingSettingResponse: MappingSettingResponse = {
  count: 0, next: 'aa', previous: 'aa', results: mappingSetting
};
export const getMappingStats: MappingStats = {
  all_attributes_count: 3,
  unmapped_attributes_count: 3
};
export const destinationAttribute: DestinationAttribute[] = [{
  active: true,
  attribute_type: "ACCOUNT",
  created_at: new Date("2022-06-14T06:24:56.947727Z"),
  destination_id: "800",
  detail: { email: 'fyle@fyle.in', fully_qualified_name: 'Fyle' },
  display_name: "Account",
  id: 1,
  updated_at: new Date("2022-06-14T06:24:56.947727Z"),
  value: "Accounts Payable",
  workspace: 146
}];

export const getMappingsresponse={
  "count": 125,
  "next": `${API_BASE_URL}/workspaces/${workspace_id}/mappings/expense_attributes/?all_alphabets=true&destination_type=ACCOUNT&limit=3&mapped=ALL&mapping_source_alphabets=null&offset=6&source_type=CATEGORY`,
  "previous": `${API_BASE_URL}/workspaces/${workspace_id}/mappings/expense_attributes/?all_alphabets=true&destination_type=ACCOUNT&limit=3&mapped=ALL&mapping_source_alphabets=null&source_type=CATEGORY`,
  "results": [
    {
      "id": 36,
      "mapping": [],
      "attribute_type": "CATEGORY",
      "display_name": "Category",
      "value": "Advertising",
      "source_id": 186449,
      "auto_mapped": false,
      "auto_created": false,
      "active": false,
      "detail": null,
      "created_at": new Date("2022-04-29T07:14:58.746099Z"),
      "updated_at": new Date("2022-04-29T07:14:58.746128Z"),
      "workspace": 1
  },
  {
    "id": 35,
    "mapping": [
      {
        id: 2,
        source: expenseAttribute,
        destination: destinationAttribute,
        created_at: new Date("2022-04-29T07:14:58.746099Z"),
        updated_at: new Date("2022-04-29T07:14:58.746099Z"),
        workspace: 2
      }
    ],
    "attribute_type": "CATEGORY",
    "display_name": "Category",
    "value": "Advertising",
    "source_id": 186449,
    "auto_mapped": false,
    "auto_created": false,
    "active": false,
    "detail": null,
    "created_at": new Date("2022-04-29T07:14:58.746099Z"),
    "updated_at": new Date("2022-04-29T07:14:58.746128Z"),
    "workspace": 2
  }
  ]
};
