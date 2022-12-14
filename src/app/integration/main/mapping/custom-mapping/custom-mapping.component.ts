import { Component, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { forkJoin } from 'rxjs';
import { MappingSetting, MappingSettingList } from 'src/app/core/models/db/mapping-setting.model';
import { MappingStats } from 'src/app/core/models/db/mapping.model';
import { DeleteEvent, FyleField, MappingDestinationField, MappingSourceField, ProgressPhase, UpdateEvent, ZeroStatePage } from 'src/app/core/models/enum/enum.model';
import { ConfirmationDialog } from 'src/app/core/models/misc/confirmation-dialog.model';
import { ExpenseField } from 'src/app/core/models/misc/expense-field.model';
import { HelperService } from 'src/app/core/services/core/helper.service';
import { TrackingService } from 'src/app/core/services/integration/tracking.service';
import { MappingService } from 'src/app/core/services/misc/mapping.service';
import { ConfirmationDialogComponent } from 'src/app/shared/components/core/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-custom-mapping',
  templateUrl: './custom-mapping.component.html',
  styleUrls: ['./custom-mapping.component.scss']
})
export class CustomMappingComponent implements OnInit {

  isLoading: boolean = true;

  showAddButton: boolean;

  mappingStats: Partial<MappingStats> = {
    all_attributes_count: 0
  };

  showMappingList: boolean = false;

  ZeroStatePage = ZeroStatePage;

  mappingRows: MappingSettingList[];

  xeroFields: ExpenseField[];

  fyleFields: ExpenseField[];

  mappingSettingForm: FormGroup;

  mappingSettings: MappingSetting[];

  constructor(
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private helperService: HelperService,
    private mappingService: MappingService,
    private snackBar: MatSnackBar,
    private trackingService: TrackingService
  ) { }

  createMappingRow(): void {
    this.mappingRows = this.mappingRows.concat([{ xeroField: '', fyleField: '', index: this.mappingRows.length, existingMapping: false, isDeleteButtonAllowed: false }]);

    const row = this.formBuilder.group({
      xeroField: ['', [Validators.required, RxwebValidators.unique()]],
      fyleField: ['', [Validators.required, RxwebValidators.unique()]],
      index: [this.mappingRows.length],
      existingMapping: [false]
    });
    this.mappingSetting.push(row);
    this.showMappingList = true;
  }

  updateMappingRow(index: number, xeroField: MappingDestinationField | '' | string, fyleField: MappingSourceField | string | '' = ''): void {
    if (xeroField) {
      this.mappingRows[index].xeroField = xeroField;
    } else if (fyleField) {
      this.mappingRows[index].fyleField = fyleField;
    }
  }

  clearMappingRow(index: number): void {
    this.mappingSetting.removeAt(index);
    this.mappingRows.splice(index, 1);

    if (!this.mappingRows.length) {
      this.showMappingList = false;
    }
  }

  private constructPayloadAndSave(mappingRow: MappingSettingList): void {
    this.isLoading = true;
    const mappingSettingPayload = [{
      source_field: mappingRow.fyleField,
      destination_field: mappingRow.xeroField,
      import_to_fyle: false,
      is_custom: mappingRow.fyleField === MappingSourceField.COST_CENTER || mappingRow.fyleField === MappingSourceField.PROJECT ? false : true,
      source_placeholder: null
    }];
    this.mappingService.postMappingSettings(mappingSettingPayload).subscribe((response: MappingSetting[]) => {
      this.trackingService.onUpdateEvent(
        UpdateEvent.CUSTOM_MAPPING,
        {
          phase: ProgressPhase.POST_ONBOARDING,
          newState: { source_field: mappingSettingPayload[0].source_field, destination_field: mappingSettingPayload[0].destination_field }
        }
      );
      this.mappingService.emitWalkThroughTooltip();
      this.mappingService.refreshMappingPages();
      this.snackBar.open('Custom Mapping Created Successfully');
      this.mappingSettings.push(response[0]);
      this.setupSettingsAndSetupPage();
    });
  }

  deleteMappingSetting(index: number): void {
    const mappingRow: MappingSettingList = this.mappingSettingForm.value.mappingSetting[index];
    const xeroField: string = this.helperService.getSpaceCasedTitleCase(mappingRow.xeroField);
    const fyleField: string = this.helperService.getSpaceCasedTitleCase(mappingRow.fyleField);

    const data: ConfirmationDialog = {
      title: 'Delete Custom Mapping',
      contents: `<li>You are deleting the custom mapping of <b>${xeroField}</b> in Xero to ${fyleField} in Fyle.</li>
        <li>This will delete all the mappings setup in the <b>${fyleField}</b> Mapping section.</li>
        <br>Would you like to continue?`,
      primaryCtaText: 'Save and Continue'
    };

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '551px',
      data: data
    });

    dialogRef.afterClosed().subscribe((ctaClicked) => {
      if (ctaClicked && mappingRow.id) {
        this.isLoading = true;
        this.mappingService.deleteMappingSetting(mappingRow.id).subscribe(() => {
          // Hide mapping table if there are no more mappings
          if (this.mappingSettingForm.value.mappingSetting.length === 1) {
            this.showMappingList = false;
          }

          this.trackingService.onDeleteEvent(
            DeleteEvent.CUSTOM_MAPPING, {
            source_field: mappingRow.fyleField,
            destination_field: mappingRow.xeroField
          }
          );

          this.mappingService.refreshMappingPages();
          this.snackBar.open('Custom Mapping Deleted Successfully');
          this.mappingSettings = this.mappingSettings.filter((mapping) => mapping.id !== mappingRow.id);
          this.fyleFields.push({
            attribute_type: mappingRow.fyleField,
            display_name: this.helperService.getSpaceCasedTitleCase(mappingRow.fyleField)
          });
          this.setupSettingsAndSetupPage();
        });
      }
    });
  }

  saveMappingSetting(index: number): void {
    if (this.mappingSettingForm.valid) {
      const mappingRow: MappingSettingList = this.mappingSettingForm.value.mappingSetting[index];
      const xeroField: string = this.helperService.getSpaceCasedTitleCase(mappingRow.xeroField);
      const fyleField: string = this.helperService.getSpaceCasedTitleCase(mappingRow.fyleField);

      const data: ConfirmationDialog = {
        title: 'Create Custom Mapping',
        contents: `You are creating a custom mapping between <b>${xeroField}</b> in Xero and <b>${fyleField}</b> in Fyle.
          This will open a separate mapping Page for ${fyleField} under the Mappings section of the integration.<br><br>
          <li>In the ${fyleField} Mappings section, you can map the individual Fyle ${fyleField} to their corresponding ${xeroField} values.</li>
          <li>Also, the Mappings cannot be edited once set up. However, you can delete the specific dimensions mapped and re-create if required.</li>
          <br><br>Would you like to continue?`,
        primaryCtaText: 'Save and Continue'
      };

      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '551px',
        data: data
      });

      dialogRef.afterClosed().subscribe((ctaClicked) => {
        if (ctaClicked) {
          this.constructPayloadAndSave(mappingRow);
        }
      });
    }
  }

  showDeleteButton(mappingRow: MappingSettingList, allowed: boolean): void {
    mappingRow.isDeleteButtonAllowed = allowed;
  }

  get isExistingRowMapped(): boolean {
    return this.mappingRows.filter(row => !row.existingMapping).length === 0;
  }

  get mappingSetting() {
    return this.mappingSettingForm.get('mappingSetting') as FormArray;
  }

  private setupPage(): void {
    // Remove already imported fyle fields from the options
    this.mappingSettings = this.mappingSettings.filter(field => !field.import_to_fyle && field.source_field !== FyleField.CORPORATE_CARD);
    const mappedRows = this.mappingSettings.map((mappingSetting, index) => {
      const mappedRow: MappingSettingList = {
        id: mappingSetting.id,
        xeroField: mappingSetting.destination_field,
        fyleField: mappingSetting.source_field,
        index: index,
        existingMapping: true,
        isDeleteButtonAllowed: false
      };
      return mappedRow;
    });

    this.mappingStats.all_attributes_count = mappedRows.length;

    const mappedRowsFormArray = mappedRows.map((mappingSetting, index) => {
      return this.formBuilder.group({
        id: mappingSetting.id,
        xeroField: [mappingSetting.xeroField, [Validators.required, RxwebValidators.unique()]],
        fyleField: [mappingSetting.fyleField, [Validators.required, RxwebValidators.unique()]],
        index: [index],
        existingMapping: [true]
      });
    });

    this.mappingSettingForm = this.formBuilder.group({
      mappingSetting: this.formBuilder.array(mappedRowsFormArray)
    });

    this.mappingRows = mappedRows;

    if (this.mappingRows.length) {
      this.showMappingList = true;
    }

    this.isLoading = false;
  }

  private setupSettingsAndSetupPage(): void {
    forkJoin([
      this.mappingService.getMappingSettings(),
      this.mappingService.getFyleExpenseFields(),
      this.mappingService.getXeroField()
    ]).subscribe(responses => {
      this.mappingSettings = responses[0].results.filter((mappingSetting: MappingSetting) => {
        return (mappingSetting.destination_field !== MappingDestinationField.ACCOUNT && mappingSetting.destination_field !== MappingDestinationField.BANK_ACCOUNT && mappingSetting.destination_field !== MappingDestinationField.CONTACT && mappingSetting.destination_field !== MappingDestinationField.TAX_CODE);
      });
      this.fyleFields = responses[1].filter(field => {
        return !this.mappingSettings.some(mapping => mapping.source_field === field.attribute_type);
      });
      this.xeroFields = responses[2].filter((xeroField: ExpenseField) => {
        return !this.mappingSettings.some(mapping => mapping.destination_field === xeroField.attribute_type);
      });
      this.setupPage();
    });
  }

  ngOnInit(): void {
    this.setupSettingsAndSetupPage();
  }

}
