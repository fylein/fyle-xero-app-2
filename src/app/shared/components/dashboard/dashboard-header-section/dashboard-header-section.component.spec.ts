import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, getTestBed, TestBed } from '@angular/core/testing';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { WorkspaceService } from 'src/app/core/services/workspace/workspace.service';
import { environment } from 'src/environments/environment';

import { DashboardHeaderSectionComponent } from './dashboard-header-section.component';

describe('DashboardHeaderSectionComponent', () => {
  let component: DashboardHeaderSectionComponent;
  let fixture: ComponentFixture<DashboardHeaderSectionComponent>;
  let service: WorkspaceService;
  let injector: TestBed;
  let httpMock: HttpTestingController;
  const API_BASE_URL = environment.api_url;
  const workspace_id = 1;
  let dialogSpy: jasmine.Spy;
  const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of({}), close: null });
  dialogRefSpyObj.componentInstance = { body: '' }; // Attach componentInstance to the spy object...
  beforeEach(async () => {
    localStorage.setItem('workspaceId', environment.tests.workspaceId);
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientModule, MatSnackBarModule, BrowserAnimationsModule, HttpClientTestingModule],
      declarations: [ DashboardHeaderSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    injector = getTestBed();
    service = injector.inject(WorkspaceService);
    httpMock = injector.inject(HttpTestingController);
    fixture = TestBed.createComponent(DashboardHeaderSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    dialogSpy = spyOn(TestBed.get(MatSnackBar), 'open').and.returnValue(dialogRefSpyObj);

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('refreshXeroDimensions() function check', () => {
    expect(component.refreshXeroDimensions()).toBeUndefined();
    expect(dialogSpy).toHaveBeenCalled();

    const req = httpMock.expectOne({
      method: 'POST',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/xero/refresh_dimensions/`
    });
  req.flush({});
  });
});
