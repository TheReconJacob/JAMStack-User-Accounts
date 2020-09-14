describe('Create Quiz', () => {
    it('Signs in admin account', () => {
      cy.visit("index.html")
      cy.wait(1000)
      cy.get("body").then(body => {
        if(body.find('#signOut').length > 0) {
          cy.get('#signOut').click()
        }
      });
      cy.get('#email').click().type("jvpokeyjake@gmail.com")
      cy.get('#password').click().type("minecraft")
      cy.get("#signIn").click()
    })
    it('Create Quiz', () => {
      cy.get('#quiz-name').click().type("Quiz Test")
        const stub = cy.stub()  
        cy.on ('window:alert', stub)
        cy
        .get('.add-question').click()
        cy.get('.question').filter(':visible').click().type("Test Question")
        cy.get('.CorrectAnswer').click().type("Correct Answer")
        cy.get('.Answer1').click().type("Wrong Answer 1")
        cy.get('.Answer2').click().type("Wrong Answer 2")
        cy.get('.Answer3').click().type("Wrong Answer 3")
        cy.get('.submit-quiz').click()
    })
    it('Get 100% Score', () => {
        cy.get('button:contains("Open Quiz Test")').click()
        cy.get('input[value*="Correct Answer"]').click()
        cy.get('.submit').filter(':visible').click()
        cy.wait(3000)
        cy.get('.score').filter(':visible').contains('100%')
      })
    it('Get 0% Score', () => {
      cy.get('button:contains("Close Quiz Test")').click()
      cy.get('button:contains("Open Quiz Test")').click()
      cy.get('input[value*="Wrong Answer 1"]').click()
      cy.get('.submit').filter(':visible').click()
      cy.wait(3000)
      cy.get('.score').filter(':visible').contains('0%')
    })
    it('Delete Quiz', () => {
      cy.get('button:contains("Close Quiz Test")').click()
      cy.get('button:contains("Open Quiz Test")').click()
      cy.get('button:contains("Delete Quiz")').filter(':visible').click()
      cy.wait(1000)
      cy.get("body").then(body => {
        if(body.find('button:contains("Open Quiz Test")').length > 0) {
          throw new Error("Quiz Test wasn't deleted successfully")
        }
      });
    })
})