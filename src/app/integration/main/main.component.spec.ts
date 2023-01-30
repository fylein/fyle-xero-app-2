import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router, NavigationStart, RouterEvent } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, ReplaySubject } from 'rxjs';
import { MappingService } from 'src/app/core/services/misc/mapping.service';
import { MainComponent } from './main.component';
import { fyleExpenseFields2, mappingSettingResponse, modules } from './main.fixture';
import { SnakeCaseToSpaceCase } from '../../shared/pipes/snake-case-to-space-case.pipe';
import { Renderer2, Type } from '@angular/core';
import { By } from '@angular/platform-browser';
import { fyleExpenseFields, xeroField } from './mapping/custom-mapping/custom-mapping.fixture';
import { exportResponse } from 'src/app/shared/components/configuration/export-settings/export-settings.fixture';
import { ExportSettingService } from 'src/app/core/services/configuration/export-setting.service';

describe('MainComponent', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;
  let router: Router;
  let mappingService: MappingService;
  let exportSettingService: ExportSettingService;
  let renderer2: Renderer2;
  const eventSubject = new ReplaySubject<RouterEvent>(1);
  const routerSpy = { navigate: jasmine.createSpy('navigate'), url: '/onboarding', events: eventSubject.asObservable() };
  beforeEach(async () => {
    const service1 = {
      getMappingSettings: () => of(mappingSettingResponse),
      refreshMappingPages: () => undefined,
      getFyleExpenseFields: () => of(fyleExpenseFields),
      getXeroField: () => of(xeroField),
      getMappingPagesForSideNavBar: of(mappingSettingResponse),
      showWalkThroughTooltip: of(undefined)
    };
    const service3 = {
      getExportSettings: () => of(exportResponse)
    };

    const event = new Event('click', {});
    const service2 = {
      listen: () => of({event})
    };
    await TestBed.configureTestingModule({
      imports: [ RouterTestingModule, HttpClientModule, NoopAnimationsModule ],
      declarations: [ MainComponent, SnakeCaseToSpaceCase ],
      providers: [
        { provide: MappingService, useValue: service1 },
        { provide: Router, useValue: routerSpy},
        { provide: Renderer2, useValue: service2},
        { provide: ExportSettingService, useValue: service3 }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainComponent);
    component = fixture.componentInstance;
    renderer2 = fixture.componentRef.injector.get<Renderer2>(Renderer2 as Type<Renderer2>);
    router = TestBed.inject(Router);
    mappingService = TestBed.inject(MappingService);
    exportSettingService = TestBed.inject(ExportSettingService);
    fixture.detectChanges();
  });

  it('should create', () => {
    spyOn(mappingService, 'getFyleExpenseFields').and.returnValue(of(fyleExpenseFields2));
    spyOn(mappingService, 'getXeroField').and.returnValue(of(fyleExpenseFields2));
    expect(component.ngOnInit()).toBeUndefined();
  });

  it('ngOnInit function check', () => {
    spyOn(component, 'getSettingsAndSetupPage').and.callThrough();
    expect(component.ngOnInit()).toBeUndefined();
    eventSubject.next(new NavigationStart(1, '/workspaces/main/'));
    fixture.detectChanges();
    expect(component.getSettingsAndSetupPage).toHaveBeenCalled();
  });

  it('ngOnInit function check', () => {
    spyOn(component, 'getSettingsAndSetupPage').and.callThrough();
    expect(component.ngOnInit()).toBeUndefined();
    eventSubject.next(new NavigationStart(1, '/workspaces/main/configuration/export_settings'));
    fixture.detectChanges();
    expect(component.getSettingsAndSetupPage).toHaveBeenCalled();
  });

  it('ngOnInit function check', () => {
    spyOn(component, 'getSettingsAndSetupPage').and.callThrough();
    expect(component.ngOnInit()).toBeUndefined();
    eventSubject.next(new NavigationStart(1, '/workspaces/main/configuration'));
    fixture.detectChanges();
    expect(component.getSettingsAndSetupPage).toHaveBeenCalled();
  });

  it('Navigate function check', () => {
    expect(component.navigate(modules[0])).toBeUndefined();
    fixture.detectChanges();
    expect(router.navigate).toHaveBeenCalledWith([`/workspaces/main/${modules[0].route}`]);
  });

  it('Navigate function check', () => {
    expect(component.navigate(modules[2])).toBeUndefined();
    fixture.detectChanges();
    expect(modules[2].isExpanded).toBeFalse();
  });

  it('Navigate function check', () => {
    expect(component.navigate(modules[3])).toBeUndefined();
    fixture.detectChanges();
    expect(modules[3].isExpanded).toBeTrue();
  });

  it('setupMappingPages function check', () => {
    spyOn(mappingService, 'getMappingSettings').and.callThrough();
    expect(component.getSettingsAndSetupPage()).toBeUndefined();
    fixture.detectChanges();
    expect(mappingService.getMappingSettings).toHaveBeenCalled();
  });

  it('should hide showWalkThroughTooltip on close icon click', () => {
    component.showWalkThroughTooltip = true;
    fixture.detectChanges();
    const closeIcon = fixture.debugElement.query(By.css('.walk-through-tooltip--close-icon'));
    closeIcon.nativeElement.click();
    fixture.detectChanges();
    expect(component.showWalkThroughTooltip).toBeFalse();
  });

  it('should hide showWalkThroughTooltip on random clicks', () => {
    component.showWalkThroughTooltip = true;
    fixture.detectChanges();
    const closeIcon = fixture.debugElement.query(By.css('.side-nav-bar--text-properties'));
    closeIcon.nativeElement.click();
    fixture.detectChanges();
    expect(component.showWalkThroughTooltip).toBeFalse();
  });

  it('should show showWalkThroughTooltip on mapping refresh', () => {
    spyOn(mappingService, 'showWalkThroughTooltip').and.callThrough();
    fixture.detectChanges();
    expect(component.showWalkThroughTooltip).toBeTrue();
  });
});
