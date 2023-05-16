import { CloneSetting, CloneSettingExist } from "src/app/core/models/configuration/clone-setting.model";
import { GroupedDestinationAttribute } from "src/app/core/models/db/destination-attribute.model";
import { AutoMapEmployee, CCCExpenseState, ExpenseState, ExportDateType, MappingDestinationField, MappingSourceField, ReimbursableExpensesObject } from "src/app/core/models/enum/enum.model";

export const mockCloneSettingExist: CloneSettingExist = {
    is_available: true,
    workspace_name: 'Fyle for Ashwin'
};

export const mockCloneSettingsGet: CloneSetting = {
    workspace_id: 1,
    export_settings: {
        expense_group_settings: {
          reimbursable_expense_state: ExpenseState.PAID,
          reimbursable_export_date_type: null,
          ccc_expense_state: CCCExpenseState.PAID
        },
        workspace_general_settings: {
            reimbursable_expenses_object: ReimbursableExpensesObject.PURCHASE_BILL,
            corporate_credit_card_expenses_object: null,
            auto_map_employees: AutoMapEmployee.EMAIL,
            is_simplify_report_closure_enabled: false
        },
        general_mappings: {
          bank_account: {id: '1', name: 'Fyle'}
        },
        workspace_id: 1
    },
    import_settings: {
        general_mappings: {
            id: 1,
            created_at: new Date(),
            updated_at: new Date(),
            workspace: 1,
            bank_account: { name: 'fyle', id: "1" },
            default_tax_code: { name: 'fyle', id: '1' },
            payment_account: { name: 'fyle', id: '1' }
        },
        mapping_settings: [{
            id: 1,
            created_at: new Date(),
            updated_at: new Date(),
            workspace: 1,
            source_field: MappingSourceField.TAX_GROUP,
            destination_field: MappingSourceField.PROJECT,
            import_to_fyle: true,
            is_custom: true,
            source_placeholder: null
          },
          {
            id: 2,
            created_at: new Date(),
            updated_at: new Date(),
            workspace: 1,
            source_field: 'CUSTOM_FIELD',
            destination_field: MappingDestinationField.BANK_ACCOUNT,
            import_to_fyle: false,
            is_custom: true,
            source_placeholder: null
        }],
        workspace_general_settings: {
            auto_create_destination_entity: true,
            change_accounting_period: true,
            charts_of_accounts: ['Expense'],
            created_at: new Date("2022-04-27T11:07:17.694377Z"),
            id: 1,
            import_categories: false,
            import_projects: false,
            import_tax_codes: false,
            skip_cards_mapping: false,
            sync_fyle_to_xero_payments: false,
            sync_xero_to_fyle_payments: false,
            updated_at: new Date("2022-04-28T12:48:39.150177Z"),
            workspace: 1,
            reimbursable_expenses_object: "",
            corporate_credit_card_expenses_object: "",
            auto_map_employees: "",
            import_customers: false,
            map_merchant_to_contact: false,
            is_simplify_report_closure_enabled: true
        },
        workspace_id: 1
    },
    advanced_settings: {
        workspace_general_settings: {
          sync_fyle_to_xero_payments: true,
          sync_xero_to_fyle_payments: false,
          auto_create_destination_entity: true,
          change_accounting_period: true,
          auto_create_merchant_destination_entity: true
      
        },
        general_mappings: {
          payment_account: {id: '1', name: 'Fyle'}
        },
        workspace_schedules: {
          enabled: true,
          interval_hours: 10,
          start_datetime: new Date("2022-01-16"),
          emails_selected: [],
          additional_email_options: []
        },
        workspace_id: 1
      }
  };

export const mockGroupedDestinationAttribtues: GroupedDestinationAttribute = {
    BANK_ACCOUNT: [{
        id: 3,
        attribute_type: 'BANK_ACCOUNT',
        display_name: "string",
        value: "Fyle",
        destination_id: "1",
        active: true,
        created_at: new Date(),
        updated_at: new Date(),
        workspace: 2,
        detail: {
        email: 'String',
        fully_qualified_name: 'string'
        }
    }],
    TAX_CODE: []
};
