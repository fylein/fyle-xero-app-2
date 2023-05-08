import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ExportSettingFormOption, ExportSettingGet, ExportSettingPost } from '../../models/configuration/export-setting.model';
import { ApiService } from '../core/api.service';
import { WorkspaceService } from '../workspace/workspace.service';
import { AutoMapEmployee, CCCExpenseState, ExpenseState, ExportDateType, ReimbursableExpensesObject } from '../../models/enum/enum.model';
import { AbstractControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ExportSettingService {
  workspaceId = this.workspaceService.getWorkspaceId();

  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService
  ) { }

  getExportSettings(): Observable<ExportSettingGet>{
    return this.apiService.get(`/v2/workspaces/${this.workspaceId}/export_settings/`, {});
  }

  postExportSettings(exportSettingsPayload: ExportSettingPost): Observable<ExportSettingGet> {
    return this.apiService.put(`/v2/workspaces/${this.workspaceId}/export_settings/`, exportSettingsPayload);
  }

  getAutoMapEmployeeOptions(): ExportSettingFormOption[] {
    return [
      {
        label: 'None',
        value: null
      },
      {
        label: 'Employee name on Fyle to contact name on Xero',
        value: AutoMapEmployee.NAME
      },
      {
        label: 'Employee email on Fyle to contact email on Xero',
        value: AutoMapEmployee.EMAIL
      }
    ];
  }

  getReimbursableExpenseGroupingDateOptions(): ExportSettingFormOption[] {
     return [
      {
        label: 'Current Date',
        value: ExportDateType.CURRENT_DATE
      },
      {
        label: 'Verification Date',
        value: ExportDateType.VERIFIED_AT
      },
      {
        label: 'Spend Date',
        value: ExportDateType.SPENT_AT
      },
      {
        label: 'Approval Date',
        value: ExportDateType.APPROVED_AT
      },
      {
        label: 'Last Spend Date',
        value: ExportDateType.LAST_SPENT_AT
      }
    ];
  }

  getReimbursableExpenseStateOptions(isSimplifyReportClosureEnabled: boolean): ExportSettingFormOption[] {
    return [
      {
        label: isSimplifyReportClosureEnabled ? 'Processing' : 'Payment Processing',
        value: ExpenseState.PAYMENT_PROCESSING
      },
      {
        label: isSimplifyReportClosureEnabled ? 'Closed' : 'Paid',
        value: ExpenseState.PAID
      }
    ];
  }

  getCCCExpenseStateOptions(isSimplifyReportClosureEnabled: boolean): ExportSettingFormOption[] {
    return [
      {
        label: isSimplifyReportClosureEnabled ? 'Approved' : 'Payment Processing',
        value: isSimplifyReportClosureEnabled ? CCCExpenseState.APPROVED: CCCExpenseState.PAYMENT_PROCESSING
      },
      {
        label: isSimplifyReportClosureEnabled ? 'Closed' : 'Paid',
        value: CCCExpenseState.PAID
      }
    ];
  }

  exportSelectionValidator(exportSettingsForm: FormGroup, isCloneSetting: boolean = false): ValidatorFn {
    return (control: AbstractControl): { [key: string]: object } | null => {
      let forbidden = true;
      if (exportSettingsForm) {
        if (typeof control.value === 'boolean') {
          if (control.value) {
            forbidden = false;
          } else {
            if (control.parent?.get('reimbursableExpense')?.value || control.parent?.get('creditCardExpense')?.value) {
              forbidden = false;
            }
          }
        } else if ((control.value === ExpenseState.PAID || control.value === ExpenseState.PAYMENT_PROCESSING) && (control.parent?.get('reimbursableExpense')?.value || control.parent?.get('creditCardExpense')?.value)) {
          forbidden = false;
        } else if (isCloneSetting && (control.parent?.get('reimbursableExpense')?.value || control.parent?.get('creditCardExpense')?.value)) {
          forbidden = false;
        }

        if (!forbidden) {
          control.parent?.get('reimbursableExpense')?.setErrors(null);
          control.parent?.get('creditCardExpense')?.setErrors(null);
          return null;
        }
      }

      return {
        forbiddenOption: {
          value: control.value
        }
      };
    };
  }

  createReimbursableExpenseWatcher(form: FormGroup, exportSettings: ExportSettingGet): void {
    form.controls.reimbursableExpense.valueChanges.subscribe((isReimbursableExpenseSelected) => {
      if (isReimbursableExpenseSelected) {
        form.controls.reimbursableExpenseState.setValidators(Validators.required);
        form.controls.reimbursableExportDate.setValidators(Validators.required);
        form.controls.reimbursableExportDate.patchValue(exportSettings.expense_group_settings?.reimbursable_export_date_type ? exportSettings.expense_group_settings?.reimbursable_export_date_type : ExportDateType.CURRENT_DATE);
      } else {
        form.controls.reimbursableExpenseState.clearValidators();
        form.controls.reimbursableExportDate.clearValidators();
        form.controls.reimbursableExpenseState.setValue(null);
        form.controls.reimbursableExportDate.setValue(null);
      }
    });
  }

  createCreditCardExpenseWatcher(form: FormGroup, exportSettings: ExportSettingGet): void {
    form.controls.creditCardExpense.valueChanges.subscribe((isCreditCardExpenseSelected) => {
      if (isCreditCardExpenseSelected) {
        form.controls.cccExpenseState.setValidators(Validators.required);
        form.controls.cccExpenseState.patchValue(exportSettings.expense_group_settings?.ccc_expense_state ? exportSettings.expense_group_settings?.ccc_expense_state : null);
      } else {
        form.controls.cccExpenseState.clearValidators();
        form.controls.cccExpenseState.setValue(null);
      }
    });
  }
}
