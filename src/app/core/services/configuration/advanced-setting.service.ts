import { EventEmitter, Injectable, Output } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Cacheable, CacheBuster } from 'ts-cacheable';
import { AdvancedSettingFormOption, AdvancedSettingGet, AdvancedSettingPost } from '../../models/configuration/advanced-setting.model';
import { ApiService } from '../core/api.service';
import { WorkspaceScheduleEmailOptions } from '../../models/db/workspace-schedule.model';
import { WorkspaceService } from '../workspace/workspace.service';
import { PaymentSyncDirection } from '../../models/enum/enum.model';
import { MatDialog } from '@angular/material/dialog';
import { AddEmailDialogComponent } from 'src/app/shared/components/configuration/advanced-settings/add-email-dialog/add-email-dialog.component';
import { FormGroup } from '@angular/forms';

const advancedSettingsCache$ = new Subject<void>();
@Injectable({
  providedIn: 'root'
})
export class AdvancedSettingService {
  workspaceId = this.workspaceService.getWorkspaceId()

  @Output() patchAdminEmailsEmitter: EventEmitter<WorkspaceScheduleEmailOptions[]> = new EventEmitter();

  constructor(
    private apiService: ApiService,
    private dialog: MatDialog,
    private workspaceService: WorkspaceService
  ) { }

  @Cacheable({
    cacheBusterObserver: advancedSettingsCache$
  })
  getAdvancedSettings(): Observable<AdvancedSettingGet> {
    return this.apiService.get(`/v2/workspaces/${this.workspaceId}/advanced_settings/`, {});
  }

  @CacheBuster({
    cacheBusterNotifier: advancedSettingsCache$
  })
  postAdvancedSettings(advancedSettingPayload: AdvancedSettingPost): Observable<AdvancedSettingGet> {
    return this.apiService.put(`/v2/workspaces/${this.workspaceId}/advanced_settings/`, advancedSettingPayload);
  }

  getWorkspaceAdmins(): Observable<[WorkspaceScheduleEmailOptions]> {
    return this.apiService.get(`/workspaces/${this.workspaceId}/admins/`, {});
  }

  getPaymentSyncOptions(): AdvancedSettingFormOption[] {
    return [
      {
        label: 'None',
        value: 'None'
      },
      {
        label: 'Export Fyle ACH Payments to Xero',
        value: PaymentSyncDirection.FYLE_TO_XERO
      },
      {
        label: 'Import Xero Payments into Fyle',
        value: PaymentSyncDirection.XERO_TO_FYLE
      }
    ];
  }

  getFrequencyIntervals(): AdvancedSettingFormOption[] {
    return  [...Array(24).keys()].map(day => {
      return {
        label: (day + 1) === 1 ? (day + 1) + ' Hour' : (day + 1) + ' Hours',
        value: day + 1
      };
    });
  }

  openAddemailDialog(advancedSettingsForm: FormGroup, adminEmails: WorkspaceScheduleEmailOptions[]): void {
    const dialogRef = this.dialog.open(AddEmailDialogComponent, {
      width: '467px',
      data: {
        workspaceId: this.workspaceId,
        hours: advancedSettingsForm.value.exportScheduleFrequency,
        schedulEnabled: advancedSettingsForm.value.exportSchedule,
        selectedEmails: advancedSettingsForm.value.emails
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        advancedSettingsForm.controls.exportScheduleFrequency.patchValue(result.hours);
        advancedSettingsForm.controls.emails.patchValue(result.emails_selected);
        advancedSettingsForm.controls.addedEmail.patchValue(result.email_added);

        const additionalEmails = adminEmails.concat(result.email_added);
        this.patchAdminEmailsEmitter.emit(additionalEmails);
      }
    });
  }
}
