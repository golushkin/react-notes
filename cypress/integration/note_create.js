/* eslint-disable no-undef */

describe("note edit tests", () => {
    beforeEach(() => {
        cy.visit('/home')
        cy.get('.sidebar').contains(/create note/i).click()
    })
    it('test render', () => {
        cy.visit('/home')
        cy.get('.sidebar').contains(/create note/i).click()
        cy.url().should('include', '/create')
        cy.get('input').should('have.value', '')
        cy.get('textarea').should('have.value', '')
        cy.contains(/create new link/i)
        cy.contains(/cancel/i)
        cy.contains(/save/i).should('be.disabled')
    })

    it('test cancel', () => {
        cy.contains(/cancel/i).click().then(()=>{
            cy.url().should('include', '/home')
        })
    })

    it('test errors', () => {
        const title = 'input[name="title"]'
        const save = /save/i
        const new_link = /create new/i
        const link = 'ul > li input'

        cy.get(title).clear()
        cy.contains(save).should('be.disabled')

        cy.get(title).type('Test')
        cy.contains(save).should('be.enabled')

        cy.contains(new_link).click().then(()=>{
            cy.contains(save).should('be.disabled')
        }).then(()=>{
            cy.get(link).last().type('https://localhost.com/')
            cy.contains(save).should('be.enabled')
        }).then(()=>{
            cy.get(title).clear()
            cy.contains(save).should('be.disabled')
    
            cy.get(title).type('Test')
            cy.contains(save).should('be.enabled')
        }) 
    })



    it('test save: title', () => {
        const title = "input[name='title']"
        const save = /save/i

        cy.get(title).type('Test')
        cy.contains(save).click()
        cy.url().should('include', '/home')
        cy.get('.display').contains('Test')
    })

    it('test save: title, link', () => {
        const title = "input[name='title']"
        const links = "input[name='link']"
        const create_link = /create new link/i
        const href = 'https://docs.cypress.io/api/commands/last.html#Syntax'
        const save = /save/i

        cy.get(title).type('Test1')
        cy.contains(create_link).click()
        cy.get(links).first().type(href)

        cy.contains(save).click()
        cy.url().should('include', '/home')
        cy.get('.display').contains('Test1')
        cy.get(`.display a[href='${href}'`).should('exist')
    })

    it('test create deep note: title, link', () => {
        const title = "input[name='title']"
        const links = "input[name='link']"
        const href = 'https://docs.cypress.io/api/commands/last.html#Syntax'
        const save_btn = /save/i
        const link_btn = /create/i
        
        cy.get('input').first().type('spe')
        cy.contains(/speaking/i).click()

        cy.get(title).type('Test1')
        cy.contains(link_btn).click()
        cy.get(links).first().type(href)

        cy.contains(save_btn).click()
        cy.url().should('include', '/home')
        cy.get('.display').contains('Test1')
        cy.get(`.display a[href='${href}'`).should('exist')
        cy.get('.sidebar').contains('speaking')
            .parent().siblings('ul').contains('Test1')
    })

})