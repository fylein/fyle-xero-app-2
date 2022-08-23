import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DragDropModule } from '@angular/cdk/drag-drop';

// Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Pipes
import { TrimCharacterPipe } from './pipes/trim-character.pipe';
import { SearchPipe } from './pipes/search.pipe';
import { SnakeCaseToSpaceCase } from './pipes/snake-case-to-space-case.pipe';
import { ConfigurationSelectFieldComponent } from './components/configuration/configuration-select-field/configuration-select-field.component';
import { ConfigurationToggleFieldComponent } from './components/configuration/configuration-toggle-field/configuration-toggle-field.component';

// Components
import { LoaderComponent } from './components/core/loader/loader.component';
import { OnboardingStepperComponent } from './components/helpers/onboarding-stepper/onboarding-stepper.component';
import { ImportSettingsComponent } from './components/configuration/import-settings/import-settings.component';
import { ExportSettingsComponent } from './components/configuration/export-settings/export-settings.component';
import { AdvancedSettingsComponent } from './components/configuration/advanced-settings/advanced-settings.component';
import { OnboardingFooterComponent } from './components/core/onboarding-footer/onboarding-footer.component';
import { ConfigurationStepHeaderSectionComponent } from './components/configuration/configuration-step-header-section/configuration-step-header-section.component';
import { MandatoryFieldComponent } from './components/helpers/mandatory-field/mandatory-field.component';
import { SimpleTextSearchComponent } from './components/helpers/simple-text-search/simple-text-search.component';
import { XeroConnectorComponent } from './components/configuration/xero-connector/xero-connector.component';
import { ExpenseFieldCreationDialogComponent } from './components/configuration/import-settings/expense-field-creation-dialog/expense-field-creation-dialog.component';
import { ConfigurationStepFooterSectionComponent } from './components/configuration/configuration-step-footer-section/configuration-step-footer-section.component';
import { HeaderComponent } from './components/core/header/header.component';
import { ZeroStateWithIllustrationComponent } from './components/core/zero-state-with-illustration/zero-state-with-illustration.component';
import { PaginatorComponent } from './components/helpers/paginator/paginator.component';
// Import { MappingHeaderSectionComponent } from './components/mapping/mapping-header-section/mapping-header-section.component';
// Import { MappingFilterComponent } from './components/mapping/mapping-filter/mapping-filter.component';
// Import { MappingTableComponent } from './components/mapping/mapping-table/mapping-table.component';
// Import { GenericMappingComponent } from './components/mapping/generic-mapping/generic-mapping.component';
// Import { ExportLogTableComponent } from './components/export-log/export-log-table/export-log-table.component';
import { DashboardHeaderSectionComponent } from './components/dashboard/dashboard-header-section/dashboard-header-section.component';
import { DashboardResolveMappingErrorDialogComponent } from './components/dashboard/dashboard-resolve-mapping-error-dialog/dashboard-resolve-mapping-error-dialog.component';
import { DashboardExportLogDialogComponent } from './components/dashboard/dashboard-export-log-dialog/dashboard-export-log-dialog.component';
import { DashboardXeroErrorDialogComponent } from './components/dashboard/dashboard-xero-error-dialog/dashboard-xero-error-dialog.component';
// Import { ExportLogChildTableComponent } from './components/export-log/export-log-child-table/export-log-child-table.component';
import { PreviewDialogComponent } from './components/configuration/preview-dialog/preview-dialog.component';
import { ConfirmationDialogComponent } from './components/core/confirmation-dialog/confirmation-dialog.component';
import { MandatoryErrorMessageComponent } from './components/helpers/mandatory-error-message/mandatory-error-message.component';
import { AddEmailDialogComponent } from './components/configuration/advanced-settings/add-email-dialog/add-email-dialog.component';
import { EmailMultiSelectFieldComponent } from './components/configuration/email-multi-select-field/email-multi-select-field.component';

@NgModule({
  declarations: [
    ImportSettingsComponent,
    ExportSettingsComponent,
    AdvancedSettingsComponent,
    LoaderComponent,
    OnboardingStepperComponent,
    OnboardingFooterComponent,
    ConfigurationStepHeaderSectionComponent,
    MandatoryFieldComponent,
    SimpleTextSearchComponent,
    XeroConnectorComponent,
    TrimCharacterPipe,
    SearchPipe,
    SnakeCaseToSpaceCase,
    ExpenseFieldCreationDialogComponent,
    ConfigurationStepFooterSectionComponent,
    ConfigurationSelectFieldComponent,
    ConfigurationToggleFieldComponent,
    HeaderComponent,
    ZeroStateWithIllustrationComponent,
    PaginatorComponent,
    // MappingHeaderSectionComponent,
    // MappingFilterComponent,
    // MappingTableComponent,
    // GenericMappingComponent,
    // ExportLogTableComponent,
    DashboardHeaderSectionComponent,
    DashboardResolveMappingErrorDialogComponent,
    DashboardExportLogDialogComponent,
    DashboardXeroErrorDialogComponent,
    // ExportLogChildTableComponent,
    PreviewDialogComponent,
    ConfirmationDialogComponent,
    ConfirmationDialogComponent,
    MandatoryErrorMessageComponent,
    AddEmailDialogComponent,
    EmailMultiSelectFieldComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    DragDropModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatButtonModule,
    MatDialogModule,
    MatTooltipModule,
    MatTableModule,
    MatProgressSpinnerModule
  ],
  exports: [
    LoaderComponent,
    OnboardingStepperComponent,
    XeroConnectorComponent,
    ImportSettingsComponent,
    ExportSettingsComponent,
    AdvancedSettingsComponent,
    ConfigurationStepHeaderSectionComponent,
    SimpleTextSearchComponent,
    MandatoryFieldComponent,
    OnboardingFooterComponent,
    TrimCharacterPipe,
    SearchPipe,
    SnakeCaseToSpaceCase,
    ConfigurationStepFooterSectionComponent,
    ConfigurationSelectFieldComponent,
    ConfigurationToggleFieldComponent,
    HeaderComponent,
    ZeroStateWithIllustrationComponent,
    PaginatorComponent,
    // MappingHeaderSectionComponent,
    // MappingFilterComponent,
    // MappingTableComponent,
    // GenericMappingComponent,
    // ExportLogTableComponent,
    DashboardHeaderSectionComponent,
    DashboardResolveMappingErrorDialogComponent,
    // ExportLogChildTableComponent,
    MandatoryErrorMessageComponent
  ],
  providers: []
})
export class SharedModule { }
