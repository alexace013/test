const request = require('supertest');
const expect = require('chai').expect;

// Server URL
const baseUrl = 'http://127.0.0.1:3000';

describe('API Tests', function () {
  let agent;
  beforeEach(function() {
    agent = request.agent(baseUrl); // Agent for save session
  });

  // Generate randon value (as an example, if needed for dynamic used id)
  function getRandomInt(max) {
    var randValue = Math.floor(Math.random() * max);
    console.debug("Random value for test: " + randValue);
    return randValue;
  }

  // Test for /signup (create user)
  it('POST /signup should create a new user', async () => {
    const response = await request(baseUrl)
      .post('/signup')
      .send({
        login: 'newuser' + getRandomInt(1000),
        password: 'password123',
        password2: 'password123'
      });
    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('redirect').that.equals('/login');
  });

  // Test for /signup with error (User is existing)
  it('POST /signup should return 400 if user already exists', async () => {
    // Create test user
    await request(baseUrl)
      .post('/signup')
      .send({
        login: 'existinguser',
        password: 'password123',
        password2: 'password123'
      });

    const response = await request(baseUrl)
      .post('/signup')
      .send({
        login: 'existinguser',
        password: 'password123',
        password2: 'password123'
      });
    expect(response.status).to.equal(400);
    expect(response.body).to.have.property('errorCode').that.equals('ALREADY_EXISTS_USER');
  });

  // Test for /login (User authorization)
  it('POST /login should log in the user successfully', async () => {
    // Create test user
    await request(baseUrl)
      .post('/signup')
      .send({
        login: 'user1',
        password: 'password123',
        password2: 'password123'
      });

    // Try to authorization with existing user
    const response = await agent
      .post('/login')
      .send({
        login: 'user1',
        password: 'password123'
      });

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('redirect').that.equals('/home');
  });

  // Test for /login with error (Incorrect login/password)
  it('POST /login should return 401 if login or password is incorrect', async () => {
    const response = await agent
      .post('/login')
      .send({
        login: 'nonexistentuser',
        password: 'wrongpassword'
      });

    expect(response.status).to.equal(401);
    expect(response.body).to.have.property('errorCode').that.equals('UNAUTHORIZED');
  });

  // Test for /get-user-info (get information about user)
  it('GET /get-user-info should return user info if authorized', async () => {
    // Create test user and authorization
    await request(baseUrl)
      .post('/signup')
      .send({
        login: 'user2',
        password: 'password123',
        password2: 'password123'
      });

    await agent
      .post('/login')
      .send({
        login: 'user2',
        password: 'password123'
      });

    const response = await agent.get('/get-user-info');
    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('username').that.equals('user2');
  });

  // Test for /get-user-info with error (unauthorized user)
  it('GET /get-user-info should return 401 if not authorized', async () => {
    const response = await request(baseUrl).get('/get-user-info');
    expect(response.status).to.equal(401);
    expect(response.body).to.have.property('errorCode').that.equals('UNAUTHORIZED');
  });

  // Test for /logout (logout from the system)
  it('POST /logout should log out the user', async () => {
    // Create test user and authorization
    await request(baseUrl)
      .post('/signup')
      .send({
        login: 'user3',
        password: 'password123',
        password2: 'password123'
      });

    await agent
      .post('/login')
      .send({
        login: 'user3',
        password: 'password123'
      });

    // Trying to do logout
    const response = await agent.post('/logout');
    expect(response.status).to.equal(200);

    // Verify that it is not authorized
    const userInfoResponse = await agent.get('/get-user-info');
    expect(userInfoResponse.status).to.equal(401);
  });

  // Test for redirect from / to /home, when user is authorized
  it('GET / should redirect to /home if user is logged in', async () => {
    // Create test user and authorization
    await request(baseUrl)
      .post('/signup')
      .send({
        login: 'user4',
        password: 'password123',
        password2: 'password123'
      });

    await agent
      .post('/login')
      .send({
        login: 'user4',
        password: 'password123'
      });

    const response = await agent.get('/');
    expect(response.status).to.equal(302);
    expect(response.headers.location).to.equal('/home');
  });

  // Test for redirect from / to /login, when user is authorized
  it('GET / should redirect to /login if user is not logged in', async () => {
    const response = await request(baseUrl).get('/');
    expect(response.status).to.equal(302);
    expect(response.headers.location).to.equal('/login');
  });
});
