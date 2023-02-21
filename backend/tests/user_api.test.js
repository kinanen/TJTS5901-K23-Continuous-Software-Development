const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Item = require('../models/item')
const bcrypt = require('bcrypt')
const User = require('../models/user')

const initialUser = helper.initialUser;

beforeAll(async () => {
    await User.deleteMany({})
    let userObject = new User(initialUser)
    await userObject.save()
})


// response.body:  { error: 'token missing or invalid' } FAIL
test('a user is returned', async () => {
    const response = await api.get('/api/users')
    
    console.log(
        'response.body: ',
        response.body
    )
   
    const name = response.body
    expect(name).toEqual('Testi')
})
