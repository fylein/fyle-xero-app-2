import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { EmployeeMappingModel } from 'src/app/core/models/db/employee-mapping.model';
import { Error } from 'src/app/core/models/db/error.model';
import { MinimalMappingSetting } from 'src/app/core/models/db/mapping-setting.model';
import { MappingList, MappingModel, ResolveMappingError } from 'src/app/core/models/db/mapping.model';
import { EmployeeFieldMapping, MappingState, SimpleSearchPage, SimpleSearchType } from 'src/app/core/models/enum/enum.model';
import { HelperService } from 'src/app/core/services/core/helper.service';
import { MappingService } from 'src/app/core/services/misc/mapping.service';

@Component({
  selector: 'app-dashboard-resolve-mapping-error-dialog',
  templateUrl: './dashboard-resolve-mapping-error-dialog.component.html',
  styleUrls: ['./dashboard-resolve-mapping-error-dialog.component.scss']
})
export class DashboardResolveMappingErrorDialogComponent implements OnInit {

  isLoading: boolean = true;

  mappings: MatTableDataSource<MappingList> = new MatTableDataSource<MappingList>([]);

  mappingForm: FormGroup[];

  xeroData: DestinationAttribute[];

  displayedColumns: string[] = ['fyle', 'xero'];

  form: FormGroup;

  fyleXeroMappingFormArray: FormGroup[];

  SimpleSearchPage = SimpleSearchPage;

  SimpleSearchType = SimpleSearchType;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ResolveMappingError,
    public dialogRef: MatDialogRef<DashboardResolveMappingErrorDialogComponent>,
    private formBuilder: FormBuilder,
    public helperService: HelperService,
    private mappingService: MappingService,
    private snackBar: MatSnackBar
  ) { }

  private showSuccessMessage(): void {
    this.snackBar.open('Changes saved', '', {
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      panelClass: 'dashboard-snackbar'
    });
  }

  private postMapping(selectedRow: MappingList): void {
    if (this.data.destinationType === EmployeeFieldMapping.EMPLOYEE || this.data.destinationType === EmployeeFieldMapping.VENDOR) {
      const employeeMappingPayload = EmployeeMappingModel.constructPayload(this.data.destinationType, selectedRow, this.data.workspaceId);
      this.mappingService.postEmployeeMapping(employeeMappingPayload).subscribe(() => this.showSuccessMessage());
    } else {
      const mappingSetting: MinimalMappingSetting = {
        source_field: this.data.sourceType,
        destination_field: this.data.destinationType
      };
      const mappingPayload = MappingModel.constructPayload(mappingSetting, selectedRow);
      this.mappingService.postMapping(mappingPayload).subscribe(() => this.showSuccessMessage());
    }
  }

  saveMapping(selectedRow: MappingList, selectedOption: DestinationAttribute, searchForm: FormGroup): void {
    searchForm.patchValue({
      destination: selectedOption.value,
      searchOption: '',
      source: searchForm.value.source
    });

    if (this.data.sourceType.toUpperCase() === EmployeeFieldMapping.EMPLOYEE) {
      selectedRow.xero.id = selectedOption.id;
    } else {
      selectedRow.xero.id = selectedOption.destination_id;
    }
    selectedRow.xero.value = selectedOption.value;


    this.postMapping(selectedRow);
  }

  private setupFyleXeroMappingFormArray(mappings: MappingList[]): void {
    this.fyleXeroMappingFormArray = mappings.map((mapping: MappingList) => {
      return this.formBuilder.group({
        searchOption: [''],
        source: [mapping.fyle.value],
        destination: [mapping.xero.value]
      });
    });
  }

  private setupForm(): void {
    this.form = this.formBuilder.group({
      map: [''],
      fyleXeroMapping: this.formBuilder.array(this.fyleXeroMappingFormArray)
    });

    const mappingForm = this.form.controls.fyleXeroMapping as FormArray;
    this.mappingForm = mappingForm.controls as FormGroup[];
  }

  private setupPage(): void {
    this.mappingService.getXeroDestinationAttributes(this.data.destinationType).subscribe((xeroData: DestinationAttribute[]) => {
      this.xeroData = xeroData;

      const mappings: MappingList[] = [];

      this.data.fyleAttributes.forEach((error: Error, index: number) => {
        mappings.push({
          fyle: {
            id: error.expense_attribute.id,
            value: error.expense_attribute.value
          },
          xero: {
            id: '',
            value: ''
          },
          state: MappingState.MAPPED,
          autoMapped: error.expense_attribute.auto_mapped,
          index: index
        });
      });

      this.mappings = new MatTableDataSource(mappings);
      this.setupFyleXeroMappingFormArray(mappings);

      this.setupForm();
      this.isLoading = false;
    });
  }

  ngOnInit(): void {
    this.setupPage();
  }

}
