import { MappingSourceField, MappingDestinationField } from "../enum/enum.model";
import { ExpenseAttributeDetail } from "./expense-attribute-detail.model";
import { Mapping } from "./mapping.model";

export type MappingSetting = {
  id: number;
  created_at: Date;
  updated_at: Date;
  workspace: number;
  source_field: MappingSourceField | string;
  destination_field: MappingDestinationField | string;
  import_to_fyle: boolean;
  is_custom: boolean;
  source_placeholder: string | null
}

export type MappingSource = {
  id: number;
  attribute_type: string;
  display_name: string;
  value: string;
  source_id: number;
  auto_mapped: boolean;
  active: boolean;
  created_at: Date;
  updated_at: Date;
  workspace: number;
  detail: ExpenseAttributeDetail;
};

export type MappingSettingPost = {
  source_field: MappingSourceField | string;
  destination_field: MappingDestinationField | string;
  import_to_fyle: boolean;
  is_custom: boolean;
  source_placeholder: string | null
}

export type MappingSettingResponse = {
  count: number;
  next: string;
  previous: string;
  results: Mapping[];
};
