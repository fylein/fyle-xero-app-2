import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AdvancedSettingFormOption } from 'src/app/core/models/configuration/advanced-setting.model';
import { ExportSettingFormOption } from 'src/app/core/models/configuration/export-setting.model';
import { DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { ClickEvent, CorporateCreditCardExpensesObject, ProgressPhase, ReimbursableExpensesObject, SimpleSearchPage, SimpleSearchType } from 'src/app/core/models/enum/enum.model';
import { HelperService } from 'src/app/core/services/core/helper.service';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';
import { PreviewDialogComponent } from '../preview-dialog/preview-dialog.component';

@Component({
  selector: 'app-configuration-select-field',
  templateUrl: './configuration-select-field.component.html',
  styleUrls: ['./configuration-select-field.component.scss']
})
export class ConfigurationSelectFieldComponent implements OnInit {

  @Input() form: FormGroup;

  @Input() options: ExportSettingFormOption[] | AdvancedSettingFormOption[] | any[];

  @Input() xeroAttributes: DestinationAttribute[];

  @Input() iconPath: string;

  @Input() label: string;

  @Input() subLabel: string;

  @Input() placeholder: string;

  @Input() formControllerName: string;

  @Input() isFieldMandatory: boolean;

  @Input() mandatoryErrorListName: string;

  @Input() customErrorMessage: string;

  @Input() phase: ProgressPhase;

  @Input() exportType: ReimbursableExpensesObject | CorporateCreditCardExpensesObject;

  SimpleSearchPage = SimpleSearchPage;

  SimpleSearchType = SimpleSearchType;

  constructor(
    public helperService: HelperService
  ) { }

  ngOnInit(): void {
  }

}
