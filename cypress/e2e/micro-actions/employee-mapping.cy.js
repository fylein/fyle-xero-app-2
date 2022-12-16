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
        // cy.get('.side-nav-bar--module-block-text-inner').within(() => {
        //     cy.get('.p-ripple').eq(0).contains('20 Items').click()
        //   })
    })
  })
  