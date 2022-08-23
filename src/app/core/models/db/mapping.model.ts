import { DestinationAttributeDetail } from "./destination-attribute.model";
import { MappingSource } from "./mapping-setting.model";

export type MappingDestination = {
    id: number;
    attribute_type: string;
    display_name: string;
    value: string;
    destination_id: string;
    active: boolean;
    created_at: Date;
    updated_at: Date;
    workspace: number;
    detail: DestinationAttributeDetail;
  };
  export type Mapping = {
    id?: number;
    source?: MappingSource;
    source_value?: string;
    destination?: MappingDestination;
    source_type: string;
    destination_type: string;
    destination_value?: string;
    destination_id?: string;
    created_at?: Date;
    updated_at?: Date;
    workspace?: number;
  };