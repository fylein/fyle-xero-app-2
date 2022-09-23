import { environment } from "src/environments/environment";
import { MappingSetting, MappingSettingPost, MappingSettingResponse } from "../../models/db/mapping-setting.model";
import { MappingPost, MappingStats } from "../../models/db/mapping.model";
import { MappingDestinationField, MappingSourceField } from "../../models/enum/enum.model";
import { ExpenseField } from "../../models/misc/expense-field.model";

const API_BASE_URL = environment.api_url;
const workspace_id = environment.tests.workspaceId;

export const mappingSettingPayload: MappingSettingPost[] = [{
  source_field: MappingSourceField.COST_CENTER,
  destination_field: MappingDestinationField.ACCOUNT,
  import_to_fyle: false,
  is_custom: false,
  source_placeholder: null
}];

export const postMappingSettingResponse: MappingSetting[] = [{
  id: 21,
  created_at: new Date(),
  updated_at: new Date(),
  workspace: 1,
  source_field: MappingSourceField.COST_CENTER,
  destination_field: MappingDestinationField.ACCOUNT,
  import_to_fyle: false,
  is_custom: false,
  source_placeholder: null
}];

export const FyleExpenseFieldsresponse: ExpenseField[] = [
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

export const MappingSettingsresponse: MappingSettingResponse = {
  count: 0, next: 'aa', previous: 'aa', results: []
};

export const destinationAttributes: string[] = ['BANK_ACCOUNT', 'CONTACT', 'ACCOUNT', 'TENANT'];

export const GroupedXeroDestinationAttributesresponse = [
  {"id": 45531, "attribute_type": "CONTACT", "display_name": "Contact", "value": "2285 Fyle Credit Card", "destination_id": "106", "auto_created": false, "active": null, "detail": {"account_type": "Credit Card", "fully_qualified_name": "2285 Fyle Credit Card"}, "created_at": "2022-04-14T06:09:07.537182Z", "updated_at": "2022-04-14T06:09:07.537205Z", "workspace": 216}
];

export const MappingStatsresponse: MappingStats = {
  all_attributes_count: 3,
  unmapped_attributes_count: 3
};

export const MappingPostpayload: MappingPost = {
  source_type: 'Payment',
  source_value: 'dummy',
  destination_type: 'Expence',
  destination_id: '1',
  destination_value: 'dummy'
};

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
  }
  ]
};

export const response = {
  BANK_ACCOUNT: [],
  TAX_CODE: []
};