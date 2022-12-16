/// <reference types="cypress" />

describe('employee mapping', () => {
    beforeEach(() => {
      cy.microActionLogin()
      cy.visit('/')
    })
  
    it('in xero-app : check employee mapping', () => {
        cy.getElement('side-nav-bar')
        cy.assertText('mappings-text','Mappings')
        cy.getElement('side-nav-bar-click').click({multiple:true})
    })
  })
  