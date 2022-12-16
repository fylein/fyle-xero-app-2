/// <reference types="cypress" />

describe('header', () => {
    beforeEach(() => {
      cy.microActionLogin()
      cy.visit('/')
    })
  
    it('in xero-app : check header', () => {
        cy.getElement('nav-bar-page-name')
        cy.getElement('nav-bar-help-icon')
        cy.getElement('nav-bar-help-text')
        cy.getElement('profile-dropdown').click()
        cy.getElement('profile-section')
        cy.getElement('profile-name')
        cy.getElement('profile-org-name')
        cy.assertText('switch-org-text','Switch Organization')
        cy.assertText('active-text','Active')
        cy.assertText('disconnect-text','Disconnect')
        cy.assertText('state-pill-text','Active')
        cy.getElement('profile-currency')
    })
  })
  