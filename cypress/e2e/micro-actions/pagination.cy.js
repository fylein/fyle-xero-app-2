/// <reference types="cypress" />

describe('pagination', () => {
    beforeEach(() => {
      cy.microActionLogin()
      cy.visit('/')
    })
  
    it('in xero-app : check pagination in employee mapping', () => {
        cy.getElement('side-nav-bar')
        cy.assertText('mappings-text','Mappings')
        cy.getElement('side-nav-bar-click').contains('Mappings').click()
        cy.getElement('employee-mapping-text').contains('Category Mapping').click()
        cy.get('.paginator--page-info').contains('Page')
        cy.get('.paginator--page-size-text').contains('Show')
        cy.get('.paginator--page-size-input-field').click()
        cy.get('mat-option').contains('500')
        cy.get('mat-option').eq(3).contains('200')
        cy.get('mat-option').eq(2).contains('100')
        cy.get('mat-option').eq(1).contains('50')
        cy.get('mat-option').eq(0).contains('25').click()
        cy.get('.paginator--page-text').contains('Page')
        cy.get('.paginator--page-action-box').eq(2).click()
        cy.get('.paginator--page-action-box').eq(0).click()
    })
  })
  