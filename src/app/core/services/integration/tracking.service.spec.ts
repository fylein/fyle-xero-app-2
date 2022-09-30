import { TestBed } from '@angular/core/testing';
import { DeleteEvent, ErrorType, ProgressPhase } from '../../models/enum/enum.model';
import { DeleteEventAdditionalProperty, MappingAlphabeticalFilterAdditionalProperty, ResolveMappingErrorProperty } from '../../models/misc/tracking.model';

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

  it('onSignOut function check', () => {
    expect(service.onSignOut()).toBeUndefined();
  });

  it('onSwitchWorkspace function check', () => {
    expect(service.onSwitchWorkspace()).toBeUndefined();
  });

  it('onErrorResolve function check', () => {
    const properties: ResolveMappingErrorProperty = {
      resolvedCount: 0,
      totalCount: 0,
      unresolvedCount: 0,
      resolvedAllErrors: true,
      startTime: new Date(),
      endTime: new Date(),
      durationInSeconds: Math.floor((new Date().getTime() - new Date().getTime()) / 1000),
      errorType: ErrorType.CATEGORY_MAPPING
    };
    expect(service.onErrorResolve(properties)).toBeUndefined();
  });

  it('onMappingsAlphabeticalFilter function check', () => {
    const properties: MappingAlphabeticalFilterAdditionalProperty = {
      alphabetList: [],
      allSelected: false,
      page: 'onboarding'
    };
    expect(service.onMappingsAlphabeticalFilter(properties)).toBeUndefined();
  });

  it('onDeleteEvent function check', () => {
    const properties: DeleteEventAdditionalProperty = {
      source_field: 'import',
    destination_field: 'export'
    };
    expect(service.onDeleteEvent(DeleteEvent.CUSTOM_MAPPING, properties)).toBeUndefined();
  });

  it('onSwitchToOldApp function check', () => {
    expect(service.onSwitchToOldApp()).toBeUndefined();
  });

});
