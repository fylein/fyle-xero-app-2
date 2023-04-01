/// <reference types="cypress" />

import environment from '../../src/environments/environment.json';

declare global {
  namespace Cypress {
    interface Chainable {
      journeyLogin(): void;
      microActionLogin(): void;
      journeyLogin(): void;
      selectMatOption(optionName: string): void;
      getElement(attributeName: string): Cypress.Chainable<JQuery<HTMLElement>>;
      assertText(attributeName: string, text: string): void;
      setupHttpListeners(): void;
      waitForExportDetail(): void;
    }
  }
}

function setupInterceptor(method: 'GET' | 'POST', url: string, alias: string) {
  cy.intercept({
    method: method,
    url: `**${url}**`,
  }).as(alias);
}
// /api/workspaces/25/tasks/all
Cypress.Commands.add('setupHttpListeners', () => {
  // This helps cypress to wait for the http requests to complete with 200, regardless of the defaultCommandTimeout (10s)
  setupInterceptor('GET', '/tasks/all/', 'tasksPolling');
  setupInterceptor('GET', '/export_settings', 'getExportSettings');
  setupInterceptor('GET', '/tenants', 'getTenants');
  setupInterceptor('GET', '/import_settings', 'getImportSettings');
  setupInterceptor('GET', '/advanced_settings', 'getAdvancedSettings');
  setupInterceptor('GET', '/export_detail', 'exportDetail');
  setupInterceptor('POST', '/fyle/expense_groups/sync', 'syncExpenseGroups');

});

Cypress.Commands.add('selectMatOption', (optionName) => {
  cy.get('mat-option').contains(optionName).click();
});

Cypress.Commands.add('assertText', (attributeName: string, text: string) => {
  cy.getElement(attributeName).should('include.text', text)
})

Cypress.Commands.add('getElement', (attributeName: string) => {
  return cy.get(`[data-cy=${attributeName}]`);
})

Cypress.Commands.add('microActionLogin', () => {
  const user = {
    email: 'admin1@fyleforfylexero.in',
    refresh_token: environment.e2e_tests.secret[0].refresh_token,
    expires_in: 3600,
    full_name: "Anish",
    user_id: "xyz",
    org_id: environment.e2e_tests.secret[0].org_id,
    env: environment.e2e_tests.env,
    org_name: "XYZ Org"
  };
  window.localStorage.setItem('user', JSON.stringify(user))
  cy.setupHttpListeners();
})

Cypress.Commands.add('journeyLogin', () => {
  const user = {
    email: 'admin1@fyleforfyleXeroJourney.com',
    refresh_token: environment.e2e_tests.secret[1].refresh_token,
    access_token: environment.e2e_tests.secret[1].access_token,
    full_name: "Anish",
    user_id: "xyz",
    org_id: environment.e2e_tests.secret[1].org_id,
    env:environment.e2e_tests.env,
    org_name: "XYZ Org"
  };
  window.localStorage.setItem('user', JSON.stringify(user));
  window.localStorage.setItem('workspaceId', JSON.stringify(environment.e2e_tests.secret[1].workspace_id));
  window.localStorage.setItem('access_token', JSON.stringify(user.access_token));
  window.localStorage.setItem('refresh_token', JSON.stringify(user.refresh_token));
  cy.setupHttpListeners();
});
