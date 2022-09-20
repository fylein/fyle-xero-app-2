import { MappingSetting, MappingSettingList, MappingSettingResponse } from "src/app/core/models/db/mapping-setting.model";
import { FyleField, MappingDestinationField, MappingSourceField} from "src/app/core/models/enum/enum.model";
import { ExpenseField } from "src/app/core/models/misc/expense-field.model";

export const fyleExpenseFields: ExpenseField[] = [
  {
    attribute_type: FyleField.COST_CENTER,
    display_name: 'Cost Center'
  },
  {
    attribute_type: FyleField.PROJECT,
    display_name: 'Project'
  }
];

const mappingSettings: MappingSetting[] = [
  {
    id: 1,
    created_at: new Date(),
    updated_at: new Date(),
    workspace: 2,
    source_field: MappingSourceField.PROJECT,
    destination_field: MappingDestinationField.ACCOUNT,
    import_to_fyle: true,
    is_custom: false,
    source_placeholder: null
  },
  {
    id: 2,
    created_at: new Date(),
    updated_at: new Date(),
    workspace: 2,
    source_field: MappingSourceField.COST_CENTER,
    destination_field: MappingDestinationField.ACCOUNT,
    import_to_fyle: false,
    is_custom: false,
    source_placeholder: null
  }
];

export const mappingSettingResponse: MappingSettingResponse = {
  count: 0,
  next: 'aa',
  previous: 'aa',
  results: mappingSettings
};

export const mappingRow: MappingSettingList = {
  xeroField: MappingDestinationField.ACCOUNT,
  fyleField: FyleField.COST_CENTER,
  index: 0,
  existingMapping: true,
  isDeleteButtonAllowed: true
};

export const mappedRowsFormArray = [
  {
    id: 1,
    sourceField: 'PROJECT',
    xeroField: FyleField.CATEGORY,
    index: 0,
    existingMapping: false
  }
];

export const xeroField = [
  {
    attribute_type: 'REGION',
    display_name: 'Region'
  }
];
