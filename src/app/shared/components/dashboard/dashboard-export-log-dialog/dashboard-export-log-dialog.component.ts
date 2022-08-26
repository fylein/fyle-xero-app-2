import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ExpenseGroup, ExpenseGroupList, ExpenseGroupResponse } from 'src/app/core/models/db/expense-group.model';
import { ExportState, FyleReferenceType } from 'src/app/core/models/enum/enum.model';
import { ExportLogService } from 'src/app/core/services/export-log/export-log.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-dashboard-export-log-dialog',
  templateUrl: './dashboard-export-log-dialog.component.html',
  styleUrls: ['./dashboard-export-log-dialog.component.scss']
})
export class DashboardExportLogDialogComponent implements OnInit {

  isLoading: boolean = true;

  expenseGroups: MatTableDataSource<ExpenseGroupList> = new MatTableDataSource<ExpenseGroupList>([]);

  emptyExpenseGroup: MatTableDataSource<ExpenseGroupList> = new MatTableDataSource<ExpenseGroupList>([]);

  displayedColumns: string[];

  ExportState = ExportState;

  externalUrlType: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {exportState: ExportState, lastExportedAt: Date},
    public dialogRef: MatDialogRef<DashboardExportLogDialogComponent>,
    private exportLogService: ExportLogService
  ) { }

  private setupPage(): void {
    if (this.data.exportState === ExportState.SUCCESS) {
      this.displayedColumns = ['referenceID', 'name', 'exportType', 'link'];
      this.externalUrlType = 'Xero';
    } else {
      this.displayedColumns = ['referenceID', 'name', 'link'];
      this.externalUrlType = 'Fyle';
    }

    const expenseGroups: ExpenseGroupList[] = [];
    const state: string = this.data.exportState === ExportState.SUCCESS ? 'COMPLETE' : 'FAILED';

    // This.exportLogService.getExpenseGroups(state, 500, 0, null, this.data.lastExportedAt).subscribe((expenseGroupResponse: ExpenseGroupResponse) => {
    //   ExpenseGroupResponse.results.forEach((expenseGroup: ExpenseGroup) => {
    //     Let type: string = '', id: string = '', exportType: string = '';

    //     If (this.data.exportState === ExportState.SUCCESS) {
    //       [type, id, exportType] = this.exportLogService.generateExportTypeAndId(expenseGroup);
    //     }
    //     Const referenceType: FyleReferenceType = this.exportLogService.getReferenceType(expenseGroup.description);
    //     Let referenceNumber: string = expenseGroup.description[referenceType];

    //     If (referenceType === FyleReferenceType.EXPENSE) {
    //       ReferenceNumber = expenseGroup.expenses[0].expense_number;
    //     } else if (referenceType === FyleReferenceType.PAYMENT) {
    //       ReferenceNumber = expenseGroup.expenses[0].settlement_id;
    //     }

    //     Const fyleUrl = this.exportLogService.generateFyleUrl(expenseGroup, referenceType);

    //     ExpenseGroups.push({
    //       ExportedAt: expenseGroup.exported_at,
    //       Employee: [expenseGroup.employee_name, expenseGroup.description.employee_email],
    //       ExpenseType: expenseGroup.fund_source === 'CCC' ? 'Credit Card' : 'Reimbursable',
    //       FyleReferenceType: referenceType,
    //       ReferenceNumber: referenceNumber,
    //       ExportedAs: exportType,
    //       FyleUrl: fyleUrl,
    //       XeroUrl: this.data.exportState === ExportState.SUCCESS ? `${environment.app_url}/app/${type}?txnId=${id}` : fyleUrl,
    //       Expenses: expenseGroup.expenses
    //     });
    //   });
    //   This.expenseGroups = new MatTableDataSource(expenseGroups);
    //   This.isLoading = false;
    // });
  }

  ngOnInit(): void {
    this.setupPage();
  }

}
