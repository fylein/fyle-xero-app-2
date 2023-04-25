import { AdvancedSettingGet } from "./advanced-setting.model";
import { ExportSettingGet } from "./export-setting.model";
import { ImportSettingGet } from "./import-setting.model";

export type CloneSetting = {
    workspace_id: number,
    export_settings: ExportSettingGet,
    import_settings: ImportSettingGet,
    advanced_settings: AdvancedSettingGet
}
