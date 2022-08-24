// Import { getTestBed, TestBed } from '@angular/core/testing';
// Import { HttpClientModule } from '@angular/common/http';
// Import { MappingService } from './mapping.service';
// Import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
// Import { environment } from 'src/environments/environment';
// Import { EmployeeFieldMapping, FyleField, MappingState, QBOField } from '../../models/enum/enum.model';
// Import { ExpenseField } from '../../models/misc/expense-field.model';
// Import { MappingPost, MappingStats } from '../../models/db/mapping.model';
// Import { MappingSettingResponse } from '../../models/db/mapping-setting.model';
// Import { EmployeeMapping, EmployeeMappingPost } from '../../models/db/employee-mapping.model';
// Import { DestinationAttribute } from '../../models/db/destination-attribute.model';
// Import { mappingSettingPayload, postMappingSettingResponse } from './mapping.service.fixture';

// Describe('MappingService', () => {
//   Let service: MappingService;
//   Let injector: TestBed;
//   Let httpMock: HttpTestingController;
//   Const API_BASE_URL = environment.api_url;
//   Const workspace_id = environment.tests.workspaceId;

//   BeforeEach(() => {
//     TestBed.configureTestingModule({
//       Imports: [HttpClientModule, HttpClientTestingModule],
//       Providers: [MappingService]
//     });
//     Injector = getTestBed();
//     Service = injector.inject(MappingService);
//     HttpMock = injector.inject(HttpTestingController);
//   });

//   It('should be created', () => {
//     Expect(service).toBeTruthy();
//   });

//   It('getDistinctQBODestinationAttributes() service check', () => {
//     Service.getDistinctQBODestinationAttributes([EmployeeFieldMapping.EMPLOYEE, EmployeeFieldMapping.VENDOR]).subscribe(value => {
//       Expect(value).toEqual([]);
//     });
//     Const req = httpMock.expectOne({
//       Method: 'GET',
//       Url: `${API_BASE_URL}/workspaces/${workspace_id}/qbo/qbo_attributes/?attribute_types=EMPLOYEE,VENDOR`
//     });
//       Req.flush([]);

//   });

//   It('getQBODestinationAttributes() service check', () => {
//     Service.getQBODestinationAttributes([EmployeeFieldMapping.EMPLOYEE, EmployeeFieldMapping.VENDOR]).subscribe(value => {
//       Expect(value).toEqual([]);
//     });
//     Const req = httpMock.expectOne({
//       Method: 'GET',
//       Url: `${API_BASE_URL}/workspaces/${workspace_id}/qbo/destination_attributes/?attribute_types=EMPLOYEE,VENDOR`
//     });
//       Req.flush([]);

//   });

//   It('getDistinctQBODestinationAttributes() service check', () => {
//     Service.getDistinctQBODestinationAttributes([EmployeeFieldMapping.EMPLOYEE, EmployeeFieldMapping.VENDOR]).subscribe(value => {
//       Expect(value).toEqual([]);
//     });
//     Const req = httpMock.expectOne({
//       Method: 'GET',
//       Url: `${API_BASE_URL}/workspaces/${workspace_id}/qbo/qbo_attributes/?attribute_types=EMPLOYEE,VENDOR`
//     });
//       Req.flush([]);
//   });

//   It('getFyleExpenseFields() service check', () => {
//     Const response:ExpenseField[]=[
//       {
//           "attribute_type": "COST_CENTER",
//           "display_name": "Cost Center"
//       },
//       {
//           "attribute_type": "PROJECT",
//           "display_name": "Project"
//       },
//       {
//           "attribute_type": "REGION",
//           "display_name": "Region"
//       },
//       {
//           "attribute_type": "XERO_REGION",
//           "display_name": "Xero Region"
//       },
//       {
//           "attribute_type": "XERO_ITEM",
//           "display_name": "Xero Item"
//       },
//       {
//           "attribute_type": "XERO_FIELD",
//           "display_name": "Xero Field"
//       }
//   ];
//     Service.getFyleExpenseFields().subscribe(value => {
//       Const responseKeys = Object.keys(response).sort();
//       Const actualKeys = Object.keys(value).sort();
//       Expect(actualKeys).toEqual(responseKeys);
//     });
//     Const req = httpMock.expectOne({
//       Method: 'GET',
//       Url: `${API_BASE_URL}/workspaces/${workspace_id}/fyle/expense_fields/`
//     });
//       Req.flush(response);
//   });

//   It('getMappings() service check', () => {
//     Const response={
//       "count": 125,
//       "next": `${API_BASE_URL}/workspaces/${workspace_id}/mappings/expense_attributes/?all_alphabets=true&destination_type=ACCOUNT&limit=3&mapped=ALL&mapping_source_alphabets=null&offset=6&source_type=CATEGORY`,
//       "previous": `${API_BASE_URL}/workspaces/${workspace_id}/mappings/expense_attributes/?all_alphabets=true&destination_type=ACCOUNT&limit=3&mapped=ALL&mapping_source_alphabets=null&source_type=CATEGORY`,
//       "results": [
//         {
//           "id": 36,
//           "mapping": [],
//           "attribute_type": "CATEGORY",
//           "display_name": "Category",
//           "value": "Advertising",
//           "source_id": 186449,
//           "auto_mapped": false,
//           "auto_created": false,
//           "active": false,
//           "detail": null,
//           "created_at": new Date("2022-04-29T07:14:58.746099Z"),
//           "updated_at": new Date("2022-04-29T07:14:58.746128Z"),
//           "workspace": 1
//       }
//       ]
//   };
//     Service.getMappings(MappingState.ALL, true, 1, 1, [], FyleField.CATEGORY, QBOField.ACCOUNT).subscribe(value => {
//       Const responseKeys = Object.keys(response).sort();
//       Const actualResponseKeys = Object.keys(value).sort();
//       Expect(actualResponseKeys).toEqual(responseKeys);
//     });
//     Const req = httpMock.expectOne({
//       Method: 'GET',
//       Url: `${API_BASE_URL}/workspaces/${workspace_id}/mappings/expense_attributes/?limit=1&offset=1&all_alphabets=true&mapped=ALL&mapping_source_alphabets=null&source_type=CATEGORY&destination_type=ACCOUNT`
//     });
//       Req.flush(response);
//   });

//   It('getMappings() service check', () => {
//     Const response={
//       "count": 125,
//       "next": `${API_BASE_URL}/workspaces/${workspace_id}/mappings/expense_attributes/?all_alphabets=true&destination_type=ACCOUNT&limit=3&mapped=ALL&mapping_source_alphabets=null&offset=6&source_type=CATEGORY`,
//       "previous": `${API_BASE_URL}/workspaces/${workspace_id}/mappings/expense_attributes/?all_alphabets=true&destination_type=ACCOUNT&limit=3&mapped=ALL&mapping_source_alphabets=null&source_type=CATEGORY`,
//       "results": [
//         {
//           "id": 36,
//           "mapping": [],
//           "attribute_type": "CATEGORY",
//           "display_name": "Category",
//           "value": "Advertising",
//           "source_id": 186449,
//           "auto_mapped": false,
//           "auto_created": false,
//           "active": false,
//           "detail": null,
//           "created_at": new Date("2022-04-29T07:14:58.746099Z"),
//           "updated_at": new Date("2022-04-29T07:14:58.746128Z"),
//           "workspace": 1
//       }
//       ]
//   };
//     Service.getMappings(MappingState.UNMAPPED, true, 1, 1, ['all'], FyleField.CATEGORY, QBOField.ACCOUNT).subscribe(value => {
//       Const responseKeys = Object.keys(response).sort();
//       Const actualResponseKeys = Object.keys(value).sort();
//       Expect(actualResponseKeys).toEqual(responseKeys);
//     });
//     Const req = httpMock.expectOne({
//       Method: 'GET',
//       Url: `${API_BASE_URL}/workspaces/${workspace_id}/mappings/expense_attributes/?limit=1&offset=1&all_alphabets=true&mapped=false&mapping_source_alphabets=all&source_type=CATEGORY&destination_type=ACCOUNT`
//     });
//       Req.flush(response);
//   });

//   It('getQBOEmployees() service check', () => {
//     Service.getQBOEmployees().subscribe(value => {
//       Expect(value).toEqual([]);
//     });
//     Const req = httpMock.expectOne({
//       Method: 'GET',
//       Url: `${API_BASE_URL}/workspaces/${workspace_id}/qbo/employees/`
//     });
//       Req.flush([]);
//   });

//   It('getQBOVendors() service check', () => {
//     Service.getQBOVendors().subscribe(value => {
//       Expect(value).toEqual([]);
//     });
//     Const req = httpMock.expectOne({
//       Method: 'GET',
//       Url: `${API_BASE_URL}/workspaces/${workspace_id}/qbo/vendors/`
//     });
//       Req.flush([]);
//   });

//   It('getMappingSettings() service check', () => {
//     Const response:MappingSettingResponse = {
//       Count: 0, next: 'aa', previous: 'aa', results: []};
//     Service.getMappingSettings().subscribe(value => {
//       Const responseKeys = Object.keys(response).sort();
//       Const actualResponseKeys = Object.keys(value).sort();
//       Expect(actualResponseKeys).toEqual(responseKeys);
//     });
//     Const req = httpMock.expectOne({
//       Method: 'GET',
//       Url: `${API_BASE_URL}/workspaces/${workspace_id}/mappings/settings/`
//     });
//       Req.flush(response);
//   });

//   It('getMappingStats() service check', () => {
//     Const response:MappingStats= {
//       All_attributes_count: 3,
//       Unmapped_attributes_count: 3
//     };
//     Service.getMappingStats(EmployeeFieldMapping.EMPLOYEE, EmployeeFieldMapping.VENDOR).subscribe((value) => {
//       Const responseKeys = Object.keys(response).sort();
//       Const actualKeys = Object.keys(value).sort();
//       Expect(actualKeys).toEqual(responseKeys);
//     });
//     Const req = httpMock.expectOne({
//       Method: 'GET',
//       Url: `${API_BASE_URL}/workspaces/${workspace_id}/mappings/stats/?source_type=EMPLOYEE&destination_type=VENDOR`
//     });
//       Req.flush(response);
//   });

//   It('getMappings() service check', () => {
//     Const response={
//       "count": 3,
//       "next": `${API_BASE_URL}/workspaces/${workspace_id}/mappings/employee_attributes/?all_alphabets=true&destination_type=EMPLOYEE&limit=1&mapped=ALL&mapping_source_alphabets=null&offset=2`,
//       "previous": `${API_BASE_URL}/workspaces/${workspace_id}/mappings/employee_attributes/?all_alphabets=true&destination_type=EMPLOYEE&limit=1&mapped=ALL&mapping_source_alphabets=null`,
//       "results": [
//         {
//           "id": 3,
//           "employeemapping": [],
//           "attribute_type": "EMPLOYEE",
//           "display_name": "Employee",
//           "value": "gokul.kathiresan@fyle.in",
//           "source_id": "oupTTvXHXCuk",
//           "auto_mapped": false,
//           "auto_created": false,
//           "active": null,
//           "detail": {
//               "user_id": "usCPKib1GyYP",
//               "location": null,
//               "full_name": "Gokul",
//               "department": null,
//               "department_id": null,
//               "employee_code": null,
//               "department_code": null
//           },
//           "created_at": new Date("2022-04-29T07:14:57.819103Z"),
//           "updated_at": new Date("2022-04-29T07:14:57.819149Z"),
//           "workspace": workspace_id
//         }
//       ]
//   };
//     Service.getEmployeeMappings(MappingState.ALL, true, 1, 1, [], EmployeeFieldMapping.EMPLOYEE).subscribe(value => {
//       Const responseKeys = Object.keys(response).sort();
//       Const actualResponseKeys = Object.keys(value).sort();
//       Expect(actualResponseKeys).toEqual(responseKeys);
//     });
//     Const req = httpMock.expectOne({
//       Method: 'GET',
//       Url: `${API_BASE_URL}/workspaces/${workspace_id}/mappings/employee_attributes/?limit=1&offset=1&all_alphabets=true&mapped=ALL&mapping_source_alphabets=null&destination_type=EMPLOYEE`
//     });
//       Req.flush(response);
//   });

//   It('getMappings() service check', () => {
//     Const response={
//       "count": 3,
//       "next": `${API_BASE_URL}/workspaces/${workspace_id}/mappings/employee_attributes/?all_alphabets=true&destination_type=EMPLOYEE&limit=1&mapped=ALL&mapping_source_alphabets=null&offset=2`,
//       "previous": `${API_BASE_URL}/workspaces/${workspace_id}/mappings/employee_attributes/?all_alphabets=true&destination_type=EMPLOYEE&limit=1&mapped=ALL&mapping_source_alphabets=null`,
//       "results": [
//         {
//           "id": 3,
//           "employeemapping": [],
//           "attribute_type": "EMPLOYEE",
//           "display_name": "Employee",
//           "value": "gokul.kathiresan@fyle.in",
//           "source_id": "oupTTvXHXCuk",
//           "auto_mapped": false,
//           "auto_created": false,
//           "active": null,
//           "detail": {
//               "user_id": "usCPKib1GyYP",
//               "location": null,
//               "full_name": "Gokul",
//               "department": null,
//               "department_id": null,
//               "employee_code": null,
//               "department_code": null
//           },
//           "created_at": new Date("2022-04-29T07:14:57.819103Z"),
//           "updated_at": new Date("2022-04-29T07:14:57.819149Z"),
//           "workspace": workspace_id
//         }
//       ]
//   };
//     Service.getEmployeeMappings(MappingState.UNMAPPED, true, 1, 1, ['all'], EmployeeFieldMapping.EMPLOYEE).subscribe(value => {
//       Const responseKeys = Object.keys(response).sort();
//       Const actualResponseKeys = Object.keys(value).sort();
//       Expect(actualResponseKeys).toEqual(responseKeys);
//     });
//     Const req = httpMock.expectOne({
//       Method: 'GET',
//       Url: `${API_BASE_URL}/workspaces/${workspace_id}/mappings/employee_attributes/?limit=1&offset=1&all_alphabets=true&mapped=false&mapping_source_alphabets=all&destination_type=EMPLOYEE`
//     });
//       Req.flush(response);
//   });

//   It('getQBOEmployees() service check', () => {
//     Service.triggerAutoMapEmployees().subscribe(value => {
//       Expect(value).toEqual({});
//     });
//     Const req = httpMock.expectOne({
//       Method: 'POST',
//       Url: `${API_BASE_URL}/workspaces/${workspace_id}/mappings/auto_map_employees/trigger/`
//     });
//       Req.flush({});
//   });

//   It('getGroupedQBODestinationAttributes() withdata service check', () => {
//     Const destinationAttributes = ['BANK_ACCOUNT', 'CREDIT_CARD_ACCOUNT', 'ACCOUNTS_PAYABLE', 'VENDOR'];
//     Const response = {
//       BANK_ACCOUNT: [],
//       CREDIT_CARD_ACCOUNT: [],
//       ACCOUNTS_PAYABLE: [],
//       VENDOR: [],
//       ACCOUNT: [],
//       TAX_CODE: []
//     };
//     Let responseKeys;
//     Let actualResponseKeys;
//     Service.getGroupedQBODestinationAttributes(destinationAttributes).subscribe((value) => {
//       ResponseKeys = Object.keys(response).sort();
//       ActualResponseKeys = Object.keys(value).sort();
//     });
//     Expect(actualResponseKeys).toEqual(responseKeys);
//     Const req = httpMock.expectOne({
//       Method: 'GET',
//       Url: `${API_BASE_URL}/workspaces/${workspace_id}/qbo/destination_attributes/?attribute_types=BANK_ACCOUNT,CREDIT_CARD_ACCOUNT,ACCOUNTS_PAYABLE,VENDOR`
//     });
//       Req.flush([{"id": 45531, "attribute_type": "CREDIT_CARD_ACCOUNT", "display_name": "Credit Card Account", "value": "2285 Fyle Credit Card", "destination_id": "106", "auto_created": false, "active": null, "detail": {"account_type": "Credit Card", "fully_qualified_name": "2285 Fyle Credit Card"}, "created_at": "2022-04-14T06:09:07.537182Z", "updated_at": "2022-04-14T06:09:07.537205Z", "workspace": 216}]);
//   });

//   It('getGroupedQBODestinationAttributes() without data service check', () => {
//     Const destinationAttributes = ['BANK_ACCOUNT', 'CREDIT_CARD_ACCOUNT', 'ACCOUNTS_PAYABLE', 'VENDOR'];
//     Const response = {
//       BANK_ACCOUNT: [],
//       CREDIT_CARD_ACCOUNT: [],
//       ACCOUNTS_PAYABLE: [],
//       VENDOR: [],
//       ACCOUNT: [],
//       TAX_CODE: []
//     };
//     Let responseKeys;
//     Let actualResponseKeys;
//     Service.getGroupedQBODestinationAttributes(destinationAttributes).subscribe((value) => {
//       ResponseKeys = Object.keys(response).sort();
//       ActualResponseKeys = Object.keys(value).sort();
//     });
//     Expect(actualResponseKeys).toEqual(responseKeys);
//     Const req = httpMock.expectOne({
//       Method: 'GET',
//       Url: `${API_BASE_URL}/workspaces/${workspace_id}/qbo/destination_attributes/?attribute_types=BANK_ACCOUNT,CREDIT_CARD_ACCOUNT,ACCOUNTS_PAYABLE,VENDOR`
//     });
//       Req.flush([]);
//   });

//   It('postmapping() service check', () => {
//     Const payload:MappingPost = {
//       Source_type: 'Payment',
//       Source_value: 'dummy',
//       Destination_type: 'Expence',
//       Destination_id: '1',
//       Destination_value: 'dummy'
//     };
//     Const destination:DestinationAttribute = {
//       Id: 1,
//       Attribute_type: 'VENDOR',
//       Display_name: 'Vendor',
//       Value: 'dummy',
//       Destination_id: '1',
//       Active: true,
//       Created_at: new Date(),
//       Updated_at: new Date(),
//       Workspace: +workspace_id,
//       Detail: {
//         Email: 'dummy@gmail.com',
//         Fully_qualified_name: 'Fyle'
//       }
//     };
//     Const response:EmployeeMapping = {
//       Id: 1,
//       Source_employee: {
//         Id: 1,
//         Attribute_type: 'VENDOR',
//         Display_name: 'Vendor',
//         Value: 'dummy',
//         Source_id: 1,
//         Auto_mapped: true,
//         Active: true,
//         Created_at: new Date(),
//         Updated_at: new Date(),
//         Workspace: +workspace_id,
//         Detail: {
//           Location: 'india',
//           Full_name: 'Fyle Integrations',
//           Department_id: '2',
//           Department: 'Integrations',
//           Department_code: 'FYI2',
//           Employee_code: 'FYIE1'
//         }
//       },
//       Destination_employee: destination,
//       Destination_vendor: destination,
//       Destination_card_account: destination,
//       Created_at: new Date(),
//       Updated_at: new Date(),
//       Workspace: +workspace_id
//     };

//     Service.postMapping(payload).subscribe((value) => {
//       Expect(value).toEqual(response);
//     });
//     Const req = httpMock.expectOne({
//       Method: 'POST',
//       Url: `${API_BASE_URL}/workspaces/${workspace_id}/mappings/`
//     });
//       Req.flush(response);
//   });

//   It('postEmployeemapping() service check', () => {
//     Const payload: EmployeeMappingPost ={
//       Source_employee: {
//         Id: 1
//       },
//       Destination_employee: {
//         Id: 1
//       },
//       Destination_vendor: {
//         Id: 1
//       },
//       Destination_card_account: {
//         Id: 1
//       },
//       Workspace: +workspace_id
//     };

//     Const destination:DestinationAttribute = {
//       Id: 1,
//       Attribute_type: 'VENDOR',
//       Display_name: 'Vendor',
//       Value: 'dummy',
//       Destination_id: '1',
//       Active: true,
//       Created_at: new Date(),
//       Updated_at: new Date(),
//       Workspace: +workspace_id,
//       Detail: {
//         Email: 'dummy@gmail.com',
//         Fully_qualified_name: 'Fyle'
//       }
//     };

//     Const response: EmployeeMapping = {
//       Id: 1,
//       Source_employee: {
//         Id: 1,
//         Attribute_type: 'VENDOR',
//         Display_name: 'Vendor',
//         Value: 'dummy',
//         Source_id: 1,
//         Auto_mapped: true,
//         Active: true,
//         Created_at: new Date(),
//         Updated_at: new Date(),
//         Workspace: +workspace_id,
//         Detail: {
//           Location: 'india',
//           Full_name: 'Fyle Integrations',
//           Department_id: '2',
//           Department: 'Integrations',
//           Department_code: 'FYI2',
//           Employee_code: 'FYIE1'
//         }
//       },
//       Destination_employee: destination,
//       Destination_vendor: destination,
//       Destination_card_account: destination,
//       Created_at: new Date(),
//       Updated_at: new Date(),
//       Workspace: +workspace_id
//     };
//     Service.postEmployeeMapping(payload).subscribe((value) => {
//       Expect(value).toEqual(response);
//     });
//     Const req = httpMock.expectOne({
//       Method: 'POST',
//       Url: `${API_BASE_URL}/workspaces/${workspace_id}/mappings/employee/`
//     });
//       Req.flush(response);
//   });

//   It('should post MappingSettings', () => {
//     Service.postMappingSettings(mappingSettingPayload).subscribe((value) => {
//       Expect(value).toEqual(postMappingSettingResponse);
//     });
//     Const req = httpMock.expectOne({
//       Method: 'POST',
//       Url: `${API_BASE_URL}/workspaces/${workspace_id}/mappings/settings/`
//     });

//     Req.flush(postMappingSettingResponse);
//   });

//   It('should delete MappingSettings', () => {
//     Service.deleteMappingSetting(11).subscribe((value) => {
//       Expect(value).toEqual({});
//     });
//     Const req = httpMock.expectOne({
//       Method: 'DELETE',
//       Url: `${API_BASE_URL}/workspaces/${workspace_id}/mappings/settings/11/`
//     });

//     Req.flush({});
//   });

//   It('should emit getMappingPagesForSideNavBar', () => {
//     Service.refreshMappingPages();
//     SpyOn(service.getMappingPagesForSideNavBar, 'emit');
//     Const req = httpMock.expectOne({
//       Method: 'GET',
//       Url: `${API_BASE_URL}/workspaces/${workspace_id}/mappings/settings/`
//     });

//     Req.flush({});
//     Expect(service.getMappingPagesForSideNavBar.emit).toHaveBeenCalled();
//   });

//   It('should emit walkThroughTooltip', () => {
//     SpyOn(service.showWalkThroughTooltip, 'emit');
//     Service.emitWalkThroughTooltip();
//     Expect(service.showWalkThroughTooltip.emit).toHaveBeenCalled();
//   });
// });
