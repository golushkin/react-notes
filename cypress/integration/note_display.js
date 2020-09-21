/* eslint-disable no-undef */

describe("note display tests", ()=>{
    it('test render and routing', () => {
        cy.visit('/')
        cy.get('.display')
            .contains(/english/i)
        cy.get('.display')
            .contains(/Useful links for studing english/i)
        cy.get('.display')
            .contains(/speaking/i)
        cy.get('.display')
            .contains(/site/i)
        cy.get('.sidebar')
            .contains(/speaking/i)
            .click()
        cy.get('.display')
            .contains(/speaking/i)
    })
})