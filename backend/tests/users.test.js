const request = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const User = require('../models/user')

describe('usersRouter testing', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const user = new User({
      email: 'test@example.com',
      firstName: 'Test',
      surname: 'User',
      userType: 'Admin',
      passwordHash: '$2b$10$eBv4L4WGfa0ly80oqElxRej1cSGN.0t8uoNz96u9N/Pv7LWY/8IjO',
    })
    await user.save()
  })

  describe('GET /api/users', () => {
    test('returns all users', async () => {
      const response = await request(app)
        .get('/api/users')
        .expect(200)
        .expect('Content-Type', /application\/json/)

      expect(response.body.length).toBe(1)
      expect(response.body[0].email).toBe('test@example.com')
      expect(response.body[0].firstName).toBe('Test')
      expect(response.body[0].surname).toBe('User')
      expect(response.body[0].userType).toBe('Admin')
      expect(response.body[0].passwordHash).toBeUndefined()
    })
  })

  describe('POST /api/users', () => {
    test('creates a new user', async () => {
      const response = await request(app)
        .post('/api/users')
        .send({
          email: 'new@example.com',
          firstName: 'New',
          surname: 'User',
          userType: 'Client',
          password: 'secret1234',
        })
        .expect(201)
        .expect('Content-Type', /application\/json/)

      expect(response.body.email).toBe('new@example.com')
      expect(response.body.firstName).toBe('New')
      expect(response.body.surname).toBe('User')
      expect(response.body.userType).toBe('Client')
      expect(response.body.passwordHash).toBeUndefined()
    })

    test('rejects creating a user with an already registered email', async () => {
      const response = await request(app)
        .post('/api/users')
        .send({
          email: 'test@example.com',
          firstName: 'New',
          surname: 'User',
          userType: 'Client',
          password: 'secret1234',
        })
        .expect(409)
        .expect('Content-Type', /application\/json/)

      expect(response.body.error).toBe('email must be unique')
    })
  })
})
