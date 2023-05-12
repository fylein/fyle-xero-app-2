import { TestBed } from '@angular/core/testing';

import { CloneSettingService } from './clone-setting.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('CloneSettingService', () => {
  let service: CloneSettingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(CloneSettingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
