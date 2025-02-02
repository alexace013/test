Cypress.Commands.add('login', (user) => {
    cy.visit('/login');
    cy.get('input[id="field-login"]').type(user.login);
    cy.get('input[id="field-password"]').type(user.password);
    cy.get('button[class="submit"]').submit();
  });
