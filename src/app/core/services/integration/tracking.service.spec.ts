import { TestBed } from '@angular/core/testing';
import { ProgressPhase } from '../../models/enum/enum.model';

import { TrackingService } from './tracking.service';

describe('TrackingService', () => {
  let service: TrackingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrackingService);
    (window as any).analytics = {
      track: () => undefined,
      identify: () => undefined
    };
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('onXeroLanding function check', () => {
    expect(service.onXeroLanding(ProgressPhase.ONBOARDING)).toBeUndefined();
  });

  it('onXeroAccountDisconnect function check', () => {
    expect(service.onXeroAccountDisconnect()).toBeUndefined();
  });

  it('onDateFilter function check', () => {
    const property = {
      filterType: "existing",
      startDate: new Date(),
      endDate: new Date()
    };
    expect(service.onDateFilter({filterType: 'existing', startDate: new Date(), endDate: new Date()})).toBeUndefined();
  });

  it('onSignIn function check', () => {
    expect(service.onSignIn('fyle', 2, 'fyle', 'fyle')).toBeUndefined();
  });

  it('onSignUp function check', () => {
    expect(service.onSignUp('fyle', 2, 'fyle', 'fyle')).toBeUndefined();
  });
});
