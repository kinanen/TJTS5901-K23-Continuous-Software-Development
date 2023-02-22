const mongoose = require("mongoose");
const supertest = require("supertest");
const helper = require("./test_helper");
const app = require("../app");
const api = supertest(app);
const Item = require("../models/item");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { response } = require("../app");

const initialItems = helper.initialItems;

beforeAll(async () => {
  await Item.deleteMany({});
  let itemObject = new Item(initialItems[0]);
  await itemObject.save();
  itemObject = new Item(initialItems[1]);
  await itemObject.save();
  itemObject = new Item(initialItems[2]);
  await itemObject.save();
});

test("all items are returned", async () => {
  const response = await api.get("/api/items");
  expect(response.body).toHaveLength(initialItems.length);
});

test("active items are returned", async () => {
  const response = await api.get("/api/items/active");
  console.log("response for active items", response.body);
  expect(response.body).toHaveLength(initialItems.length - 2);
});

test("items are identified by field id", async () => {
  const response = await api
    .get("/api/items")
    .expect(200)
    .expect("Content-Type", /application\/json/);
  expect(response.body[0].id).toBeDefined();
});

test("a specific item is within the returned items", async () => {
  const response = await api.get("/api/items");

  const names = response.body.map((r) => r.name);
  expect(names).toContain("Test item 1");
});


describe("addition and deleting an item", () => {
  let token;
  let buyerToken;

  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash("sekret", 10);
    const user = new User({ email:"root@root", firstName: "root", surname: "root", passwordHash });

    await user.save();

    const response = await api
      .post("/api/login")
      .send({ email: "root@root", password: "sekret" });

    token = response.body.token;

    const buyer = new User({ email: "bob@buyer", firstName: "Bob", surname: "buyer", userType: "buyer", passwordHash });
    await buyer.save();

    const buyerResponse = await api
      .post("/api/login")
      .send({ email: "bob@buyer", password: "sekret", userType: "buyer" });

    buyerToken = buyerResponse.body.token;
  });

  test("item cannot be added without token", async () => {
    const newItem = {
      name: "Test item Z",
      model: "Test model 3",
      description: "Test description 3",
      category: "Test category 3",
      condition: "Test condition 3",
      initialPrice: 3,
      seller: null,
      highestBid: null,
      highestBidder: null,
      startDate: new Date(),
      endDate: new Date(),
      zipcode: "Test zipcode 3",
      currency: "Test currency 3",
      photo: null,
      status: "active",
    };

    await api.post("/api/items").send(newItem).expect(401);

    const response = await api.get("/api/items");

    const names = response.body.map((r) => r.name);

    expect(response.body).toHaveLength(initialItems.length);
    expect(names).not.toContain("Test item Z");
  })

  test("a valid item can be added", async () => {
    const newItem = {
      name: "Test item 3",
      model: "Test model 3",
      description: "Test description 3",
      category: "Test category 3",
      condition: "Test condition 3",
      initialPrice: 3,
      seller: null,
      highestBid: null,
      highestBidder: null,
      startDate: new Date(),
      endDate: new Date(),
      zipcode: "Test zipcode 3",
      currency: "Test currency 3",
      photo: null,
      status: "active",
    };

    await api
      .post("/api/items")
      .send(newItem)
      .set("Authorization", `bearer ${token}`)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const response = await api.get("/api/items");

    const names = response.body.map((r) => r.name);

    expect(response.body).toHaveLength(initialItems.length + 1);
    expect(names).toContain("Test item 3");
  });

  test("buyer cannot add item", async () => {
    const newItem = {
      name: "Test item Z",
      model: "Test model 3",
      description: "Test description 3",
      category: "Test category 3",
      condition: "Test condition 3",
      initialPrice: 3,
      seller: null,
      highestBid: null,
      highestBidder: null,
      startDate: new Date(),
      endDate: new Date(),
      zipcode: "Test zipcode 3",
      currency: "Test currency 3",
      photo: null,
      status: "active",
    }

    await api
      .post("/api/items")
      .send(newItem)
      .set("Authorization", `bearer ${buyerToken}`)
      .expect(403);

    const response = await api.get("/api/items");

    const names = response.body.map((r) => r.name);

    expect(response.body).toHaveLength(initialItems.length+1); // one item added in tests
    expect(names).not.toContain("Test item Z")
  });

  test("item can be deleted", async () => {
    const itemsresponse = await api
      .get("/api/items");
    
    const itemId = itemsresponse.body[0].id;
    console.log("item id", itemId);
    
    await api
      .delete(`/api/items/${itemId}`)
      .expect(204);

    const response = await api.get("/api/items");

    expect(response.body).toHaveLength(itemsresponse.body.length - 1);
  
  });

  test("item cannot be deleted with non existing id", async () => {
    const itemsresponse = await api
      .get("/api/items");
    
    const itemId = "123456789012345678901234";

    
    await api
      .delete(`/api/items/${itemId}`)
      .expect(404);
  
  });

});


test("get item by id, item exists", async () => {
  const response = await api
    .get("/api/items")
  const item = response.body[0];

  const itemResponse = await api
    .get(`/api/items/${item.id}`)
    .expect(200);
  expect(itemResponse.body.name).toBe(item.name);
});

test("get item by id, item not exsisting ", async () => {
  const response = await api
    .get("/api/items")
  const item = response.body[0];

  const itemResponse = await api
    .get(`/api/items/${"123456789012345678901234"}`)
    .expect(404);
});




describe("bidding on an item and changing item's status", () => {
  let token;
  let user;
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash("sekret", 10);
    user = new User({ username: "root", passwordHash });

    await user.save();

    const response = await api
      .post("/api/login")
      .send({ username: "root", password: "sekret" });
    token = response.body.token;
  });

  test("a valid bid can be sent", async () => {
    const response = await api.get("/api/items");
    console.log("response for active items", response.body);
    const itemId = response.body[0].id;
    console.log( "item id", itemId);
    const curentHighestBid = response.body[0].highestBid;
    const newBid = curentHighestBid + 100;

    await api
      .put(`/api/items/${itemId}`)
      .send({ highestBid: newBid })
      .set("Authorization", `bearer ${token}`)
      .expect(200);

    const itemResponse = await api.get(`/api/items/${itemId}`);
    expect(itemResponse.body.highestBid).toEqual(newBid);
    expect(itemResponse.body.highestBidder).toEqual(user.id)

  });

  test("low bid cannot be sent", async () => {
    const response = await api.get("/api/items");
    console.log("response for active items", response.body);
    const itemId = response.body[0].id;
    console.log( "item id", itemId);
    const curentHighestBid = response.body[0].highestBid;
    const newBid = curentHighestBid - 10;

    await api
      .put(`/api/items/${itemId}`)
      .send({ highestBid: newBid })
      .set("Authorization", `bearer ${token}`)
      .expect(409);

    const itemResponse = await api.get(`/api/items/${itemId}`);
    expect(itemResponse.body.highestBid).not.toEqual(newBid);

  })

  test("item status can be changed", async () => {
    const response = await api.get("/api/items");
    const itemId = response.body[2].id;

    await api
      .put(`/api/items/status/${itemId}`)
      .send({ status: 'passed' })
      .set("Authorization", `bearer ${token}`)

    const itemResponse = await api.get(`/api/items/${itemId}`);
    expect(itemResponse.body.status).toEqual("passed");

  })
});


