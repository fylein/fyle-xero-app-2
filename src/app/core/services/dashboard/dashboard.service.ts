import { Injectable } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { Cacheable } from 'ts-cacheable';
import { Error } from '../../models/db/error.model';
import { ExportableExpenseGroup } from '../../models/db/expense-group.model';
import { LastExport } from '../../models/db/last-export.model';
import { TaskGetParams, TaskResponse } from '../../models/db/task-log.model';
import { ExportMode, TaskLogState, TaskLogType } from '../../models/enum/enum.model';
import { ApiService } from '../core/api.service';
import { WorkspaceService } from '../workspace/workspace.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  workspaceId: string = this.workspaceService.getWorkspaceId();

  constructor(
    private apiService: ApiService,
    private workspaceService: WorkspaceService
  ) { }

  // TODO: cleanup all methods once dashboard impl is done

  getExportableGroupsIds(): Observable<ExportableExpenseGroup> {
    const response:ExportableExpenseGroup = {exportable_expense_group_ids: []};
    // Return of(response)
    return this.apiService.get(`/workspaces/${this.workspaceId}/fyle/exportable_expense_groups/`, {});
  }

  getExportErrors(): Observable<Error[]> {
    // Return of([]);
    return this.apiService.get(`/v2/workspaces/${this.workspaceId}/errors/`, {is_resolved: false});
  }

  @Cacheable()
  importExpenseGroups(): Observable<{}> {
    // Return of([]);
    return this.apiService.post(`/workspaces/${this.workspaceId}/fyle/expense_groups/sync/`, {});
  }

  exportExpenseGroups(): Observable<{}> {
    return this.apiService.post(`/workspaces/${this.workspaceId}/exports/trigger/`, {});
  }

  getLastExport(): Observable<LastExport> {
    const response:LastExport={
      created_at: new Date("2022-04-27T06:37:30.296865Z"),
      export_mode: ExportMode.MANUAL,
      failed_expense_groups_count: 5,
      id: 154,
      last_exported_at: new Date("2022-05-10T08:00:38.440819Z"),
      successful_expense_groups_count: 0,
      total_expense_groups_count: 5,
      updated_at: new Date("2022-05-10T08:00:43.857641Z"),
      workspace: 216
    };
    // Return of(response)
    return this.apiService.get(`/workspaces/${this.workspaceId}/export_detail/`, {});
  }

  getAllTasks(status: TaskLogState[], expenseGroupIds: number[] = [], taskType: TaskLogType[] = []): Observable<TaskResponse> {
    const limit = 500;
    const allTasks: TaskResponse = {
      count: 0,
      next: null,
      previous: null,
      results: []
    };

    return from(this.getAllTasksInternal(limit, status, expenseGroupIds, taskType, allTasks));
  }

  private getAllTasksInternal(limit: number, status: string[], expenseGroupIds: number[], taskType: string[], allTasks: TaskResponse): Promise<TaskResponse> {
    const that = this;
    return that.getTasks(limit, status, expenseGroupIds, taskType, allTasks.next).toPromise().then((taskResponse) => {
      if (allTasks.count === 0) {
        allTasks = taskResponse;
      } else {
        allTasks.results = allTasks.results.concat(taskResponse.results);
      }

      if (taskResponse.next) {
        return that.getAllTasksInternal(limit, status, expenseGroupIds, taskType, allTasks);
      }

      return allTasks;
    });
  }

  getTasks(limit: number, status: string[], expenseGroupIds: number[], taskType: string[], next: string | null): Observable<TaskResponse> {
    const offset = 0;
    const apiParams: TaskGetParams = {
      limit: limit,
      offset: offset,
      status: status
    };

    if (expenseGroupIds.length) {
      const expenseKey = 'expense_group_ids';
      apiParams[expenseKey] = expenseGroupIds;
    }

    if (taskType) {
      const typeKey = 'task_type';
      apiParams[typeKey] = taskType;
    }

    if (next) {
      return this.apiService.get(next.split('api')[1], {});
    }

    return this.apiService.get(
      `/workspaces/${this.workspaceId}/tasks/all/`, apiParams
    );
  }

}
