describe('Testing the next page: /signup', () => {
    it('Register a new user', () => {
      cy.visit('http://127.0.0.1:3000/signup');
      
      cy.get('input[id="field-login"]').type('testuser' + getRandomInt(1000) + '@example.com');
      cy.get('input[id="field-password"]').type('Password123');
      cy.get('input[id="field-password2"]').type('Password123');
      cy.get('button[class="submit"]').click();
      
      // Verify redirect on the login/home page
      cy.url().should('include', '/login');
    });
  
    it('Incorrect password when a new user registering', () => {
      cy.visit('http://127.0.0.1:3000/signup');
      
      cy.get('input[id="field-login"]').type('testuser@example.com');
      cy.get('input[id="field-password"]').type('Password123');
      cy.get('input[id="field-password2"]').type('WrongPassword');
      cy.get('button[class="submit').click();
      
      // Verify the error
      cy.contains('В одному з полів введено невірні дані!').should('be.visible');
    });
  });
  
  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }