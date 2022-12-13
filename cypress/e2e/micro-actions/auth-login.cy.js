/// <reference types="cypress" />

describe('auth login', () => {
    beforeEach(() => {
      cy.visit('/')
    }) 
  
    it('loads xero app', () => {
      cy.url().should('include', '/auth/login')
      cy.getElement('fyle-logo')
      cy.assertText('login-header',"Fyle Xero Integration")
      cy.assertText('signin-button', "Signin With FYLE")
    })
  })
  