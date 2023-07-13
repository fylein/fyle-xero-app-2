import { TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { AutoMapEmployee, CorporateCreditCardExpensesObject, ExpenseState, CCCExpenseState, ExportDateType, ReimbursableExpensesObject } from '../enum/enum.model';
import { ExportSettingModel, ExportSettingPost } from "./export-setting.model";

describe('ExportSettingModel', () => {

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormGroup],
      declarations: [ ExportSettingModel ]
    })
    .compileComponents();
  });

  it('Should return ExportSettingModel[]', () => {
    const exportSettingsForm= new FormGroup({
      reimbursableExpenseState: new FormControl('PAID'),
      cccExpenseState: new FormControl('PAID'),
      reimbursableExpense: new FormControl(true),
      reimbursableExportType: new FormControl('PURCHASE BILL'),
      reimbursableExportDate: new FormControl(null),
      creditCardExpense: new FormControl(true),
      creditCardExportType: new FormControl('BANK TRANSACTION'),
      bankAccount: new FormControl({id: '1', name: 'Fyle'}),
      autoMapEmployees: new FormControl(AutoMapEmployee.EMAIL),
      searchOption: new FormControl([])
    });
    const exportSettingPayload: ExportSettingPost = {
      expense_group_settings: {
        reimbursable_expense_state: ExpenseState.PAID,
        reimbursable_export_date_type: ExportDateType.CURRENT_DATE,
        ccc_expense_state: CCCExpenseState.PAID,
        ccc_export_date_type: ExportDateType.SPENT_AT
      },
      workspace_general_settings: {
        reimbursable_expenses_object: ReimbursableExpensesObject.PURCHASE_BILL,
        corporate_credit_card_expenses_object: CorporateCreditCardExpensesObject.BANK_TRANSACTION,
        auto_map_employees: AutoMapEmployee.EMAIL
      },
      general_mappings: {
        bank_account: {id: '1', name: 'Fyle'}
      }
    };
    expect(ExportSettingModel.constructPayload(exportSettingsForm)).toEqual(exportSettingPayload);
  });
});
