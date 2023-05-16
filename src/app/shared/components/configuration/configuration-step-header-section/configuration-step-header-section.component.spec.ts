import { ComponentFixture, getTestBed, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { ConfigurationStepHeaderSectionComponent } from './configuration-step-header-section.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';
import { WorkspaceService } from 'src/app/core/services/workspace/workspace.service';
import { MatDialogModule } from '@angular/material/dialog';

describe('ConfigurationStepHeaderSectionComponent', () => {
  let component: ConfigurationStepHeaderSectionComponent;
  let fixture: ComponentFixture<ConfigurationStepHeaderSectionComponent>;
  let service: WorkspaceService;
  let injector: TestBed;
  let httpMock: HttpTestingController;
  const API_BASE_URL = environment.api_url;
  const workspace_id = 1;
  let router: Router;
  let dialogSpy: jasmine.Spy;
  let service1: any;
  const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of({}), close: null });
  dialogRefSpyObj.componentInstance = { body: '' }; // Attach componentInstance to the spy object...

  beforeEach(async () => {
    service1 = {
      refreshXeroDimensions: () => of({})
    };
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientModule, MatSnackBarModule, BrowserAnimationsModule, HttpClientTestingModule, MatDialogModule],
      declarations: [ ConfigurationStepHeaderSectionComponent],
      providers: [ {
        provide: WorkspaceService,
        useValue: service1
      }, {
        provide: Router,
        useValue: {
           url: '/path'
        },
     }
    ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    injector = getTestBed();
    service = injector.inject(WorkspaceService);
    httpMock = injector.inject(HttpTestingController);
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(ConfigurationStepHeaderSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    dialogSpy = spyOn(TestBed.get(MatSnackBar), 'open').and.returnValue(dialogRefSpyObj);

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('refreshXeroDimensions() function check', () => {
    spyOn(service, 'refreshXeroDimensions').and.callThrough();
    fixture.detectChanges();
    expect(component.refreshXeroDimensions()).toBeUndefined();
    expect(dialogSpy).toHaveBeenCalled();
    expect(service.refreshXeroDimensions).toHaveBeenCalled();
  });

  it('setupContent function with router url as realmid check', () => {
    // @ts-ignore: force this private property value for testing.
    router.url = '/path/to/code';
    component.ngOnInit();
    expect(component.headerText).toEqual('Connect to Xero Tenant');
    expect(component.contentText).toEqual('Connect to the Xero Tenant from which you would like to import and export data. The Fyle org and Xero Tenant cannot be changed once the configuration steps are complete.');
  });

  it('setupContent function with router url as export_settings check', () => {
    // @ts-ignore: force this private property value for testing.
    router.url = '/path/to/export_settings';
    component.ngOnInit();
    expect(component.headerText).toEqual('Export Settings');
    expect(component.contentText).toEqual('In this section, you will configure how and when expenses from Fyle can be exported to Xero.');
  });

  it('setupContent function with router url as import_settings check', () => {
    // @ts-ignore: force this private property value for testing.
    router.url = '/path/to/import_settings';
    component.ngOnInit();
    expect(component.headerText).toEqual('Import Settings');
    expect(component.contentText).toEqual('You can Enable all the data that you wish to import from Xero. All the imported data from Xero would be available in Fyle under Admin Setting > Organization.');
  });

  it('setupContent function with router url as advanced_settings check', () => {
    // @ts-ignore: force this private property value for testing.
    router.url = '/path/to/advanced_settings';
    component.ngOnInit();
    expect(component.headerText).toEqual('Advanced Settings');
    expect(component.isStepOptional).toBeTrue();
    expect(component.contentText).toEqual('This section contains settings to automate and customize your expense export.');
  });
});
