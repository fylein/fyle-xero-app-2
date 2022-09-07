import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { CorporateCreditCardExpensesObject, ReimbursableExpensesObject } from 'src/app/core/models/enum/enum.model';
// Import { PreviewPage } from 'src/app/core/models/misc/preview-page.model';
import { SharedModule } from 'src/app/shared/shared.module';
import { PreviewDialogComponent } from './preview-dialog.component';

describe('PreviewDialogComponent', () => {
  let component: PreviewDialogComponent;
  let fixture: ComponentFixture<PreviewDialogComponent>;
  const preview = {
    fyleExpense: true,
    xeroReimburse: ReimbursableExpensesObject.PURCHASE_BILL,
    xeroCCC: CorporateCreditCardExpensesObject.BANK_TRANSACTION
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedModule, MatDialogModule],
      declarations: [ PreviewDialogComponent ],
      providers: [
        {
          // I was expecting this will pass the desired value
          provide: MAT_DIALOG_DATA,
          useValue: preview
        }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
