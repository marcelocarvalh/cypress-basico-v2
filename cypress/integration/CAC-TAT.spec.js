/// <reference types="Cypress" />

describe('Central de Atendimento ao Cliente TAT', function() {
  const THREE_SECOND_MS = 3000 
  this.beforeEach(function() {
    cy.visit('./src/index.html')    
  })  
    it('verifica o título da aplicação', function() {  
          
      cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT')
    })

    Cypress._.times(2, function(){
      it('Preenche os campos obrigatórios e envia o formulário', function(){
        const longTest = 'teste, teste, teste, teste, teste, teste, teste, teste, teste, teste'
        
        cy.clock()
        
        cy.get('#firstName').type('marcelo')
        cy.get('#lastName').type('Carvalho')
        cy.get('#email').type('marcelo.carvalho@hotmail.com')
        cy.get('#open-text-area').type(longTest, {delay: 0})
        cy.contains('button', 'Enviar').click()
  
        cy.get('.success').should('be.visible')
  
        cy.tick(THREE_SECOND_MS)
  
        cy.get('.success').should('not.be.visible')
      })
    })

    it('Exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', function() {
      cy.clock()

      cy.get('#firstName').type('marcelo')
      cy.get('#lastName').type('Carvalho')
      cy.get('#email').type('marcelo.carvalho@hotmail,com')
      cy.get('#open-text-area').type('teste')
      cy.contains('button', 'Enviar').click()

      cy.get('.error').should('be.visible')
      
      cy.tick(THREE_SECOND_MS)

      cy.get('.error').should('not.be.visible')
    })

    it('Campo telefone continua vazio quando preencin«gdo com valor-não numerico', function(){
      cy.get('#phone')
        .type('fvuksdffku')
        .should('have.value', '')
    })

    it('Exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', function(){

      cy.clock()

      cy.get('#firstName').type('marcelo')
      cy.get('#lastName').type('Carvalho')
      cy.get('#email').type('marcelo.carvalho@hotmail.com')
      cy.get('#phone-checkbox').check()
      cy.get('#open-text-area').type('teste')      
      cy.contains('button', 'Enviar').click()

      cy.get('.error').should('be.visible')

      cy.tick(THREE_SECOND_MS)

      cy.get('.error').should('not.be.visible')
      

    })

    it('preenche e limpa os campos nome, sobrenome, email e telefone', function() {
      cy.get('#firstName')
        .type('marcelo')
        .should('have.value', 'marcelo')
        .clear()
        .should('have.value', '')
      cy.get('#lastName')
        .type('Carvalho')
        .should('have.value', 'Carvalho')
        .clear()
        .should('have.value', '')
      cy.get('#email')
        .type('marcelo.carvalho@hotmail.com')
        .should('have.value', 'marcelo.carvalho@hotmail.com')
        .clear()
        .should('have.value', '')
      cy.get('#phone')
          .type('1234567890')
          .should('have.value', '1234567890')
          .clear()
          .should('have.value', '')
    })

    it('Exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', function(){
      cy.clock()

      cy.contains('button', 'Enviar').click()

      cy.get('.error').should('be.visible')
      
      cy.tick(THREE_SECOND_MS)

      cy.get('.error').should('not.be.visible')

    })
    it('envia o formuário com sucesso usando um comando customizado', function() {
      
      cy.clock()

      cy.fillMandatoryFieldsAndSubmit()
      
      cy.get('.success').should('be.visible')
      
      cy.tick(THREE_SECOND_MS)

      cy.get('.success').should('not.be.visible')
    })
    
    it('seleciona um produto (YouTube) por seu texto', function() {
      cy.get('#product')
        .select('YouTube')
        .should('have.value', 'youtube')
    })

    it('seleciona um produto (Mentoria) por seu valor (value)', function() {
      cy.get('#product')
        .select('mentoria')
        .should('have.value', 'mentoria')
    })

    it('seleciona um produto (Blog) por seu índice', function(){
      cy.get('#product')
        .select(1)
        .should('have.value', 'blog')
    })

    it('marca o tipo de atendimento "Feedback"', function(){
      cy.get('input[type="radio"][value="feedback"]')
        .check()
        .should('have.value', 'feedback')  
    })

    it('Marca cada tipo de atendimento', function() {
      cy.get('input[type="radio"]')
        .should('have.length', 3)
        .each(function($radio){
          cy.wrap($radio).check()
          cy.wrap($radio).should('be.checked')
        })      
    })

    it('Marca ambos checkboxes, depois desmarca o último', function() {
      cy.get('input[type="checkbox"]')      
      .check()
      .should('be.checked')
      .last()
      .uncheck()
      .should('not.be.checked')
    })

    it('Seleciona um arquivo da pasta fixtures', function() {
      cy.get('#file-upload')
        .should('not.have.value')      
        .selectFile('cypress/fixtures/example.json')
        .then(input => {
          expect(input[0].files[0].name).to.equal('example.json')
        })
    })

    it('seleciona um arquivo simulando um drag-and-drop', function() {
      cy.get('#file-upload')
        .should('not.have.value')
        .selectFile('cypress/fixtures/example.json', {action: 'drag-drop'})
        .then(input => {
          expect(input[0].files[0].name).to.equal('example.json')
        })
    })

    it('seleciona um arquivo utilizando uma fixture para a qual foi dada um', function() {
      cy.fixture('example.json').as('sample.file')
      cy.get('#file-upload')
       .should('not.have.value')
       .selectFile('@sample.file')
       .then(input => {
        expect(input[0].files[0].name).to.equal('example.json')
      })      
    })
    it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', function() {
      cy.get('#privacy a')
        .should('have.attr', 'target', '_blank')
    })
    
    it('acessa a página da política de privacidade removendo o target e então clicando no link', function() {
      cy.get('#privacy a')
        .invoke('removeAttr', 'target')
        .click()

      //cy.contains('Talking About Testing').should('be.visible')        
    })    

    it('exibe e esconde as mensagens de sucesso e erro usando o .invoke()', function() {
     cy.get('.success')
      .should('not.be.visible')
      .invoke('show')
      .should('be.visible')
      .and('contain', 'Mensagem enviada com sucesso.')
      .invoke('hide')    
      .should('not.be.visible')
    cy.get('.error')
      .should('not.be.visible')
      .invoke('show')
      .and('contain', 'Valide os campos obrigatórios!')
      .should('be.visible')
      .invoke('hide')
      .should('not.be.visible')      
    })

    it('preenche a area de texto usando o comando invoke', function() {
      const longText = Cypress._.repeat('0123456789', 20)
      
      cy.get('#open-text-area')
        .invoke('val', longText)
        .should('have.value', longText)
    })

    it('faz uma requisição HTTP', function() {
      cy.request('https://cac-tat.s3.eu-central-1.amazonaws.com/index.html')   
        .should(function(response) {
          const { status, statusText, body } = response
          expect(status).to.equal(200)
          expect(statusText).to.equal('OK')
          expect(body).to.include('CAC TAT')
        })      
    })

    it('Encontrar o Gato', function() {                              
      cy.get('#cat')    
        .should('not.be.visible')
        .invoke('show')
        .should('be.visible')
      cy.get('#subtitle')
        .invoke('text', 'Alegria 😀')
      
    })
  
  }) 