import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectComponent } from './select.component';
import { ReimbursableExpensesObject } from 'src/app/core/models/enum/enum.model';
import { MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SearchPipe } from 'src/app/shared/pipes/search.pipe';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('SelectComponent', () => {
  let component: SelectComponent;
  let fixture: ComponentFixture<SelectComponent>;
  let dialogSpy: jasmine.Spy;
  const routerSpy = { navigate: jasmine.createSpy('navigate'), url: '/path' };
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectComponent, SearchPipe ],
      providers: [
        { provide: Router, useValue: routerSpy },
      ],
      imports: [
        MatDialogModule, NoopAnimationsModule
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('showXeroExportPreview function check', () => {
    component.showXeroExportPreview(ReimbursableExpensesObject.PURCHASE_BILL, null);
    expect(dialogSpy).toHaveBeenCalled();
  });
});
