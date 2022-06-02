/// <reference types="cypress" />

describe('My First Test', () => {
  it('Visits the app root url', () => {
    cy.visit('/')
    cy.contains('span', 'Dorm')
  })
})

describe('login', () => {
  it('login with UI', () => {
    cy.visit('/')
    cy.contains('Login').click()
    cy.get('#email')
      .type('test@test.de')
      .should('have.value', 'test@test.de')
    cy.get('#password')
      .type('test')
    cy.contains('Submit')
      .click()
  })
})