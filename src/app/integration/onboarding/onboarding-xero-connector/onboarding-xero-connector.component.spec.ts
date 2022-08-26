import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardingXeroConnectorComponent } from './onboarding-xero-connector.component';

describe('OnboardingQboConnectorComponent', () => {
  let component: OnboardingXeroConnectorComponent;
  let fixture: ComponentFixture<OnboardingXeroConnectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnboardingXeroConnectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardingXeroConnectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
