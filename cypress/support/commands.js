Cypress.Commands.add('fillMandatoryFieldsAndSubmit', function(){
    cy.get('#firstName').type('marcelo')
    cy.get('#lastName').type('Carvalho')
    cy.get('#email').type('marcelo.carvalho@hotmail.com')
    cy.get('#open-text-area').type('teste')
    cy.contains('button', 'Enviar').click()
})