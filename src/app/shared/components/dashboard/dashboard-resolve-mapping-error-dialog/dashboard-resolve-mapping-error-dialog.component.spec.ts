import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, getTestBed, TestBed } from '@angular/core/testing';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { DashboardResolveMappingErrorDialogComponent } from './dashboard-resolve-mapping-error-dialog.component';
import { MappingService } from 'src/app/core/services/misc/mapping.service';
import { environment } from 'src/environments/environment';
import { destinationAttributes, expenseAttribute, mappinglist, model, model2, response } from './dashboard-resolve-mapping.fixture';
import { of } from 'rxjs';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MappingPostpayload } from '../../mapping/generic-mapping/generic-mapping.fixture';
import { Router } from '@angular/router';
// Import { MappingList } from 'src/app/core/models/db/mapping.model';

describe('DashboardResolveMappingErrorDialogComponent', () => {
  let component: DashboardResolveMappingErrorDialogComponent;
  let fixture: ComponentFixture<DashboardResolveMappingErrorDialogComponent>;
  let service: MappingService;
  let injector: TestBed;
  let httpMock: HttpTestingController;
  let formBuilder: FormBuilder;
  const API_BASE_URL = environment.api_url;
  const workspace_id = 1;
  let dialogSpy: jasmine.Spy;
  const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of({}), close: null });
  dialogRefSpyObj.componentInstance = { body: '' }; // Attach componentInstance to the spy object...
  const routerSpy = { navigate: jasmine.createSpy('navigate'), url: '/path' };
  let router: Router;

  beforeEach(async () => {
    const service1 = {
      getXeroDestinationAttributes: () => of([]),
      postMapping: () => of(MappingPostpayload)
    };
    await TestBed.configureTestingModule({
      imports: [MatDialogModule, SharedModule, HttpClientTestingModule, MatSnackBarModule, NoopAnimationsModule],
      providers: [FormBuilder, {
        // I was expecting this will pass the desired value
        provide: MAT_DIALOG_DATA,
        useValue: model
      },
      {
        // I was expecting this will pass the desired value
        provide: MatDialogRef,
        useValue: {}
      },
      { provide: MappingService, useValue: service1 },
      { provide: Router, useValue: routerSpy },
    ],
      declarations: [ DashboardResolveMappingErrorDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    injector = getTestBed();
    service = injector.inject(MappingService);
    httpMock = injector.inject(HttpTestingController);
    fixture = TestBed.createComponent(DashboardResolveMappingErrorDialogComponent);
    formBuilder = TestBed.inject(FormBuilder);
    component = fixture.componentInstance;
    dialogSpy = spyOn(TestBed.get(MatSnackBar), 'open').and.returnValue(dialogRefSpyObj);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('function check', () => {
    const form = formBuilder.group({
      xeroTenant: '25d7b4cd-ed1c-4c5c-80e5-c058b87db8a1',
      source: 'ss'
      });
    expect((component as any).showSuccessMessage()).toBeUndefined();
    expect(component.saveMapping(mappinglist[0], destinationAttributes, form));
  });
});


