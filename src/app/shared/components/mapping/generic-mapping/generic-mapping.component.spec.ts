import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, getTestBed, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { GenericMappingComponent } from './generic-mapping.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MappingSettingResponse } from 'src/app/core/models/db/mapping-setting.model';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';
import { MappingList, MappingStats } from 'src/app/core/models/db/mapping.model';
import { ActivatedRoute } from '@angular/router';
import { getMappingSettingResponse, getMappingsresponse, mappinglist, MappingPostpayload, mappingSetting, minimaMappingSetting, minimaMappingSetting1, response } from './generic-mapping.fixture';
import { of } from 'rxjs';
import { PaginatorPage } from 'src/app/core/models/enum/enum.model';
import { MappingService } from 'src/app/core/services/misc/mapping.service';
import { PaginatorService } from 'src/app/core/services/core/paginator.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('GenericMappingComponent', () => {
  let component: GenericMappingComponent;
  let fixture: ComponentFixture<GenericMappingComponent>;
  let injector: TestBed;
  let httpMock: HttpTestingController;
  let formBuilder: FormBuilder;
  let activatedRoute: ActivatedRoute;
  const API_BASE_URL = environment.api_url;
  const workspace_id = 1;
  let dialogSpy: jasmine.Spy;
  const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of({}), close: null });
  dialogRefSpyObj.componentInstance = { body: '' };
  const mappingState: MappingStats = {
    all_attributes_count: 5,
    unmapped_attributes_count: 4
  };
  beforeEach(async () => {
    const service1 = {
      getMappingStats: () => of(mappingState),
      getXeroDestinationAttributes: () => of([]),
      postMapping: () => of(MappingPostpayload),
      getMappings: () => of(getMappingsresponse),
      getMappingSettings: () => of(getMappingSettingResponse)
    };
    await TestBed.configureTestingModule({
      declarations: [GenericMappingComponent],
      imports: [NoopAnimationsModule, RouterTestingModule, FormsModule, ReactiveFormsModule, HttpClientModule, MatSnackBarModule, SharedModule, HttpClientTestingModule],
      providers: [FormBuilder, Validators, PaginatorService,
        { provide: MappingService, useValue: service1 }]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenericMappingComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);
    injector = getTestBed();
    httpMock = injector.inject(HttpTestingController);
    activatedRoute = TestBed.inject(ActivatedRoute);
    dialogSpy = spyOn(TestBed.get(MatSnackBar), 'open').and.returnValue(dialogRefSpyObj);
    component.fyleXeroMappingFormArray = mappinglist.map((mapping: MappingList) => {
      return formBuilder.group({
        searchOption: [''],
        source: [mapping.fyle.value],
        destination: [mapping.xero.value]
      });
    });
    const form = formBuilder.group({
      map: [''],
      fyleXeroMapping: formBuilder.array(component.fyleXeroMappingFormArray),
      filterOption: [['dh', 'fy']],
      sourceUpdated: [true],
      searchOption: [[' fyle ']]
    });
    component.form = form;
    activatedRoute.snapshot.params = { source_field: 'project'};
    fixture.detectChanges();
  });

  it('should create', () => {
    component.fyleXeroMappingFormArray = mappinglist.map((mapping: MappingList) => {
      return formBuilder.group({
        searchOption: [''],
        source: [mapping.fyle.value],
        destination: [mapping.xero.value]
      });
    });
    const form = formBuilder.group({
      map: [''],
      fyleXeroMapping: formBuilder.array(component.fyleXeroMappingFormArray),
      filterOption: [['dh', 'fy']],
      sourceUpdated: [true],
      searchOption: [[' fyle ']]
    });
    component.form = form;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('nqOninte function', () => {
    component.sourceType = 'project';
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('nqOninte with form function', () => {
    component.sourceType = 'project';
    activatedRoute.snapshot.params = { source_field: 'project'};
    const form = formBuilder.group({
      filterOption: [['dh', 'fy']],
      sourceUpdated: [true],
      searchOption: [[' fyle ']]
    });
    component.form = form;
    fixture.detectChanges();
    expect(component.ngOnInit()).toBeUndefined();
    fixture.detectChanges();
  });

  it('Save function check', () => {
    component.mappingSetting = minimaMappingSetting;
    fixture.detectChanges();
    component.save(mappinglist[0]);
    fixture.detectChanges();
    expect(dialogSpy).toHaveBeenCalled();
  });

  it('Save function check 2', () => {
    component.mappingSetting = minimaMappingSetting;
    component.mappingStats = mappingState;
    fixture.detectChanges();
    component.save(mappinglist[1]);
    fixture.detectChanges();
    expect(component.mappingStats.unmapped_attributes_count).toBeLessThanOrEqual(4);
    expect(mappinglist[1].state).toEqual('MAPPED');
  });
  it('getMapping function check', () => {
    const form =formBuilder.group({
      map: [''],
      fyleXeroMapping: formBuilder.array(component.fyleXeroMappingFormArray),
      searchOption: ['fyle'],
      filterOption: [['dh', 'fy']],
      sourceUpdated: [false]
    });
    component.PaginatorPage = PaginatorPage;
    component.form = form;
    const page = {
      limit: 10,
      offset: 3
    };
    component.mappingSetting = minimaMappingSetting;
    fixture.detectChanges();
    expect(component.getMappings(page)).toBeUndefined();
  });

  it('getMapping function check', () => {
    component.mappingSetting = minimaMappingSetting1;
    fixture.detectChanges();
    expect(component.getMappings()).toBeUndefined();
  });

  it('mappingCardUpdateHandler function check', () => {
    const form =formBuilder.group({
      map: [''],
      fyleXeroMapping: formBuilder.array(component.fyleXeroMappingFormArray),
      searchOption: ['fyle'],
      filterOption: [['dh', 'fy']],
      sourceUpdated: [false]
    });
    component.form = form;
    component.mappingSetting = minimaMappingSetting;
    component.page = 'Onboarding';
    fixture.detectChanges();
    component.mappingCardUpdateHandler(true);
    fixture.detectChanges();
    expect(component.totalCardActive).toBeTrue();
  });

  it('mappingCardUpdateHandler function check', () => {
    const form =formBuilder.group({
      map: [''],
      fyleXeroMapping: formBuilder.array(component.fyleXeroMappingFormArray),
      searchOption: ['fyle'],
      filterOption: [['dh', 'fy']],
      sourceUpdated: [false]
    });
    component.form = form;
    component.mappingSetting = minimaMappingSetting;
    component.page = 'Onboarding';
    fixture.detectChanges();
    component.mappingCardUpdateHandler(false);
    fixture.detectChanges();
    expect(component.totalCardActive).toBeFalse();
  });
  it('searchByText function check', () => {
    const ans = (component as any).searchByText(mappinglist[0], 'string');
    expect(ans).toBeTrue();
    const ans1 = (component as any).searchByText(mappinglist[0], 'fyle');
    expect(ans1).toBeFalse();
  });
  it('setupForm function check', () => {
    component.fyleXeroMappingFormArray = mappinglist.map((mapping: MappingList) => {
      return formBuilder.group({
        searchOption: [''],
        source: [mapping.fyle.value],
        destination: [mapping.xero.value]
      });
    });
    const form = formBuilder.group({
      map: [''],
      fyleXeroMapping: formBuilder.array(component.fyleXeroMappingFormArray),
      filterOption: [['dh', 'fy']],
      sourceUpdated: [true],
      searchOption: ['']
    });
    component.form = form;
    fixture.detectChanges();
    expect((component as any).setupForm([' dh '])).toBeUndefined();
    fixture.detectChanges();
    component.form.controls.searchOption.patchValue(' dh ');
    expect((component as any).setupForm([' dh '])).toBeUndefined();
    fixture.detectChanges();
    component.form.controls.searchOption.patchValue('');
    expect((component as any).setupForm([' dh '])).toBeUndefined();
  });
});
