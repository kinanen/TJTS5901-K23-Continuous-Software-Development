const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Item = require('../models/item')
const bcrypt = require('bcrypt')
const User = require('../models/user')

initialItems = [
    {
        name: "Test item 1",
        model: "Test model 1",
        description: "Test description 1",
        category: "Test category 1",
        condition: "Test condition 1",
        initialPrice: 1,
        seller:null,
        highestBid: null,
        highestBidder: null,
        startDate: new Date(),
        endDate: new Date(),
        zipcode: "Test zipcode 1",
        currency: "Test currency 1",
        photo: null,
        status: "Test status 1"
    },
    {
        name: "Test item 2",
        model: "Test model 2",
        description: "Test description 2",
        category: "Test category 2",
        condition: "Test condition 2",
        initialPrice: 2,
        seller:null,
        highestBid: null,
        highestBidder:null,
        startDate: new Date(),
        endDate: new Date(),
        zipcode: "Test zipcode 2",
        currency: "Test currency 2",
        photo: null,
        status: "Test status 2"
    }]

    beforeAll(async () => {
        await Item.deleteMany({})
        let itemObject = new Item(initialItems[0]) 
        await itemObject.save()
        itemObject = new Item(initialItems[1])
        await itemObject.save()
    })

    test('all items are returned', async () => {
        const response = await api.get('/api/items')
      
        expect(response.body).toHaveLength(initialItems.length)
    })

    test('a specific item is within the returned items', async () => {
        const response = await api.get('/api/items')
      
        const names = response.body.map(r => r.name)
        expect(names).toContain(
          'Test item 1'
        )
    })

    test('a valid item can be added', async () => {
        const newItem = {
            name: "Test item 3",
            model: "Test model 3",
            description: "Test description 3",
            category: "Test category 3",
            condition: "Test condition 3",
            initialPrice: 3,
            seller:null,
            highestBid: null,
            highestBidder:null,
            startDate: new Date(),
            endDate: new Date(),
            zipcode: "Test zipcode 3",
            currency: "Test currency 3",
            photo: null,
            status: "Test status 3"
        }
        
        const token = await helper.getToken()
        // Palauttaa nyt "401 unauthorized" ? 
        //tarkistetaan mitä argumentteja pitää antaa
        
        await api
          .post('/api/items')
          .send(newItem, token)
          .expect(200)
          .expect('Content-Type', /application\/json/)
      
        const response = await api.get('/api/items')
      
        const names = response.body.map(r => r.name)
      
        expect(response.body).toHaveLength(initialItems.length + 1)
        expect(names).toContain(
          'Test item 3'
        )
    })