import { EventEmitter, Injectable, Output } from '@angular/core';
import { ExpenseFieldsFormOption, ImportSettingPost } from '../../models/configuration/import-setting.model';
import { ApiService } from '../core/api.service';
import { WorkspaceService } from '../workspace/workspace.service';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MappingSetting } from '../../models/db/mapping-setting.model';
import { ExpenseField, ExpenseFieldFormArray } from '../../models/misc/expense-field.model';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { MatDialog } from '@angular/material/dialog';
import { ExpenseFieldCreationDialogComponent } from 'src/app/shared/components/configuration/import-settings/expense-field-creation-dialog/expense-field-creation-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class ImportSettingService {
  workspaceId = this.workspaceService.getWorkspaceId()

  @Output() patchExpenseFieldEmitter: EventEmitter<ExpenseFieldFormArray> = new EventEmitter();

  constructor(
    private apiService: ApiService,
    private dialog: MatDialog,
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
        source_field: [field.source_field, Validators.required],
        destination_field: [field.destination_field.toUpperCase()],
        disable_import_to_fyle: [field.disable_import_to_fyle],
        import_to_fyle: [field.import_to_fyle, isWatcherRequired ? this.importToggleWatcher() : ''],
        source_placeholder: ['']
      });
    });
  }

  getXeroExpenseFields(xeroAttributes: ExpenseField[], mappingSettings: MappingSetting[], isCloneSettings: boolean = false, fyleFields: string[] = []): ExpenseFieldsFormOption[] {
    return xeroAttributes.map(attribute => {
      const mappingSetting = mappingSettings.filter((mappingSetting: MappingSetting) => {
        if (mappingSetting.destination_field.toUpperCase() === attribute.attribute_type) {
          if (isCloneSettings) {
            return fyleFields.includes(mappingSetting.source_field.toUpperCase()) ? mappingSetting : false;
          }

          return mappingSetting;
        }

        return false;
      });

      return {
        source_field: mappingSetting.length > 0 ? mappingSetting[0].source_field : '',
        destination_field: attribute.attribute_type,
        import_to_fyle: mappingSetting.length > 0 ? mappingSetting[0].import_to_fyle : false,
        disable_import_to_fyle: false,
        source_placeholder: ''
      };
    });
  }

  private getPatchExpenseFieldValues(destinationType: string, sourceField: string = '', source_placeholder: string = '', addSourceField: boolean = false): ExpenseFieldFormArray {
    return {
        source_field: sourceField,
        destination_field: destinationType,
        import_to_fyle: sourceField ? true : false,
        disable_import_to_fyle: sourceField ? true : false,
        source_placeholder: source_placeholder,
        addSourceField: addSourceField
    };
  }

  createExpenseField(destinationType: string, mappingSettings: MappingSetting[]): void {
    const existingFields = mappingSettings.map(setting => setting.source_field.split('_').join(' '));
    const dialogRef = this.dialog.open(ExpenseFieldCreationDialogComponent, {
      width: '551px',
      data: existingFields
    });

    const expenseFieldValue = this.getPatchExpenseFieldValues(destinationType);
    this.patchExpenseFieldEmitter.emit(expenseFieldValue);

    dialogRef.afterClosed().subscribe((expenseField) => {
      if (expenseField) {
        const sourceType = expenseField.name.split(' ').join('_').toUpperCase();

        const expenseFieldValue = this.getPatchExpenseFieldValues(destinationType, sourceType, expenseField.source_placeholder, true);
        this.patchExpenseFieldEmitter.emit(expenseFieldValue);
      }
    });
  }
}
