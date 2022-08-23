export type DefaultDestinationAttribute = {
  id: string,
  name: string,
};

export type GeneralMapping = {
  id?: number;
  bank_account: DefaultDestinationAttribute;
  payment_account: DefaultDestinationAttribute;
  default_tax_code: DefaultDestinationAttribute;
  created_at?: Date;
  updated_at?: Date;
  workspace?: number;
};