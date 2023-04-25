import { Injectable } from '@angular/core';
import { ExpenseFieldsFormOption, ImportSettingPost } from '../../models/configuration/import-setting.model';
import { ApiService } from '../core/api.service';
import { WorkspaceService } from '../workspace/workspace.service';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MappingSetting } from '../../models/db/mapping-setting.model';
import { ExpenseField } from '../../models/misc/expense-field.model';
import { RxwebValidators } from '@rxweb/reactive-form-validators';

@Injectable({
  providedIn: 'root'
})
export class ImportSettingService {
  workspaceId = this.workspaceService.getWorkspaceId()

  constructor(
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    private workspaceService: WorkspaceService
  ) { }

  getImportSettings() {
    return this.apiService.get(`/v2/workspaces/${this.workspaceId}/import_settings/`, {});
  }

  postImportSettings(exportSettingsPayload: ImportSettingPost){
    return this.apiService.put(`/v2/workspaces/${this.workspaceId}/import_settings/`, exportSettingsPayload);
  }

  getChartOfAccountTypesList(): string[] {
    return ['Expense', 'Asset', 'Equity', 'Liability', 'Revenue'];
  }

  createChartOfAccountField(type: string, selectedChartsOfAccounts: string[]): FormGroup {
    const chartOfAccounts = type.toUpperCase();
    return this.formBuilder.group({
      enabled: [selectedChartsOfAccounts.includes(chartOfAccounts) || type === 'Expense' ? true : false],
      name: [type]
    });
  }

  private importToggleWatcher(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: object} | null => {
      if (control.value) {
        // Mark Fyle field as mandatory if toggle is enabled
        control.parent?.get('source_field')?.setValidators(Validators.required);
        control.parent?.get('source_field')?.setValidators(RxwebValidators.unique());
      } else {
        // Reset Fyle field if toggle is disabled
        control.parent?.get('source_field')?.clearValidators();
        control.parent?.get('source_field')?.setValue(null);
      }

      return null;
    };
  }

  getExpenseFieldsFormArray(xeroExpenseFields: ExpenseFieldsFormOption[], isWatcherRequired: boolean): FormGroup[] {
    return xeroExpenseFields.map((field) => {
      return this.formBuilder.group({
        source_field: [field.source_field],
        destination_field: [field.destination_field.toUpperCase()],
        disable_import_to_fyle: [field.disable_import_to_fyle],
        import_to_fyle: [field.import_to_fyle, isWatcherRequired ? this.importToggleWatcher() : ''],
        source_placeholder: ['']
      });
    });
  }

  getXeroExpenseFields(xeroAttributes: ExpenseField[], mappingSettings: MappingSetting[]): ExpenseFieldsFormOption[] {
    return xeroAttributes.map(attribute => {
      const mappingSetting = mappingSettings.filter((mappingSetting: MappingSetting) => mappingSetting.destination_field.toUpperCase() === attribute.attribute_type);
      return {
        source_field: mappingSetting.length > 0 ? mappingSetting[0].source_field : '',
        destination_field: attribute.display_name,
        import_to_fyle: mappingSetting.length > 0 ? mappingSetting[0].import_to_fyle : false,
        disable_import_to_fyle: false,
        source_placeholder: ''
      };
    });
  }
}
