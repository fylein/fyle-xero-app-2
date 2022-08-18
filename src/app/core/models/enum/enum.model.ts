export enum TenantFieldMapping {
  TENANT = 'TENANT'
}

export enum ExpenseState {
  PAYMENT_PROCESSING = 'PAYMENT_PROCESSING',
  PAID = 'PAID'
}

export enum ExportDateType {
  LAST_SPENT_AT = 'last_spent_at',
  SPENT_AT = 'spent_at',
  CURRENT_DATE = 'current_date',
  APPROVED_AT = 'approved_at',
  VERIFIED_AT = 'verified_at'
}

export enum ReimbursableExpensesObject {
  PURCHASE_BILL = 'PURCHASE BILL'
}

export enum CorporateCreditCardExpensesObject {
  BANK_TRANSACTION = 'BANK TRANSACTION'
}

export enum MappingSourceField {
  PROJECT = 'PROJECT',
  COST_CENTER = 'COST_CENTER',
  TAX_GROUP = 'TAX_GROUP'
}

export enum MappingDestinationField {
  ACCOUNT = 'ACCOUNT',
  CONTACT = 'CONTACT',
  DBANK_ACCOUNT = 'BANK_ACCOUNT',
  TAX_CODE = 'TAX_CODE'
}

export enum ExpenseGroupingFieldOption {
  CLAIM_NUMBER = 'claim_number',
  SETTLEMENT_ID = 'settlement_id',
  EXPENSE_ID = 'expense_id'
}

export enum PaymentSyncDirection {
  FYLE_TO_XERO = 'fyle_to_xero',
  XERO_TO_FYLE = 'xero_to_fyle'
}

export enum OnboardingState {
  CONNECTION = 'CONNECTION',
  EXPORT_SETTINGS = 'EXPORT_SETTINGS',
  IMPORT_SETTINGS = 'IMPORT_SETTINGS',
  ADVANCED_CONFIGURATION = 'ADVANCED_CONFIGURATION',
  COMPLETE = 'COMPLETE'
}

export enum PaginatorPage {
  MAPPING = 'mapping',
  EXPORT_LOG = 'export-log'
}

export enum FyleReferenceType {
  REPORT_ID = 'report_id',
  EXPENSE_REPORT = 'claim_number',
  PAYMENT = 'settlement_id',
  EXPENSE = 'expense_id'
}

export enum MappingState {
  MAPPED = 'MAPPED',
  UNMAPPED = 'UNMAPPED',
  ALL = 'ALL'
}

export enum ErrorType {
  EMPLOYEE_MAPPING = 'EMPLOYEE_MAPPING',
  CATEGORY_MAPPING = 'CATEGORY_MAPPING',
  TAX_MAPPING = 'TAX_MAPPING',
  XERO_ERROR = 'XERO_ERROR'
}

export enum FyleField {
  EMPLOYEE = 'EMPLOYEE',
  CATEGORY = 'CATEGORY',
  PROJECT = 'PROJECT',
  COST_CENTER = 'COST_CENTER',
  TAX_GROUP = 'TAX_GROUP',
  CORPORATE_CARD = 'CORPORATE_CARD'
}

export enum ExportState {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED'
}

export enum TaskLogType {
  CREATING_BILL = 'CREATING_BILL',
  CREATING_BANK_TRANSACTION = 'CREATING_BANK_TRANSACTION',
  CREATING_PAYMENT = 'CREATING_PAYMENT',
  FETCHING_EXPENSE = 'FETCHING_EXPENSE'
}

export enum TaskLogState {
  ENQUEUED = 'ENQUEUED',
  IN_PROGRESS = 'IN_PROGRESS',
  FAILED = 'FAILED',
  FATAL = 'FATAL',
  COMPLETED = 'COMPLETED',
}

export enum ExportMode {
  MANUAL = 'MANUAL',
  AUTO = 'AUTO'
}

export enum ConfigurationCtaText {
  SAVE = 'Save',
  SAVE_AND_CONTINUE = 'Save and Continue',
  CONTINUE = 'Continue',
  SAVING = 'Saving'
}

export enum RedirectLink {
  FYLE_WEBSITE = 'https://fylehq.com/',
  FYLE_HELP = 'https://help.fylehq.com/en/collections/215867-integrations-with-fyle#xero-2-0',
  EXPORT = 'https://help.fylehq.com/en/articles/6240421-how-to-export-expenses-from-fyle-to-xero-via-the-integration',
  CONFIGURATION_XERO_CONNECTOR = 'https://help.fylehq.com/en/articles/6208620-how-to-set-up-the-fyle-xero-integration-v2-0',
  CONFIGURATION_EMPLOYEE_SETTING = 'https://help.fylehq.com/en/articles/6208620-how-to-set-up-the-fyle-xero-integration-v2-0#h_d70f1d54cc',
  CONFIGURATION_EXPORT_SETTING = 'https://help.fylehq.com/en/articles/6208620-how-to-set-up-the-fyle-xero-integration-v2-0#h_dca1353686',
  CONFIGURATION_IMPORT_SETTING = 'https://help.fylehq.com/en/articles/6208620-how-to-set-up-the-fyle-xero-integration-v2-0#h_b8a2df129f',
  CONFIGURATION_ADVANCED_SETTING = 'https://help.fylehq.com/en/articles/6208620-how-to-set-up-the-fyle-xero-integration-v2-0#h_18c28de6c7'
}

export enum ClickEvent {
  CONNECT_XERO = 'Connect XERO',
  ONBOARDING_DONE = 'Onboarding Done',
  RECONNECT_XERO = 'Reconnect Xero with different company',
  PREVIEW_XERO_EXPORT = 'Preview Xero Export',
  PREVIEW_FYLE_EXPENSE_FORM = 'Preview Fyle Expense Form',
  HELP_SECTION = 'Help Section',
  EXPORT = 'Export',
  FAILED_EXPORTS = 'Failed Exports',
  SUCCESSFUL_EXPORTS = 'Successful Exports',
  EXPORT_LOG_PAGE_NAVIGATION = 'Export Log Page Navigation',
  MAPPING_PAGE_NAVIGATION = 'Mapping Page Navigation',
  UNMAPPED_MAPPINGS_FILTER = 'Unmapped Mappings Filter',
  MAPPED_MAPPINGS_FILTER = 'Mapped Mappings Filter',
  DISCONNECT_XERO = 'Disconnect Xero',
  SYNC_DIMENSION = 'Sync Dimension'
}

export enum ProgressPhase {
  ONBOARDING = 'Onboarding',
  POST_ONBOARDING = 'Post Onboarding'
}

export enum OnboardingStep {
  LANDING = 'Landing',
  CONNECT_XERO = 'Connect XERO',
  EXPORT_SETTINGS = 'Export Settings',
  IMPORT_SETTINGS = 'Import Settings',
  ADVANCED_SETTINGS = 'Advanced Settings',
  ONBOARDING_DONE = 'Onboarding Done'
}

export enum UpdateEvent {
  CONNECT_XERO = 'Connect XERO',
  EXPORT_SETTINGS = 'Export Settings',
  IMPORT_SETTINGS = 'Import Settings',
  ADVANCED_SETTINGS = 'Advanced Settings',
  PAGE_SIZE = 'Page Size',
  CUSTOM_MAPPING = 'Custom Mapping'
}

export enum DeleteEvent {
  CUSTOM_MAPPING = 'Custom Mapping'
}

export enum Action {
  RESOLVE_ERROR = 'Resolving Error'
}

export enum SimpleSearchPage {
  DASHBOARD = 'Dashboard',
  EXPORT_LOG = 'Export Log',
  MAPPING = 'Mapping',
  CONFIGURATION = 'Configuration',
}

export enum SimpleSearchType {
  TEXT_FIELD = 'Text Field',
  SELECT_FIELD = 'Select Field'
}

export enum RefinerSurveyType {
  ONBOARDING_DONE = 'Onboarding Done',
  EXPORT_DONE = 'Export Done'
}

export enum ZeroStatePage {
  export_log = 'export_log',
  mapping = 'mapping',
  dashboard = 'dashboard',
  dashboard_error = 'dashboard_error',
  custom_mapping = 'custom_mapping'
}
