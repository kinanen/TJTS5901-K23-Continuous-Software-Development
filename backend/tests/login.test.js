const request = require('supertest');
const app = require('../app');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

describe('POST /login', () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('secret', 10);
    const user = new User({
      email: 'test@example.com',
      passwordHash,
      userType: 'ADMIN'
    });

    await user.save();
  });

  test('with correct details, should return 200 with token', async () => {
    const response = await request(app)
      .post('/login')
      .send({
        email: 'test@example.com',
        password: 'secret',
        userType: 'admin'
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('email', 'test@example.com');
    expect(response.body).toHaveProperty('userType', 'ADMIN');
    expect(response.body).toHaveProperty('id');

    const decodedToken = jwt.verify(response.body.token, process.env.SECRET);
    expect(decodedToken).toHaveProperty('email', 'test@example.com');
    expect(decodedToken).toHaveProperty('userType', 'ADMIN');
    expect(decodedToken).toHaveProperty('id');
  });

  test('with incorrect password, should return 401', async () => {
    const response = await request(app)
      .post('/login')
      .send({
        email: 'test@example.com',
        password: 'incorrect',
        userType: 'admin'
      });

    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty('error', 'invalid email or password');
  });

  test('with incorrect email, should return 401', async () => {
    const response = await request(app)
      .post('/login')
      .send({
        email: 'incorrect@example.com',
        password: 'secret',
        userType: 'admin'
      });

    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty('error', 'invalid email or password');
  });

  test('with incorrect user type, should return 401', async () => {
    const response = await request(app)
      .post('/login')
      .send({
        email: 'test@example.com',
        password: 'secret',
        userType: 'incorrect'
      });

    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty("error", " Given user type doesn't match user's real type");
  });
});