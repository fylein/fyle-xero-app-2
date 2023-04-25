import { TestBed } from '@angular/core/testing';

import { CloneSettingService } from './clone-setting.service';

describe('CloneSettingService', () => {
  let service: CloneSettingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CloneSettingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
