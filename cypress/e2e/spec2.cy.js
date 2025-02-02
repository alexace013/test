describe('Authentication Tests', () => {

    const validUser = {
      login: 'testuser',
      password: 'password123',
      password2: 'password123',
    };
  
    const invalidUser = {
      login: 'wronguser',
      password: 'wrongpassword',
    };
  
    it('should load the /signup page', () => {
      cy.visit('/signup');
      cy.contains('Sign Up').should('exist');  // Check that Sign Up form is exist
    });
  
    it('should register a new user on /signup', () => {
      cy.visit('http://127.0.0.1:3000/signup');
      cy.get('input[id="field-login"]').type(validUser.login);
      cy.get('input[id="field-password"]').type(validUser.password);
      cy.get('input[id="field-password2"]').type(validUser.password2);
      cy.get('button[class="submit"]').submit();
  
      // Check that redirect on /login after successfully logged
      cy.url().should('include', '/login');
    });
  
    it('should load the /login page', () => {
      cy.visit('http://127.0.0.1:3000/login');
      cy.contains('Авторизація').should('exist'); // Check that auth form is present on the page
    });
  
    it('should login a user successfully', () => {
      cy.visit('http://127.0.0.1:3000/login');
      cy.get('input[id="field-login"]').type(validUser.login);
      cy.get('input[id="field-password"]').type(validUser.password);
      cy.get('button[class="submit"]').submit();
  
      // Check that redirect on /home after successfully logged
      cy.url().should('include', '/home');
    });
  
    it('should not login with invalid credentials', () => {
      cy.visit('/login');
      cy.get('input[id="field-login"]').type(invalidUser.login);
      cy.get('input[name="password"]').type(invalidUser.password);
      cy.get('form').submit();
  
      // Verify that incorrect login we will catch error
      cy.contains('Invalid login or password').should('exist');
    });
  
    it('should redirect to /home if already logged in', () => {
      // Log in with valid data
      cy.login(validUser);
  
      // Redirect on the root(/) page
      cy.visit('/');
      cy.url().should('include', '/home');
    });
  
    it('should redirect to /login if not logged in', () => {
      cy.visit('/');
      cy.url().should('include', '/login');
    });
  
    it('should show the home page after login', () => {
      cy.visit('/home');
      cy.contains('Hello ' + validUser.login).should('exist'); // Verify that elelemt on the home page
    });
  
    it('should logout successfully', () => {
      cy.visit('/logout');
  
      // Check that can be redirect on /login after logout
      cy.url().should('include', '/login');
    });
  });
    