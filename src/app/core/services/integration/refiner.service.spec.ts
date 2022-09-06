import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { compare } from '@rxweb/reactive-form-validators';
import { of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RefinerSurveyType } from '../../models/enum/enum.model';
import { UserService } from '../misc/user.service';
import { WorkspaceService } from '../workspace/workspace.service';

import { RefinerService } from './refiner.service';

describe('RefinerService', () => {
  let service: RefinerService;
  const user = {
    access_token: "fyle",
    email: "sravan.kumar@fyle.in",
    full_name: "sravan k",
    org_id: "orunxXsIajSE",
    org_name: "Test Sample Statement - GBP",
    refresh_token: "fyle",
    user_id: "ust5Ga9HC3qc"
  };
  beforeEach(() => {
    const service2 = {
      getUserProfile: () => of(user)
    };
    const service1 = {
      getWorkspaceId: () => +environment.tests.workspaceId
    };
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        RefinerService,
        { provide: UserService, useValue: service2 },
        { provide: WorkspaceService, useValue: service1 }
      ]
    });
    service = TestBed.inject(RefinerService);
    (window as any)._refiner = () => {
      return undefined;
    };
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('triggerSurvey function check', () => {
    // (window as any)._refiner = 'ioiooioioio';
    expect(service.triggerSurvey(RefinerSurveyType.EXPORT_DONE)).toBeUndefined();
    expect(service.triggerSurvey(RefinerSurveyType.ONBOARDING_DONE)).toBeUndefined();
  });
});
