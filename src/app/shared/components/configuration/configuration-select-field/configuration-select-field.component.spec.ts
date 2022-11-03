import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchPipe } from '../../../pipes/search.pipe';
import { ConfigurationSelectFieldComponent } from './configuration-select-field.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('ConfigurationSelectFieldComponent', () => {
  let component: ConfigurationSelectFieldComponent;
  let fixture: ComponentFixture<ConfigurationSelectFieldComponent>;
  let formBuilder: FormBuilder;
  let dialogSpy: jasmine.Spy;
  const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of({}), close: null });
  dialogRefSpyObj.componentInstance = { body: '' };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedModule, MatDialogModule, NoopAnimationsModule],
      declarations: [ ConfigurationSelectFieldComponent, SearchPipe ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurationSelectFieldComponent);
    formBuilder = TestBed.inject(FormBuilder);
    component = fixture.componentInstance;
    const form = new FormGroup({
      employeeMapping: new FormControl(['EMPLOYEE']),
      autoMapEmployee: new FormControl([true]),
      emails: new FormControl(['fyle@fyle.in', 'integrations@fyle.in' ])
    });
    const liveEntityExample = {EMPLOYEE: 'FYLE', VENDOR: 'Integration'};
    component.form = form;
    // Component.options = employeeMappingOptions;
    // Component.liveEntityExample = liveEntityExample;
    component.formControllerName = 'employeeMapping';
    component.isFieldMandatory = true;
    component.mandatoryErrorListName = 'option';
    component.iconPath = 'assets/images/svgs/general/employee.svg';
    component.label = 'How are your Employees represented in Xero?';
    component.subLabel = 'Select how you represent your employees in Xero. This would help to export the expenses from Fyle to the correct employee/vendor record in Xero.';
    component.placeholder = 'Select representation';
    fixture.detectChanges();
    dialogSpy = spyOn(TestBed.get(MatDialog), 'open').and.returnValue(dialogRefSpyObj);
  });

  // Figure out a way to send the data to the component [@Input()]
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('showXeroExportPreview function check', () => {
    component.showXeroExportPreview(null, null);
    expect(dialogSpy).toHaveBeenCalled();
  });

  it('HTML check', () => {
    const configurationHeaderdiv = fixture.debugElement.query(By.css('.configuration--field-header'));
    const configurationH5 = fixture.debugElement.queryAll(By.css('h5'));
    expect(configurationHeaderdiv.nativeElement.innerText).toBe(component.label+' *');
    expect(configurationH5[0].nativeElement.innerText).toBe(component.subLabel);
  });
});
