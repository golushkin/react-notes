/* eslint-disable no-undef */

describe("note display tests", () => {
    beforeEach(() => {
        cy.visit('/')
        cy.get('.user-sign')
        cy.contains(/sign in/i).click()
        cy.wait(1000)
        cy.get('input[name="user"]').type('test')
        cy.get('input[name="pass"]').type('test')
        cy.contains(/sign in/i).click()
    })

    it('test render and routing', () => {
        cy.url().should('include', '/home')
        cy.contains(/choose note/i)
        cy.contains(/create note/i)
        cy.get('.sidebar').contains(/test/i).click()
        cy.get('.note').within(($note)=>{
            cy.contains(/test/i)
            cy.contains(/test desc/i)
            cy.contains(/notes/i)
            cy.contains(/test 2/i)
        })
        cy.get('.sidebar').contains(/test 2/i).click()
        cy.get('.sidebar').contains(/test 3/i)
        cy.get('.note').within(($note)=>{
            cy.contains(/test 2/i)
            cy.contains(/test desc/i)
            cy.contains(/notes/i)
            cy.contains(/test 3/i)
        })
        
    })
})