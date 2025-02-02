const request = require('supertest');
const cheerio = require('cheerio');
const expect = require('chai').expect;

const baseUrl = 'http://127.0.0.1:3000';

describe('Pages Tests', function () {
  // Testing /signup page
  it('GET /signup should render the signup page', async () => {
    const response = await request(baseUrl).get('/signup');
    expect(response.status).to.equal(200);
    const $ = cheerio.load(response.text);
    // Verify form and input fields with button
    expect($('form')).to.have.length(1);
    expect($('input[id="field-login"]')).to.have.length(1);
    expect($('input[id="field-password"]')).to.have.length(1);
    expect($('input[id="field-password2"]')).to.have.length(1);
    expect($('button[class="submit"]')).to.have.length(1);
  });

  // Testing /login page
  it('GET /login should render the login page', async () => {
    const response = await request(baseUrl).get('/login');
    expect(response.status).to.equal(200);
    const $ = cheerio.load(response.text);
    // Verify form and input fields with button
    expect($('form')).to.have.length(1);
    expect($('input[name="login"]')).to.have.length(1);
    expect($('input[name="password"]')).to.have.length(1);
    expect($('button[class="submit"]')).to.have.length(1);
  });

  // Testing /home page
  it('GET /home should render the home page if logged in', async () => {
    
    const agent = request.agent(baseUrl);
    await agent.post('/login').send({ login: 'test', password: 'test' }); // Authorization 

    const response = await agent.get('/home');
    expect(response.status).to.equal(200);
    const $ = cheerio.load(response.text);
    // Verify that element is present
    expect($('h1')).to.have.length(1);
    expect($('h1').text()).to.include('test'); // Verify that user name is present
  });

  // Testing redirect from / to /home page (if use is authorized)
  it('GET / should redirect to /home if user is logged in', async () => {
    // Create session for authorized user
    const agent = request.agent(baseUrl); // Use agent for saving session
    await agent.post('/login').send({ login: 'test', password: 'test' }); // Authorization

    const response = await agent.get('/');
    expect(response.status).to.equal(302); // Redirect should be happens
    expect(response.headers.location).to.equal('/home'); // Redirect on /home
  });

  // Testing redirect from / to /login (if use is authorized)
  it('GET / should redirect to /login if user is not logged in', async () => {
    const response = await request(baseUrl).get('/');
    expect(response.status).to.equal(302); // Redirect should be happens
    expect(response.headers.location).to.equal('/login'); // Redirect on /login
  });
});