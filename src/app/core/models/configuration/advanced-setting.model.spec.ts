import { TestBed } from '@angular/core/testing';
import { FormControl, FormGroup} from '@angular/forms';
import { AdvancedSettingModel, AdvancedSettingPost} from "./advanced-setting.model";

describe('AdvancedSettingModel', () => {

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormGroup],
      declarations: [ AdvancedSettingModel ]
    })
    .compileComponents();
  });

  it('Should return AdvancedSettingModel[]', () => {
    const advancedSettingsForm= new FormGroup({
      paymentSync: new FormControl(true),
      billPaymentAccount: new FormControl({id: '1', name: 'Fyle'}),
      changeAccountingPeriod: new FormControl(true),
      singleCreditLineJE: new FormControl(true),
      autoCreateVendors: new FormControl(true),
      exportSchedule: new FormControl(true),
      exportScheduleFrequency: new FormControl(10),
      importCustomers: new FormControl(true),
      searchOption: new FormControl([])
    });

    const advancedSettingPayload:AdvancedSettingPost = {
      workspace_general_settings: {
        sync_fyle_to_xero_payments: false,
        sync_xero_to_fyle_payments: false,
        auto_create_destination_entity: true,
        change_accounting_period: true
      },
      general_mappings: {
        bill_payment_account: {id: '1', name: 'Fyle'}
      },
      workspace_schedules: {
        enabled: true,
        interval_hours: 10,
        start_datetime: new Date()
      }
    };
    expect(AdvancedSettingModel.constructPayload(advancedSettingsForm)).toEqual(advancedSettingPayload);
    });
  });
