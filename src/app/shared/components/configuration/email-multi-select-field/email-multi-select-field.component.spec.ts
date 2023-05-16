import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from 'src/app/shared/shared.module';

import { EmailMultiSelectFieldComponent } from './email-multi-select-field.component';
import { Router } from '@angular/router';

describe('EmailMultiSelectFieldComponent', () => {
  let component: EmailMultiSelectFieldComponent;
  let fixture: ComponentFixture<EmailMultiSelectFieldComponent>;
  const routerSpy = { navigate: jasmine.createSpy('navigate'), url: '/path' };
  let router: Router;

  let formBuilder: FormBuilder;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedModule, MatDialogModule, NoopAnimationsModule],
      declarations: [ EmailMultiSelectFieldComponent ],
      providers: [
        { provide: Router, useValue: routerSpy }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailMultiSelectFieldComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);
    const form = formBuilder.group({
      searchOption: [],
      emails: [['fyle@fyle.in', 'integrations@fyle.in']],
      employeeMapping: [['EMPLOYEE']]
    });
    component.form = form;
    const adminEmails: any[] = [{name: 'fyle', email: 'fyle@fyle.in'}, {name: 'dhaara', email: 'fyle1@fyle.in'}];
    const liveEntityExample = {EMPLOYEE: 'FYLE', VENDOR: 'Integration'};
    component.options = adminEmails;
    component.formControllerName = 'employeeMapping';
    component.isFieldMandatory = true;
    component.iconPath = 'assets/images/svgs/general/employee.svg';
    component.label = 'How are your Employees represented in Xero?';
    component.subLabel = 'Select how you represent your employees in Xero. This would help to export the expenses from Fyle to the correct employee/vendor record in Xero.';
    component.placeholder = 'Select representation';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
