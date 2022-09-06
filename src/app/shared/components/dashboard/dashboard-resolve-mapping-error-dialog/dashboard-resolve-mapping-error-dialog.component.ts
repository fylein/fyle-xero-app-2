import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { DestinationAttribute } from 'src/app/core/models/db/destination-attribute.model';
import { Error } from 'src/app/core/models/db/error.model';
// Import { MappingList, MappingModel, ResolveMappingError } from 'src/app/core/models/db/mapping.model';
import { MappingState, SimpleSearchPage, SimpleSearchType } from 'src/app/core/models/enum/enum.model';
import { HelperService } from 'src/app/core/services/core/helper.service';
import { MappingService } from 'src/app/core/services/misc/mapping.service';

@Component({
  selector: 'app-dashboard-resolve-mapping-error-dialog',
  templateUrl: './dashboard-resolve-mapping-error-dialog.component.html',
  styleUrls: ['./dashboard-resolve-mapping-error-dialog.component.scss']
})
export class DashboardResolveMappingErrorDialogComponent implements OnInit {

  isLoading: boolean = true;

  mappings: MatTableDataSource<any> = new MatTableDataSource<any>([]);

  mappingForm: FormGroup[];

  xeroData: DestinationAttribute[];

  displayedColumns: string[] = ['fyle', 'xero'];

  form: FormGroup;

  fyleXeroMappingFormArray: FormGroup[];

  SimpleSearchPage = SimpleSearchPage;

  SimpleSearchType = SimpleSearchType;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
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

  // Private postMapping(selectedRow: MappingList): void {
  //   If (this.data.destinationType === EmployeeFieldMapping.EMPLOYEE || this.data.destinationType === EmployeeFieldMapping.VENDOR) {
  //     Const employeeMappingPayload = EmployeeMappingModel.constructPayload(this.data.destinationType, selectedRow, this.data.workspaceId);
  //     This.mappingService.postEmployeeMapping(employeeMappingPayload).subscribe(() => this.showSuccessMessage());
  //   } else {
  //     Const mappingSetting: MinimalMappingSetting = {
  //       Source_field: this.data.sourceType,
  //       Destination_field: this.data.destinationType
  //     };
  //     Const mappingPayload = MappingModel.constructPayload(mappingSetting, selectedRow);
  //     This.mappingService.postMapping(mappingPayload).subscribe(() => this.showSuccessMessage());
  //   }
  // }

  saveMapping(selectedRow: any, selectedOption: DestinationAttribute, searchForm: FormGroup): void {
    searchForm.patchValue({
      destination: selectedOption.value,
      searchOption: '',
      source: searchForm.value.source
    });

    // If (this.data.sourceType.toUpperCase() === EmployeeFieldMapping.EMPLOYEE) {
    //   SelectedRow.xero.id = selectedOption.id;
    // } else {
    //   SelectedRow.xero.id = selectedOption.destination_id;
    // }
    // SelectedRow.xero.value = selectedOption.value;


    // This.postMapping(selectedRow);
  }

  private setupFyleXeroMappingFormArray(mappings: any[]): void {
    this.fyleXeroMappingFormArray = mappings.map((mapping: any) => {
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

      const mappings: any[] = [];

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
