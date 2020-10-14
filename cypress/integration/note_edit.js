/* eslint-disable no-undef */

describe("note edit tests", () => {
    beforeEach(() => {
        cy.visit('/')
        cy.get('.user-sign')
        cy.contains(/sign in/i).click()
        cy.wait(1000)
        cy.get('input[name="user"]').type('test')
        cy.get('input[name="pass"]').type('test')
        cy.contains(/sign in/i).click()

        cy.get('.sidebar').contains(/create note/i).click()
        const title = "input[name='title']"
        const links = "input[name='link']"
        const desc = "textarea[name='desc']"
        const create_link = /create new link/i
        const href = 'https://docs.cypress.io/api/commands/last.html#Syntax'
        const save = /save/i

        cy.get(title).type('Test1')
        cy.get(desc).type('test desc')
        cy.contains(create_link).click()
        cy.get(links).first().type(href)

        cy.contains(save).click()
        cy.url().should('include', '/home')
        cy.get('.sidebar').contains('Test1').click()
    })

    it('test render', () => {
        cy.get('#edit-btn')
            .click()
        cy.url().should('include', 'edit/1')

        cy.get('form').within(($form) => {
            console.log($form);
            cy.get('input[name="title"]')
                .should('have.value', 'Test1')
            cy.get('textarea[name="desc"]')
                .should('have.value', 'test desc')
            cy.get('input[name="link"]').first()
                .should('have.value', 'https://docs.cypress.io/api/commands/last.html#Syntax')
            cy.contains(/create new link/i)
            cy.contains(/cancel/i)
            cy.contains(/update/i)
            cy.contains(/delete note/i)
        })
    })

    it('test errors', () => {
        const title = 'input[name="title"]'
        const upd_btn = /update/i
        const new_link = /create new/i
        const link = 'ul > li input'

        cy.get('#edit-btn').click()
        cy.get(title).clear()
        cy.contains(upd_btn).should('be.disabled')

        cy.get(title).type('Test')
        cy.contains(upd_btn).should('be.enabled')

        cy.get(link).clear()
        cy.contains(upd_btn).should('be.disabled')

        cy.get(link).each((el, i, col)=>{
            cy.wrap(el).type('https://localhost.com/')
        }).then(()=>{
            cy.contains(upd_btn).should('be.enabled')
        })
        cy.contains(new_link).click()
        cy.contains(upd_btn).should('be.disabled')
        cy.get(link).last().type('https://localhost.com/')
        cy.contains(upd_btn).should('be.enabled')
    })

    it('test cancel', () => {
        cy.get('#edit-btn')
            .click()

        cy.contains(/cancel/i).click()
        cy.url().should('include', '/home')
    })

    it('test edit: title', () => {
        cy.get('#edit-btn').click()

        const title = "input[name='title']"
        const upd_btn = /update/i

        cy.get(title).clear()
        cy.get(title).type('Test2')
        cy.contains(upd_btn).click()
        cy.url().should('include', '/home')
        cy.get('.sidebar').contains('Test2')
    })

    it('test edit: title, link', () => {
        cy.get('#edit-btn').click()

        const title = "input[name='title']"
        const links = "input[name='link']"
        const href = 'https://docs.cypress.io/api/commands/last.html#Syntax'
        const upd_btn = /update/i

        cy.get(title).clear()
        cy.get(title).type('Test2')

        cy.get(links).first().clear()
        cy.get(links).first().type(href)

        cy.contains(upd_btn).click()
        cy.url().should('include', '/home')
        cy.get('.sidebar').contains('Test2').click()
        cy.get(`.display a[href='${href}'`).should('exist')
    })

    it('test edit: title, link and new link', () => {
        cy.get('#edit-btn').click()

        const title = "input[name='title']"
        const links = "input[name='link']"
        const href = 'https://docs.cypress.io/api/commands/last.html#Syntax'
        const new_href = 'https://docs.cypress.io/guides/references/assertions.html#BDD-Assertions/'
        const upd_btn = /update/i
        const link_btn = /create/i

        cy.get(title).clear()
        cy.get(title).type('Test2')

        cy.get(links).first().clear()
        cy.get(links).first().type(href)

        cy.contains(link_btn).click()
        cy.get(links).last().type(new_href)

        cy.contains(upd_btn).click()
        cy.url().should('include', '/home')
        cy.get('.sidebar').contains('Test2').click()
        cy.get(`.display a[href='${href}'`).should('exist')
        cy.get(`.display a[href='${new_href}'`).should('exist')
    })

})