const Item = require('../models/item')

const initialItems = [
    {
        name: "Test item 1",
        model: "Test model 1",
        description: "Test description 1",
        category: "Test category 1",
        condition: "Test condition 1",
        initialPrice: 1,
        seller: null,
        highestBid: 100,
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
        seller: null,
        highestBid: 100,
        highestBidder: null,
        startDate: new Date(),
        endDate: new Date(),
        zipcode: "Test zipcode 2",
        currency: "Test currency 2",
        photo: null,
        status: "Test status 2"
    },
    {
        name: "Test item 4",
        model: "Test model 4",
        description: "Test description 4",
        category: "Test category 4",
        condition: "Test condition 3",
        initialPrice: 100,
        seller: null,
        highestBid: 100,
        highestBidder: null,
        startDate: new Date(),
        endDate: new Date(),
        zipcode: "Test zipcode 3",
        currency: "Test currency 3",
        photo: null,
        status: "active"
    }
    ]



initialUser = {
        email: "testi@mail.com",
        firstName: "Testi",
        surname: "Testinen",
        userType: "Seller",
        passwordHash: "testi",
        items: []
    }

const itemsInDb = async () => {
  const items = await Item.find({})
  return items.map(b => b.toJSON())
}


module.exports = { initialItems, itemsInDb, initialUser}