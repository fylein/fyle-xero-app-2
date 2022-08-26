import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { OnboardingDoneComponent } from './onboarding-done.component';
import { Router } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('OnboardingDoneComponent', () => {
  let component: OnboardingDoneComponent;
  let fixture: ComponentFixture<OnboardingDoneComponent>;
  let router: Router;
  const routerSpy = { navigate: jasmine.createSpy('navigate'), url: '/path' };
  beforeEach(async () => {
    localStorage.setItem('user', JSON.stringify({org_id: 'dummy'}));
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientModule],
      declarations: [ OnboardingDoneComponent ],
      providers: [
        { provide: Router, useValue: routerSpy }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardingDoneComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('navigateToDashboard function check', () => {
    expect(component.navigateToDashboard()).toBeUndefined();
    fixture.detectChanges();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/workspaces/main/dashboard']);
  });
});
