import { FormGroup } from "@angular/forms";
import { AdvancedSettingGet, AdvancedSettingModel, AdvancedSettingPost } from "./advanced-setting.model";
import { ExportSettingGet, ExportSettingModel, ExportSettingPost } from "./export-setting.model";
import { ImportSettingGet, ImportSettingModel, ImportSettingPost } from "./import-setting.model";
import { MappingSetting } from "../db/mapping-setting.model";

export type CloneSetting = {
    workspace_id: number,
    export_settings: ExportSettingGet,
    import_settings: ImportSettingGet,
    advanced_settings: AdvancedSettingGet
}

export type CloneSettingPost = {
    export_settings: ExportSettingPost,
    import_settings: ImportSettingPost,
    advanced_settings: AdvancedSettingPost
}

export type CloneSettingExist = {
    is_available: boolean,
    workspace_name: string
}

export class CloneSettingModel {
    static constructPayload(cloneSettingsForm: FormGroup, customMappingSettings: MappingSetting[]): CloneSettingPost {
        const exportSettingPayload = ExportSettingModel.constructPayload(cloneSettingsForm);
        const importSettingPayload = ImportSettingModel.constructPayload(cloneSettingsForm, customMappingSettings);
        const advancedSettingPayload = AdvancedSettingModel.constructPayload(cloneSettingsForm);

        const cloneSettingPayload: CloneSettingPost = {
            export_settings: exportSettingPayload,
            import_settings: importSettingPayload,
            advanced_settings: advancedSettingPayload
        };

        return cloneSettingPayload;
    }
}
