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

export const mappingSettings: MappingSetting[] = [
  {
    id: 1,
    created_at: new Date(),
    updated_at: new Date(),
    workspace: 2,
    source_field: MappingSourceField.TAX_GROUP,
    destination_field: "XERO",
    import_to_fyle: true,
    is_custom: false,
    source_placeholder: null
  },
  {
    id: 2,
    created_at: new Date(),
    updated_at: new Date(),
    workspace: 2,
    source_field: FyleField.CATEGORY,
    destination_field: FyleField.COST_CENTER,
    import_to_fyle: false,
    is_custom: false,
    source_placeholder: null
  },
  {
    id: 3,
    created_at: new Date(),
    updated_at: new Date(),
    workspace: 2,
    source_field: FyleField.PROJECT,
    destination_field: MappingDestinationField.CONTACT,
    import_to_fyle: false,
    is_custom: false,
    source_placeholder: null
  },
  {
    id: 4,
    created_at: new Date(),
    updated_at: new Date(),
    workspace: 2,
    source_field: FyleField.PROJECT,
    destination_field: MappingDestinationField.ACCOUNT,
    import_to_fyle: false,
    is_custom: false,
    source_placeholder: null
  },
  {
    id: 5,
    created_at: new Date(),
    updated_at: new Date(),
    workspace: 2,
    source_field: FyleField.PROJECT,
    destination_field: MappingDestinationField.TAX_CODE,
    import_to_fyle: false,
    is_custom: false,
    source_placeholder: null
  },
  {
    id: 6,
    created_at: new Date(),
    updated_at: new Date(),
    workspace: 2,
    source_field: FyleField.EMPLOYEE,
    destination_field: MappingDestinationField.BANK_ACCOUNT,
    import_to_fyle: false,
    is_custom: false,
    source_placeholder: null
  },
  {
    id: 7,
    created_at: new Date(),
    updated_at: new Date(),
    workspace: 2,
    source_field: FyleField.EMPLOYEE,
    destination_field: 'ITEM',
    import_to_fyle: false,
    is_custom: false,
    source_placeholder: null
  }
];

export const mappingSettingResponse: MappingSettingResponse = {
  count: 0,
  next: 'aa',
  previous: 'aa',
  results: mappingSettings.splice(0, 2)
};

export const mappingRow: MappingSettingList = {
  xeroField: MappingDestinationField.ACCOUNT,
  fyleField: FyleField.COST_CENTER,
  index: 0,
  existingMapping: true,
  isDeleteButtonAllowed: true,
  id: 1
};

export const mappingRows: MappingSettingList[] = [{
  xeroField: MappingDestinationField.ACCOUNT,
  fyleField: FyleField.COST_CENTER,
  index: 0,
  existingMapping: true,
  isDeleteButtonAllowed: true,
  id: 1
}];

export const mappingRows1: MappingSettingList[] = [{
  xeroField: MappingDestinationField.ACCOUNT,
  fyleField: MappingSourceField.PROJECT,
  index: 0,
  existingMapping: true,
  isDeleteButtonAllowed: true,
  id: 1
}];

export const mappingRows2: MappingSettingList[] = [{
  xeroField: MappingDestinationField.ACCOUNT,
  fyleField: MappingSourceField.TAX_GROUP,
  index: 0,
  existingMapping: true,
  isDeleteButtonAllowed: true,
  id: 1
},
{
  xeroField: MappingDestinationField.ACCOUNT,
  fyleField: MappingSourceField.PROJECT,
  index: 1,
  existingMapping: true,
  isDeleteButtonAllowed: true,
  id: 1
}];

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
