import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomMappingComponent } from './custom-mapping.component';
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { FormArray, FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SharedModule } from 'src/app/shared/shared.module';
import { MappingService } from 'src/app/core/services/misc/mapping.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { postMappingSettingResponse } from 'src/app/core/services/misc/mapping.service.fixture';
import { fyleExpenseFields, mappedRowsFormArray, mappingRow, mappingRows, mappingRows1, mappingRows2, mappingSettingResponse, xeroField } from './custom-mapping.fixture';
import { FyleField, MappingDestinationField } from 'src/app/core/models/enum/enum.model';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RxwebValidators } from '@rxweb/reactive-form-validators';

describe('CustomMappingComponent', () => {
  let component: CustomMappingComponent;
  let fixture: ComponentFixture<CustomMappingComponent>;
  const routerSpy = { navigate: jasmine.createSpy('navigate'), url: '/path' };
  let formbuilder: FormBuilder;
  let dialogSpy: jasmine.Spy;
  const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of({
    id: "ww"
  }), close: null });
  dialogRefSpyObj.componentInstance = { body: '' };

  beforeEach(async () => {
    const service1 = {
      postMappingSettings: () => of(postMappingSettingResponse),
      emitWalkThroughTooltip: () => undefined,
      refreshMappingPages: () => undefined,
      deleteMappingSetting: () => of({}),
      getMappingSettings: () => of(mappingSettingResponse),
      getFyleExpenseFields: () => of(fyleExpenseFields),
      getXeroField: () => of(xeroField)
    };

    await TestBed.configureTestingModule({
      imports: [ MatDialogModule, NoopAnimationsModule, RouterTestingModule, HttpClientModule, FormsModule, ReactiveFormsModule, MatDialogModule, MatSnackBarModule, SharedModule],
      declarations: [ CustomMappingComponent ],
      providers: [ FormBuilder,
        { provide: Router, useValue: routerSpy },
        { provide: MappingService, useValue: service1 }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomMappingComponent);
    component = fixture.componentInstance;
    formbuilder = TestBed.inject(FormBuilder);
    dialogSpy = spyOn(TestBed.get(MatDialog), 'open').and.returnValue(dialogRefSpyObj);
    const row = formbuilder.group({
      xeroField: [{
        "attribute_type": "BANK_ACCOUN",
        "display_name": "Bank Account"
    }],
      fyleField: [{
        "attribute_type": "BANK_ACCOUN",
        "display_name": "Bank Account"
    }],
      index: [0],
      existingMapping: [false]
    });
    const mappedRowsFormArrays = mappingRows.map((mappingSetting, index) => {
      return formbuilder.group({
        id: mappingSetting.id,
        xeroField: [mappingSetting.xeroField, [Validators.required, RxwebValidators.unique()]],
        fyleField: [mappingSetting.fyleField, [Validators.required, RxwebValidators.unique()]],
        index: [index],
        existingMapping: [true]
      });
    });
    component.mappingSettingForm = formbuilder.group({
      mappingSetting: formbuilder.array(mappedRowsFormArrays)
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit function check', () => {
    expect(component.ngOnInit()).toBeUndefined();
  });

  it('should return mappingSetting as a Form Array', () => {
    const response = component.mappingSettingForm.get('mappingSetting') as FormArray;
    expect(component.mappingSetting).toEqual(response);
  });

  it('should set mappingRow.isDeleteButtonAllowed as false', () => {
    component.showDeleteButton(mappingRow, false);
    fixture.detectChanges();
    expect(mappingRow.isDeleteButtonAllowed).toBeFalse();
  });

  it('should set mappingRow.isDeleteButtonAllowed as true', () => {
    mappingRow.isDeleteButtonAllowed = false;
    component.showDeleteButton(mappingRow, true);
    fixture.detectChanges();
    expect(mappingRow.isDeleteButtonAllowed).toBeTrue();
  });

  it('should delete mapping setting', () => {
    const mappedRowsFormArrays = mappingRows.map((mappingSetting, index) => {
      return formbuilder.group({
        id: mappingSetting.id,
        xeroField: [mappingSetting.xeroField, [Validators.required, RxwebValidators.unique()]],
        fyleField: [mappingSetting.fyleField, [Validators.required, RxwebValidators.unique()]],
        index: [index],
        existingMapping: [true]
      });
    });
    component.mappingSettingForm = formbuilder.group({
      mappingSetting: formbuilder.array(mappedRowsFormArrays)
    });
    fixture.detectChanges();
    expect(component.deleteMappingSetting(0)).toBeUndefined();
  });

  it('should clear mapping row', () => {
    const mappedRowsFormArrays = mappingRows.map((mappingSetting, index) => {
      return formbuilder.group({
        id: mappingSetting.id,
        xeroField: [mappingSetting.xeroField, [Validators.required, RxwebValidators.unique()]],
        fyleField: [mappingSetting.fyleField, [Validators.required, RxwebValidators.unique()]],
        index: [index],
        existingMapping: [true]
      });
    });
    component.mappingSettingForm = formbuilder.group({
      mappingSetting: formbuilder.array(mappedRowsFormArrays)
    });
    fixture.detectChanges();
    const previousLength = component.mappingSettingForm.get('mappingSetting')?.value.length;
    expect(component.clearMappingRow(0)).toBeUndefined();
    expect(component.mappingSettingForm.get('mappingSetting')?.value.length).toEqual(previousLength - 1);
  });

  it('should save mapping setting', () => {
    const mappedRowsFormArrays = mappingRows.map((mappingSetting, index) => {
      return formbuilder.group({
        id: mappingSetting.id,
        xeroField: [mappingSetting.xeroField, [Validators.required, RxwebValidators.unique()]],
        fyleField: [mappingSetting.fyleField, [Validators.required, RxwebValidators.unique()]],
        index: [index],
        existingMapping: [true]
      });
    });
    component.mappingSettingForm = formbuilder.group({
      mappingSetting: formbuilder.array(mappedRowsFormArrays)
    });
    fixture.detectChanges();
    expect(component.saveMappingSetting(0)).toBeUndefined();
  });

  it('should save mapping setting', () => {
    const mappedRowsFormArrays = mappingRows1.map((mappingSetting, index) => {
      return formbuilder.group({
        id: mappingSetting.id,
        xeroField: [mappingSetting.xeroField, [Validators.required, RxwebValidators.unique()]],
        fyleField: [mappingSetting.fyleField, [Validators.required, RxwebValidators.unique()]],
        index: [index],
        existingMapping: [true]
      });
    });
    component.mappingSettingForm = formbuilder.group({
      mappingSetting: formbuilder.array(mappedRowsFormArrays)
    });
    fixture.detectChanges();
    expect(component.saveMappingSetting(0)).toBeUndefined();
  });

  it('should save mapping setting', () => {
    const mappedRowsFormArrays = mappingRows2.map((mappingSetting, index) => {
      return formbuilder.group({
        id: mappingSetting.id,
        xeroField: [mappingSetting.xeroField, [Validators.required, RxwebValidators.unique()]],
        fyleField: [mappingSetting.fyleField, [Validators.required, RxwebValidators.unique()]],
        index: [index],
        existingMapping: [true]
      });
    });
    component.mappingSettingForm = formbuilder.group({
      mappingSetting: formbuilder.array(mappedRowsFormArrays)
    });
    fixture.detectChanges();
    expect(component.saveMappingSetting(0)).toBeUndefined();
  });

  it('should update mapping row', () => {
    const mappedRowsFormArrays = mappingRows.map((mappingSetting, index) => {
      return formbuilder.group({
        id: mappingSetting.id,
        xeroField: [mappingSetting.xeroField, [Validators.required, RxwebValidators.unique()]],
        fyleField: [mappingSetting.fyleField, [Validators.required, RxwebValidators.unique()]],
        index: [index],
        existingMapping: [true]
      });
    });
    component.mappingSettingForm = formbuilder.group({
      mappingSetting: formbuilder.array(mappedRowsFormArrays)
    });
    component.mappingRows = mappingRows;
    fixture.detectChanges();
    expect(component.updateMappingRow(0, MappingDestinationField.ACCOUNT)).toBeUndefined();
    expect(component.mappingRows[0].xeroField).toBe(MappingDestinationField.ACCOUNT);

    expect(component.updateMappingRow(0, '', FyleField.COST_CENTER)).toBeUndefined();
    expect(component.mappingRows[0].fyleField).toBe(FyleField.COST_CENTER);
  });

  it('should create mapping row', () => {
    component.showMappingList = false;
    fixture.detectChanges();
    expect(component.createMappingRow()).toBeUndefined();
    expect(component.showMappingList).toBeTrue();
  });
});
