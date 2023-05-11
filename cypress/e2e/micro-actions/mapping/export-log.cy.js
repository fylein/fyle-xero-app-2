/// <reference types="cypress" />

describe('Export Log', () => {
    beforeEach(() => {
      cy.microActionLogin()
      cy.visit('/')
    })
  
    it('in xero-app : export-log', () => {
        cy.getElement('side-nav-bar-click').contains('Export Log').click()
        cy.assertText('nav-bar-page-name', 'Export Log')
        cy.getElement('search-element')
        cy.getElement('search-svg')
        cy.assertText('date-time-text', 'Date and Time of Export')
        cy.assertText('employee-text', 'Employee Name and ID')
        cy.assertText('expense-text', 'Expense Type')
        cy.assertText('ref-id-text', 'Reference ID')
        cy.assertText('exported-xero-text', 'Exported to Xero as')
        cy.assertText('link-to-text', 'Link to Xero')

        cy.get('.export-log-table--row').each((_, index, __) => {
            if (index < 40) {
      
                cy.get('.mat-column-fundSource').eq(index + 1).contains(/Credit Card|Reimbursable/g)
      
                cy.get('.mat-column-referenceID').eq(index + 1).contains(/C|E|P/)

                cy.get('.mat-column-exportType').eq(index + 1).contains(/Bill|Credit Card Purchase|Check|Journal Entry|Expense/g)
      
                cy.get('.mat-column-link').eq(index + 1).should('not.be.null')
            }
          })

          cy.get('.export-log--date-filter').eq(0).click()
          cy.selectMatOption('Custom dates')
          cy.get('.mat-calendar-period-button').click()
          cy.get('.mat-calendar-content').contains('2021').click()
          cy.get('.mat-calendar-table').contains('JAN').click()
      
          cy.get('.mat-calendar-body').contains('1').click()
          cy.get('.mat-calendar-body').contains('9').click()
          cy.get('.export-log--done-text').click()

      
          cy.get('.zero-state-with-illustration--zero-state-text').contains('Sorry, no results found!')
          cy.get('.zero-state-with-illustration--zero-state-text-small').contains('We could not find any exports done on timeline that you have selected')
          cy.getElement('clear-date-filter').click()
        cy.getElement('search-element').type('invalid')
        cy.getElement('zero-state-image')
        cy.getElement('clear-icon-svg').click()
    })
  })