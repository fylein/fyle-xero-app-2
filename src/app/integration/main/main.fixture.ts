import { MappingSetting, MappingSettingResponse } from "src/app/core/models/db/mapping-setting.model";
import { MappingSourceField, MappingDestinationField, FyleField } from "src/app/core/models/enum/enum.model";
import { DashboardModule } from "src/app/core/models/misc/dashboard-module.model";
import { ExpenseField } from "src/app/core/models/misc/expense-field.model";


export const modules: DashboardModule[] = [
  {
    name: 'Dashboard',
    route: 'dashboard',
    iconPath: 'assets/images/svgs/general/dashboard',
    childPages: [],
    isExpanded: false,
    isActive: false
  },
  {
    name: 'Export Log',
    route: 'export_log',
    iconPath: 'assets/images/svgs/general/export-log',
    childPages: [],
    isExpanded: false,
    isActive: false
  },
  {
    name: 'Employee Mapping',
    route: 'mapping',
    iconPath: 'assets/images/svgs/general/mapping',
    isExpanded: false,
    isActive: false,
    childPages: []
  },
  {
    name: 'Configuration',
    route: 'configuration',
    iconPath: 'assets/images/svgs/stepper/configuration',
    isExpanded: false,
    isActive: false,
    childPages: [
      {
        name: 'Map Employees',
        route: 'configuration/employee_settings',
        isActive: false
      },
      {
        name: 'Export Settings',
        route: 'configuration',
        isActive: false
      },
      {
        name: 'Import Settings',
        route: 'configuration/import_settings',
        isActive: false
      },
      {
        name: 'Advanced Settings',
        route: 'configuration/advanced_settings',
        isActive: false
      }
    ]
  }
];
const mappingSetting:MappingSetting[] = [{
  id: 1,
  created_at: new Date(),
  updated_at: new Date(),
  workspace: 2,
  source_field: MappingSourceField.PROJECT,
  destination_field: MappingDestinationField.ACCOUNT,
  import_to_fyle: true,
  is_custom: true,
  source_placeholder: 'string'
},
{
  id: 8,
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
},
{
  id: 8,
  created_at: new Date(),
  updated_at: new Date(),
  workspace: 2,
  source_field: FyleField.CORPORATE_CARD,
  destination_field: 'PROJECT2',
  import_to_fyle: false,
  is_custom: false,
  source_placeholder: null
}];

export const mappingSettingResponse: MappingSettingResponse = {
  count: 0, next: 'aa', previous: 'aa', results: mappingSetting};

  export const fyleExpenseFields2: ExpenseField[] = [];
