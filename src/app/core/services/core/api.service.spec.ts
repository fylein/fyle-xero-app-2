import { getTestBed, TestBed } from '@angular/core/testing';
import { ApiService } from './api.service';
import { Workspace } from '../../models/db/workspace.model';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';
import { HttpErrorResponse, HttpEventType, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

describe('ApiService', () => {
  let service: ApiService;
  let injector: TestBed;
  let httpMock: HttpTestingController;
  const API_BASE_URL = environment.api_url;
  const workspace_id = environment.tests.workspaceId;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService]
    });
    injector = getTestBed();
    service = injector.inject(ApiService);
    httpMock = injector.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Post service', () => {
    const responseKeys: Workspace = {
      fyle_org_id: "orPJvXuoLqvJ",
      id: 132,
      name: "FAE",
      user: [27, 30],
      xero_short_code: "!Ps3bq",
      last_synced_at: new Date("2022-04-13T10:29:18.796760Z"),
      source_synced_at: new Date("2022-04-13T10:29:18.796760Z"),
      destination_synced_at: new Date("2022-04-13T10:29:18.796760Z"),
      created_at: new Date("2022-04-13T10:29:18.796760Z"),
      updated_at: new Date("2022-04-13T10:29:18.796760Z")
    };
    service.post('/workspaces/', {}).subscribe((value) => {
      expect(value).toEqual(responseKeys);
    });
    const req = httpMock.expectOne({
      method: 'POST',
      url: `${API_BASE_URL}/workspaces/`
    });
    req.flush(responseKeys);
  });

  it('Post service error', () => {
    const responseKeys = { status: 404, statusText: "Not Found" };
    service.post('/workspaces/', {}).subscribe((value) => {
      expect(value).toEqual(responseKeys);
    },
      error => {
        expect(error.status).toBe(404);
      });
    const req = httpMock.expectOne({
      method: 'POST',
      url: `${API_BASE_URL}/workspaces/`
    });
    req.flush('', responseKeys);
  });

  it('Get service', () => {
    const responseKeys: Workspace = {
      fyle_org_id: "orPJvXuoLqvJ",
      id: 132,
      name: "FAE",
      user: [27, 30],
      xero_short_code: "!Ps3bq",
      last_synced_at: new Date("2022-04-13T10:29:18.796760Z"),
      source_synced_at: new Date("2022-04-13T10:29:18.796760Z"),
      destination_synced_at: new Date("2022-04-13T10:29:18.796760Z"),
      created_at: new Date("2022-04-13T10:29:18.796760Z"),
      updated_at: new Date("2022-04-13T10:29:18.796760Z")
    };
    service.get("/workspaces/", { org_id: 1 }).subscribe(value => {
      expect(value).toEqual(responseKeys);
    });
    const req = httpMock.expectOne({
      method: 'GET',
      url: `${API_BASE_URL}/workspaces/?org_id=1`
    });
    req.flush(responseKeys);
  });

  it('Get service error', () => {
    const responseKeys = { status: 404, statusText: "Not Found" };
    service.get("/workspaces/", { org_id: 1 }).subscribe(value => {
    },
      error => {
        expect(error.status).toBe(404);
      });
    const req = httpMock.expectOne({
      method: 'GET',
      url: `${API_BASE_URL}/workspaces/?org_id=1`
    });
    req.flush('', responseKeys);
  });

  // It('Put service check', () => {
  //   Const employeeSettingPayload: EmployeeSettingPost = {
  //     Workspace_general_settings: {
  //       Employee_field_mapping: EmployeeFieldMapping.EMPLOYEE,
  //       Auto_map_employees: AutoMapEmployee.EMPLOYEE_CODE
  //     }
  //   };
  //   Const response: EmployeeSettingGet = {
  //     Workspace_general_settings: { employee_field_mapping: EmployeeFieldMapping.EMPLOYEE, auto_map_employees: AutoMapEmployee.EMPLOYEE_CODE },
  //     Workspace_id: 1
  //   };
  //   Service.put('/v2/workspaces/'+workspace_id+'/map_employees/', employeeSettingPayload).subscribe(value => {
  //     Expect(value).toEqual(response);
  //   });
  //   Const req = httpMock.expectOne({
  //     Method: 'PUT',
  //     Url: `${API_BASE_URL}/v2/workspaces/${workspace_id}/map_employees/`
  //   });
  //   Req.flush(response);
  // });

  // It('Put service error', () => {
  //   Const employeeSettingPayload: EmployeeSettingPost = {
  //     Workspace_general_settings: {
  //       Employee_field_mapping: EmployeeFieldMapping.EMPLOYEE,
  //       Auto_map_employees: AutoMapEmployee.EMPLOYEE_CODE
  //     }
  //   };
  //   Const responseKeys = { status: 404, statusText: "Not Found" };
  //   Service.put('/v2/workspaces/'+workspace_id+'/map_employees/', employeeSettingPayload).subscribe(value => {
  //     Expect(value).toEqual(responseKeys);
  //   },
  //   Error => {
  //     Expect(error.status).toBe(404);
  //   });
  //   Const req = httpMock.expectOne({
  //     Method: 'PUT',
  //     Url: `${API_BASE_URL}/v2/workspaces/${workspace_id}/map_employees/`
  //   });
  // Req.flush('', responseKeys);
  // });

  it('patch service check', () => {
    const response = {
      app: 'done'
    };
    service.patch(`/workspaces/${workspace_id}/`, { app_version: 'v1' }).subscribe((value) => {
      expect(value).toBeDefined();
    });
    const req = httpMock.expectOne({
      method: 'PATCH',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/`
    });
    req.flush(response);
  });

  it('patch service error check', () => {
    const response = { status: 404, statusText: "Not Found" };
    service.patch(`/workspaces/${workspace_id}/`, { app_version: 'v1' }).subscribe((value) => {
      expect(value).toBeDefined();
    },
      error => {
        expect(error.status).toBe(404);
      });
    const req = httpMock.expectOne({
      method: 'PATCH',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/`
    });
    req.flush('', response);
  });

  it('Handel error service error check', () => {
    const errors = new ErrorEvent("error in back end", { message: 'error in back end', error: new Error("Error") });
    const response: HttpErrorResponse = {
      error: errors, status: 404, statusText: "Not Found",
      name: 'HttpErrorResponse',
      message: '',
      ok: false,
      headers: new HttpHeaders,
      url: null,
      type: HttpEventType.ResponseHeader
    };
    const error = (service as any).handleError(response, 'GET');
    expect(response.error.message).toEqual('error in back end');
    expect(error).toBeInstanceOf(Observable);
  });

  it('delete method test for 200', () => {
    const response = {
      app: 'deleted'
    };
    service.delete(`/workspaces/${workspace_id}/`).subscribe((value) => {
      expect(value).toBeDefined();
    });
    const req = httpMock.expectOne({
      method: 'DELETE',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/`
    });

    req.flush(response);
  });

  it('delete method test for 4xx', () => {
    const response = {
      status: 404,
      statusText: "Not Found"
    };

    service.delete(`/workspaces/${workspace_id}/`).subscribe((value) => {
      expect(value).toBeDefined();
    }, (error) => {
      expect(error.status).toBe(404);
    });

    const req = httpMock.expectOne({
      method: 'DELETE',
      url: `${API_BASE_URL}/workspaces/${workspace_id}/`
    });

    req.flush('', response);
  });

});