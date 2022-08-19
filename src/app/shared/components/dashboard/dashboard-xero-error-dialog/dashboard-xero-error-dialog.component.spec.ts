import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { UserService } from 'src/app/core/services/misc/user.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { DashboardXeroErrorDialogComponent } from './dashboard-xero-error-dialog.component';
import { modelData, modelData1 } from './dashboard-xero-error-dialog.fixture';

describe('DashboardXeroErrorDialogComponent', () => {
  let component: DashboardXeroErrorDialogComponent;
  let fixture: ComponentFixture<DashboardXeroErrorDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardXeroErrorDialogComponent ],
      imports: [
        MatDialogModule,
        RouterTestingModule,
        SharedModule, HttpClientModule, HttpClientTestingModule
      ],
      providers: [
        UserService,
        {
          // I was expecting this will pass the desired value
          provide: MAT_DIALOG_DATA,
          useValue: modelData
        },
        {
          // I was expecting this will pass the desired value
          provide: MatDialogRef,
          useValue: {}
        }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    localStorage.setItem('user', JSON.stringify({org_id: 'dummy'}));
    fixture = TestBed.createComponent(DashboardXeroErrorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('setup function', fakeAsync(() => {
    component.ngOnInit();
    fixture.detectChanges();
    const popUpHeader = document.getElementsByTagName('h3')[0] as HTMLHeadElement;
    const popUpSubHeader = document.getElementsByTagName('h5')[0] as HTMLHeadElement;
    expect(popUpHeader.innerText).toBe(modelData.error_title);
    expect(popUpSubHeader.innerText).toBe(modelData.error_detail);
  }));

  it('setup function', fakeAsync(() => {
    component.data = modelData1;
    component.ngOnInit();
    fixture.detectChanges();
    const popUpHeader = document.getElementsByTagName('h3')[0] as HTMLHeadElement;
    const popUpSubHeader = document.getElementsByTagName('h5')[0] as HTMLHeadElement;
    expect(popUpHeader.innerText).toBe(modelData.error_title);
    expect(popUpSubHeader.innerText).toBe(modelData.error_detail);
  }));
});
