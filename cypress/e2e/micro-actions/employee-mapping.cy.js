/// <reference types="cypress" />

describe('employee mapping', () => {
    beforeEach(() => {
      cy.microActionLogin()
      cy.visit('/')
    })
  
    it('in xero-app : check employee mapping', () => {
        cy.getElement('side-nav-bar')
        cy.assertText('mappings-text','Mappings')
        cy.getElement('side-nav-bar-click').contains('Mappings').click()
        cy.getElement('employee-mapping-text').contains('Employee Mapping').click()
        cy.getElement('arrow-back')
        cy.getElement('mapping-card').contains('Total Employees').click()
        cy.get('.mapping-header-section--card').contains('Unmapped Employees').click()
        cy.getElement('mapping-filter')
        cy.getElement('search-svg')
        cy.getElement('search-element').type('admin')
        cy.getElement('clear-icon-svg').click()
        cy.getElement('search-element').type('invalid')
        cy.getElement('zero-state-image')
        cy.getElement('clear-icon-svg').click
        cy.getElement('clear-icon-svg').click()
        cy.get('.mat-header-cell').contains('Employee in Fyle')
        cy.getElement('table-header-text').contains('Contact in Xero')
        cy.getElement('state-text').contains('State')
        cy.get('.mapping-table--state-pill-text').contains('Unmapped')
        cy.get('.mapping-table--form-field').eq(0).click()
        cy.getElement('mapping-option').eq(0).click()
    })
  })
  