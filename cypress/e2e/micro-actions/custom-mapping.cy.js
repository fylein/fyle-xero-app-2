/// <reference types="cypress" />

describe('Cost Center Mapping', () => {
    beforeEach(() => {
      cy.microActionLogin()
      cy.visit('/')
    })
  
    it('in xero-app : check cost center mapping', () => {
      cy.getElement('side-nav-bar-click').contains('Configuration').click()
      cy.getElement('employee-mapping-text').eq(1).click()
      cy.getElement('import-prompt').contains('Import Team from Xero')
      cy.getElement('toggle-form-field').eq(2).click()
      cy.assertText('form-field-text', 'Team in Xero')
      cy.getElement('select-field').click()
      cy.getElement('select-option').contains('Cost Center').click()
      cy.getElement('save-btn').contains('Save').click()
      cy.getElement('side-nav-bar-click').contains('Configuration').click()
      cy.getElement('side-nav-bar-click').contains('Mappings').click()
      cy.wait(1000)
      cy.getElement('employee-mapping-text').eq(2).click()
      cy.get('.mapping-header-section--card').contains('Unmapped Cost centers')
      cy.getElement('mapping-card').contains('Total Cost centers').click()
      cy.get('.mat-header-cell').contains('Cost center in Fyle')
      cy.getElement('table-header-text').contains('Team in Xero')
      cy.getElement('state-text').contains('State')
      cy.get('.mapping-table--state-pill-text').eq(0).then(($ele) => {
        expect($ele.text().trim()).to.be.oneOf(['Unmapped', 'Mapped'])
      })
      cy.get('.mapping-table--form-field').eq(0).click()
      cy.getElement('mapping-option').eq(0).click()
      cy.get('.mapping-table--state-pill-text').eq(0).contains('Mapped')
      cy.getElement('search-element').eq(0).type('invalid')
      cy.getElement('zero-state-image')
      cy.getElement('clear-icon-svg').click()
      cy.getElement('side-nav-bar-click').contains('Mappings').click()
      cy.getElement('side-nav-bar-click').contains('Configuration').click()
      cy.getElement('employee-mapping-text').eq(1).click()
      cy.getElement('toggle-form-field').eq(2).click()
      cy.getElement('save-btn').contains('Save').click()
      cy.getElement('side-nav-bar-click').contains('Configuration').click()
    })
  })
  