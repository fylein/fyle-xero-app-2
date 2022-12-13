/// <reference types="cypress" />

describe('auth logout', () => {
    beforeEach(() => {
      cy.login()
      cy.visit('/')
    })
  
    it('in xero-app : check logo/Home-text/username then log out', () => {
        cy.getElement('nav-bar')
        cy.getElement('nav-bar-logo-section')
        cy.getElement('nav-bar-fyle-logo')
        cy.getElement('nav-bar-xero-logo')
        cy.getElement('user-profile-section')
        cy.getElement('profile-dropdown').click()
        cy.getElement('signout-text').click()
        cy.url().should('include', '/auth/login')
    })
  })
  