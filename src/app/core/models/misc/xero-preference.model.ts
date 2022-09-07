// Having any here is okay
export type XeroPreference = {
  AccountingInfoPrefs: any;
  ProductAndServicesPrefs: any;
  SalesFormsPrefs: any;
  EmailMessagesPrefs: any;
  VendorAndPurchasesPrefs: any;
  TimeTrackingPrefs: any;
  TaxPrefs: any;
  CurrencyPrefs: any;
  ReportPrefs: any;
  OtherPrefs: any;
  domain: string;
  sparse: boolean;
  Id: string;
  SyncToken?: string;
  MetaData: any;
  HomeCurrency?: any;
  MultiCurrencyEnabled?: boolean;
};
