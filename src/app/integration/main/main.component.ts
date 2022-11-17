import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { MappingSetting, MappingSettingResponse } from 'src/app/core/models/db/mapping-setting.model';
import { FyleField, MappingDestinationField, TenantFieldMapping } from 'src/app/core/models/enum/enum.model';
import { DashboardModule, DashboardModuleChild } from 'src/app/core/models/misc/dashboard-module.model';
import { MappingService } from 'src/app/core/services/misc/mapping.service';
import { ExpenseField } from '/Users/fyle/integrations/fyle-xero-app-2/src/app/core/models/misc/expense-field.model';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  isLoading: boolean = true;

  showWalkThroughTooltip: boolean;

  @ViewChild('walkthrough') walkthrough: ElementRef;

  modules: DashboardModule[] = [
    {
      name: 'Dashboard',
      route: 'dashboard',
      iconPath: 'assets/images/svgs/general/dashboard',
      childPages: [],
      isExpanded: false,
      isActive: false
    },
    {
      name: 'Export Log',
      route: 'export_log',
      iconPath: 'assets/images/svgs/general/export-log',
      childPages: [],
      isExpanded: false,
      isActive: false
    },
    {
      name: 'Mappings',
      route: 'mapping',
      iconPath: 'assets/images/svgs/general/mapping',
      isExpanded: false,
      isActive: false,
      childPages: []
    },
    {
      name: 'Configuration',
      route: 'configuration',
      iconPath: 'assets/images/svgs/stepper/configuration',
      isExpanded: false,
      isActive: false,
      childPages: [
        {
          name: 'Export Settings',
          route: 'configuration/export_settings',
          isActive: false
        },
        {
          name: 'Import Settings',
          route: 'configuration/import_settings',
          isActive: false
        },
        {
          name: 'Advanced Settings',
          route: 'configuration/advanced_settings',
          isActive: false
        }
      ]
    }
  ];

  mappingSettings: MappingSetting[];

  fyleFields: ExpenseField[];

  xeroFields: ExpenseField[];

  constructor(
    private renderer: Renderer2,
    private router: Router,
    private mappingService: MappingService
  ) {
    // Helps refresh sidenav bar on mapping setting change
    this.mappingService.getMappingPagesForSideNavBar.subscribe((mappingSettingResponse: MappingSettingResponse) => {
      this.setupMappingModules(mappingSettingResponse);
    });

    // Subscribe to the event that is emitted when custom mapping is created
    this.mappingService.showWalkThroughTooltip.subscribe(() => {
      this.showWalkThroughTooltip = true;
    });

    // Listen to clicks and auto hide the walkthrough tooltip
    this.renderer.listen('window', 'click', (e: Event) => {
      if (this.showWalkThroughTooltip && this.walkthrough?.nativeElement && e.target !== this.walkthrough?.nativeElement) {
        this.showWalkThroughTooltip = false;
      }
    });
  }

  navigate(module: DashboardModule | DashboardModuleChild): void {
    // Setting clicked module as active
    module.isActive = true;

    // Setting all other modules and child modules as inactive
    this.modules.forEach(m => {
      if (m.name !== module.name) {
        m.isActive = false;
        if (m.childPages) {
          m.childPages.forEach(c => {
            if (c.name !== module.name) {
              c.isActive = false;
            }
          });
        }
      }
    });

    // Set parent module as active if child module is clicked
    const parentModule = this.modules.find(m => m.childPages.find(c => c.name === module.name));
    if (parentModule) {
      parentModule.isActive = true;
    }

    if (module.name === 'Mappings' || module.name === 'Configuration') {
      module.isExpanded = !module.isExpanded;
    } else {
      this.router.navigate([`/workspaces/main/${module.route}`]);
    }
  }

  private markModuleActive(path: string): void {
    const route = path.split('/workspaces/main/')[1];
    if (typeof(route) === 'undefined') {
      this.router.navigate(['/workspaces/main/dashboard']);
    } else {
      // Filter module list to find the module that matches the route and mark it as active
      this.modules = this.modules.map(m => {
        if (m.childPages) {
          m.childPages.forEach(c => {
            if (c.route === route) {
              c.isActive = true;
              m.isActive = true;
              m.isExpanded = true;
            } else {
              c.isActive = false;
            }
          });
        }

        if (m.route === route) {
          m.isActive = true;
        }

        return m;
      });
    }

  }

  private setupMappingModules(mappingSettingResponse: MappingSettingResponse): void {
    this.modules[2].childPages = [
    {
      name: 'Employee Mapping',
      route: 'mapping/employee',
      isActive: false
    },
    {
      name: 'Category Mapping',
      route: 'mapping/category',
      isActive: false
    }];

    const sourceFieldRoutes: string[] = [`mapping/${FyleField.EMPLOYEE.toLowerCase()}`, `mapping/${FyleField.CATEGORY.toLowerCase()}`];
    const importedFieldsFromXero: string[] = [];
    mappingSettingResponse.results.forEach((mappingSetting: MappingSetting) => {
      if (mappingSetting.source_field !== TenantFieldMapping.TENANT && mappingSetting.source_field !== FyleField.EMPLOYEE && mappingSetting.source_field !== FyleField.CATEGORY && mappingSetting.source_field !== FyleField.TAX_GROUP && mappingSetting.source_field !== FyleField.CORPORATE_CARD) {
        if (mappingSetting.import_to_fyle) {
          importedFieldsFromXero.push(mappingSetting.destination_field);
        }
        sourceFieldRoutes.push(`mapping/${mappingSetting.source_field.toLowerCase()}`);
        this.modules[2].childPages.push({
          name: `${mappingSetting.source_field.toLowerCase()} Mapping`,
          route: `mapping/${mappingSetting.source_field.toLowerCase()}`,
          isActive: false
        });
      }
    });

    // Show Custom Mapping menu if atleast one Xero field is available to be mapped
    forkJoin([
      this.mappingService.getFyleExpenseFields(),
      this.mappingService.getXeroField()
    ]).subscribe(responses => {
      this.mappingSettings = mappingSettingResponse.results.filter((mappingSetting: MappingSetting) => {
        return (mappingSetting.destination_field !== MappingDestinationField.ACCOUNT && mappingSetting.destination_field !== MappingDestinationField.BANK_ACCOUNT && mappingSetting.destination_field !== MappingDestinationField.CONTACT && mappingSetting.destination_field !== MappingDestinationField.TAX_CODE);
      });
      this.fyleFields = responses[0].filter(field => {
        return !this.mappingSettings.some(mapping => mapping.source_field === field.attribute_type);
      });
      this.xeroFields = responses[1].filter((xeroField: ExpenseField) => {
        return !this.mappingSettings.some(mapping => mapping.destination_field === xeroField.attribute_type);
      });
      if ((this.xeroFields.length !== 0 && this.fyleFields.length !== 0) || importedFieldsFromXero.length !== this.mappingSettings.length) {
        this.modules[2].childPages.push({
          name: 'Custom Mapping',
          route: 'mapping/custom',
          isActive: false
        });
      }

      this.markModuleActive(this.router.url);
      this.isLoading = false;
    });
  }

  getSettingsAndSetupPage(): void {
      this.mappingService.getMappingSettings().subscribe((mappingSettingResponse: MappingSettingResponse) => {
      this.setupMappingModules(mappingSettingResponse);
    });
  }

  private setRouteWatcher(): void {
    this.getSettingsAndSetupPage();
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationStart) {
        const splitUrl = val.url.split('?');
        this.markModuleActive(splitUrl[0]);
      }
    });
  }

  ngOnInit(): void {
    this.setRouteWatcher();
  }

}
