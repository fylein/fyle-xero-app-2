/// <reference types="cypress" />

describe('Onboarding journey', () => {
    beforeEach(() => {
      cy.journeyLogin()
      cy.visit('/')
    })

    function assertXeroConnector() {
        cy.assertText('connect-to-xero-tenant-text', 'Connect to Xero Tenant');
        cy.assertText('header-sub-text', 'Connect to the Xero Tenant from which you would like to import and export data. The Fyle org and Xero Tenant cannot be changed once the configuration steps are complete.');
        cy.getElement('disconnect-image');
        cy.assertText('not-org-text', 'Not the organization that you wish to connect?');
        cy.assertText('switch-org-text', 'Switch Organization');
        cy.assertText('xero-tenant-text', 'XERO TENANT');
        cy.assertText('select-tenant-to-proceed-text', 'You will need to select a tenant to proceed with the onboarding.');
        cy.wait('@getTenants').its('response.statusCode').should('equal', 200)
        cy.getElement('select-tenant-form-field').click();
        cy.getElement('fyle-tenant-option').click();
        cy.getElement('save-and-continue-btn').click();
    }

    function assertExportSettings() {
      cy.wait('@getExportSettings').its('response.statusCode').should('equal', 200)
      cy.url().should('include', '/workspaces/onboarding/export_settings');
      cy.assertText('connect-to-xero-tenant-text', 'Export Settings');
      cy.assertText('header-sub-text', 'In this section, you will configure how and when expenses from Fyle can be exported to Xero.');
      cy.assertText('configuration-reimbursable-expense-toggle', 'Export Reimbursable Expenses');
      cy.assertText('configuration-reimbursable-expense-toggle', 'Enable this to export the reimbursable expenses from Fyle. If not enabled, any out-of-pocket expenses will not be exported to Xero.');
      cy.get('[data-cy="toggle-field"]').eq(0).within(() => {
        cy.get('.configuration--toggle-form-field').click();
      });
      cy.getElement('select-field').eq(0).click();
      cy.get('.mat-select-panel').within(() => {
        cy.get('.mat-option').eq(0).contains('None');
        cy.get('.mat-option').eq(2).contains('Employee email on Fyle to contact email on Xero');
        cy.get('.mat-option').eq(1).contains('Employee name on Fyle to contact name on Xero').click();
      });
      cy.assertText('autoMap-sub-text','Example: Ryan Clark will map to Ryan Clark in Xero.');
      cy.getElement('select-field').eq(2).click();
      cy.get('.mat-select-panel').within(() => {
        cy.get('.mat-option').eq(1).contains('Verification Date');
        cy.get('.mat-option').eq(2).contains('Spend Date');
        cy.get('.mat-option').eq(3).contains('Approval Date');
        cy.get('.mat-option').eq(4).contains('Last Spend Date');
        cy.get('.mat-option').eq(0).contains('Current Date').click();
      });
      cy.getElement('select-field').eq(3).click();
      cy.get('.mat-select-panel').within(() => {
        cy.get('.mat-option').eq(1).contains('Paid');
        cy.get('.mat-option').eq(0).contains('Payment Processing').click();
      });
      cy.assertText('corporate-credit-card-expense-toggle', 'Export Corporate Card Expenses Enable this to export the corporate card expenses from Fyle. If not enabled, any expenses Paid by Corporate Card will not be exported to Xero.');
      cy.getElement('save-and-continue-btn').click();
    }

    function assertImportSettings() {
      cy.wait('@getImportSettings').its('response.statusCode').should('equal', 200)
      cy.url().should('include', '/workspaces/onboarding/import_settings')
      cy.assertText('connect-to-xero-tenant-text', 'Import Settings');
      cy.assertText('header-sub-text', 'You can Enable all the data that you wish to import from Xero. All the imported data from Xero would be available in Fyle under Admin Setting > Organization.');
      cy.get('[data-cy="toggle-field"]').eq(1).within(() => {
        cy.get('.configuration--toggle-form-field').click();
      });
      cy.getElement('save-and-continue-btn').click();
    }

    function assertAdvancedSettings() {
      cy.wait('@getAdvancedSettings').its('response.statusCode').should('equal', 200)
      cy.url().should('include', '/workspaces/onboarding/advanced_settings')
      cy.assertText('connect-to-xero-tenant-text', 'Advanced Settings');
      cy.getElement('save-and-continue-btn').click();
    }

    function assertOnboardingComplete() {
      cy.url().should('include', '/workspaces/onboarding/done')
      cy.assertText('completion-prompt','Congratulations! Your integration setup is now complete.');
      cy.getElement('launch-cta').click();
    }

    function assertDashboard() {
      cy.url().should('include', '/workspaces/main/dashboard')
      cy.assertText('export-prompt', 'Click on Export to start exporting expenses from Fyle as Xero transactions.');
      cy.getElement('export-btn').click();
      cy.wait('@tasksPolling').its('response.statusCode').should('equal', 200)
      cy.wait('@exportDetail')
      cy.get('.errors--mapping-error-contents:contains("Category Mapping errors") .errors--resolve-btn').click();
      cy.getElement('resolve-form-field').eq(0).click();
      cy.get('.mat-select-panel input').type('Office Expenses');
      cy.get('.mat-select-panel .mat-option-text').contains('Office Expenses').click()
      cy.getElement('resolve-form-field').eq(1).click();
      cy.get('.mat-select-panel input').type('Wages Payable');
      cy.get('.mat-select-panel .mat-option-text').contains('Wages Payable').click()
      cy.getElement('resolve-form-field').eq(2).click();
      cy.get('.mat-select-panel input').type('General Expenses');
      cy.get('.mat-select-panel .mat-option-text').contains('General Expenses').click()
      cy.getElement('close-resolve-dialog').click();
      cy.get('.errors--mapping-error-contents:contains("Employee Mapping errors") .errors--resolve-btn').click();
      cy.getElement('resolve-form-field').eq(0).click();
      cy.get('.mat-select-panel input').type('Brian');
      cy.get('.mat-select-panel .mat-option-text').contains('Brian Foster').click()
      cy.getElement('resolve-form-field').eq(1).click();
      cy.get('.mat-select-panel input').type('Ashwin');
      cy.get('.mat-select-panel .mat-option-text').contains('Ashwin').click()
      cy.getElement('close-resolve-dialog').click();
      cy.getElement('export-btn').click();
      cy.wait('@tasksPolling').its('response.statusCode').should('equal', 200)
      cy.get('.past-export--view-expense').then(($failedExports) => {
        const failedExportsCount = parseInt($failedExports.text().trim());
        if (failedExportsCount > 0) {
          cy.wait('@tasksPolling').its('response.statusCode').should('equal', 200)
          cy.wait('@exportDetail')
          cy.assertText('xero-error-text','Xero Errors');
          cy.assertText('xero-error-sub-text','Resolve these errors on your Xero Account before trying to re-export them again.');
          cy.getElement('side-nav-bar-click').contains('Mappings').click()
          cy.getElement('employee-mapping-text').contains('Category Mapping').click()
          cy.getElement('search-element').type('Food'); 
          cy.getElement('mapping-field-option').eq(0).click();
          cy.get('.mat-select-panel input').type('Cost of Goods Sold');
          cy.get('.mat-select-panel .mat-option-text').contains('Cost of Goods Sold').click()
          cy.getElement('clear-icon-svg').click()
          cy.getElement('search-element').type('Office Supplies'); 
          cy.getElement('mapping-field-option').eq(0).click();
          cy.get('.mat-select-panel input').type('Office Expenses');
          cy.get('.mat-select-panel .mat-option-text').contains('Office Expenses').click()
          cy.getElement('clear-icon-svg').click()
          cy.getElement('search-element').type('Others'); 
          cy.getElement('mapping-field-option').eq(0).click();
          cy.get('.mat-select-panel input').type('General Expenses');
          cy.get('.mat-select-panel .mat-option-text').contains('General Expenses').click()
          cy.getElement('side-nav-bar-click').contains('Dashboard').click()
          cy.getElement('export-btn').click();
          cy.wait('@tasksPolling').its('response.statusCode').should('equal', 200)
        }
      });
      cy.wait('@tasksPolling').its('response.statusCode').should('equal', 200)
      cy.wait('@exportDetail')
      cy.wait('@syncExpenseGroups').its('response.statusCode').should('equal', 200)
      cy.wait('@tasksPolling').its('response.statusCode').should('equal', 200)
      cy.assertText('successful-export', 'Congratulations, you are winning!');
      cy.assertText('successful-export-prompt', 'You exports did not face any error. If they do, you can resolve them right here and re-export successfully.');
    }

    it('in xero-app : journey', () => {
      assertXeroConnector();
      assertExportSettings();
      assertImportSettings();
      assertAdvancedSettings();
      assertOnboardingComplete();
      assertDashboard();
    })
  })
  