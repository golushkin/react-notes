/* eslint-disable no-undef */
describe("user tests", () => {
    // it('test render', () => {
    //     cy.visit('/')
        
    //     cy.get('.sign-up-form').within(($form) =>{
    //         cy.contains(/sign up/i).should('be.disabled')
    //     })
    //     cy.contains(/already have an account/i)
    //     cy.contains(/sign in/i).click()

    //     cy.wait(1000)
    //     cy.get('.sign-in-form').within(($form) =>{
    //         cy.contains(/sign in/i).should('be.disabled')
    //     })
    //     cy.contains(/don't have an account/i)
    //     cy.contains(/sign up/i)
    // })

    it('test errors', () => {
        cy.visit('/')
        
        cy.get('.sign-up-form').within(($form) =>{
            cy.get('input[name="user"]').type('test')
            cy.contains(/sign up/i).should('be.disabled')
            cy.get('input[name="pass1"]').type('test')
            cy.contains(/sign up/i).should('be.disabled')
            cy.get('input[name="pass2"]').type('123')
            cy.contains(/sign up/i).should('be.disabled')
            cy.get('input[name="pass2"]').clear()
            cy.get('input[name="pass2"]').type('test')
            cy.contains(/sign up/i).should('be.enabled')
            cy.get('input[name="user"]').clear()
            cy.contains(/sign up/i).should('be.disabled')
        })
       
        cy.contains(/sign in/i).click()

        cy.wait(1000)
        cy.get('.sign-in-form').within(($form) =>{
            cy.get('input[name="user"]').type('test')
            cy.contains(/sign in/i).should('be.disabled')
            cy.get('input[name="pass"]').type('test')
            cy.contains(/sign in/i).should('be.enabled')
            cy.get('input[name="user"]').clear()
            cy.contains(/sign in/i).should('be.disabled')
        })
    })
})