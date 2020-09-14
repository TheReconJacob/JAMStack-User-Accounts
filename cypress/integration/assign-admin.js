describe('Assign Admin', () => {
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
    it('Assign Admin', () => {
      cy.get('#admin-email').click().type("jvpokeyjake@gmail.com")
        const stub = cy.stub()  
        cy.on ('window:alert', stub)
        cy
        .get('#make-admin').click()
        .then(() => {
          cy.wait(3000)
        })
        .then(() => {
          expect(stub.getCall(1)).to.be.calledWith('Success! jvpokeyjake@gmail.com has been made an admin!')      
        })
    })
    it("Fail Assign Admin", () => {
      cy.get('#admin-email').click().type("m")
      const stub = cy.stub()  
      cy.on ('window:alert', stub)
      cy
        .get('#make-admin').click()
        .then(() => {
          cy.wait(3000)
        })
        .then(() => {
          expect(stub.getCall(0)).to.be.calledWith('There is no user record corresponding to the provided identifier.')      
        })
    })
})