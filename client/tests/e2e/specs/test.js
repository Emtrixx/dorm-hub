/// <reference types="cypress" />

describe('My First Test', () => {
  it('Visits the app root url', () => {
    cy.visit('/')
    cy.contains('span', 'dorm')
  })
})

describe('login', () => {
  it('login with UI', () => {
    cy.visit('/')
    cy.contains('Log in').click()
    cy.get('#email').type('test@test.de')
    cy.get('#email').should('have.value', 'test@test.de')
    cy.get('#password').type('test')
    cy.get('button[type=submit]').click()
    // after a successful login the navbar switches to Log out
    cy.contains('Log out')
  })
})
