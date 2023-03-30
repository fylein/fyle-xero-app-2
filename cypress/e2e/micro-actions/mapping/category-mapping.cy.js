/// <reference types="cypress" />

describe('category mapping', () => {
    beforeEach(() => {
      cy.microActionLogin()
      cy.visit('/')
    })
  
    it('in xero-app : check category mapping', () => {
        cy.getElement('side-nav-bar-click').contains('Mappings').click()
        cy.getElement('employee-mapping-text').contains('Category Mapping').click()
        cy.get('.mapping-header-section--card').contains('Unmapped Categories')
        cy.getElement('mapping-card').contains('Total Categories').click()
        cy.getElement('search-element').type('bill')
        cy.getElement('clear-icon-svg').click()
        cy.getElement('search-element').type('invalid')
        cy.getElement('zero-state-image')
        cy.getElement('clear-icon-svg').click()
        cy.get('.mat-header-cell').contains('Category in Fyle')
        cy.getElement('table-header-text').contains('Account in Xero')
        cy.getElement('state-text').contains('State')
        cy.get('.mapping-table--state-pill-text').eq(0).then(($ele) => {
          expect($ele.text().trim()).to.be.oneOf(['Unmapped', 'Mapped'])
        })
        cy.get('.mapping-table--form-field').eq(0).click()
        cy.getElement('mapping-option').eq(0).click()
        cy.get('.mapping-table--state-pill-text').eq(0).contains('Mapped')
    })
  })
  