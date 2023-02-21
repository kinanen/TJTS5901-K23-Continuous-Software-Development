const mongoose = require("mongoose");
const supertest = require("supertest");
const helper = require("./test_helper");
const app = require("../app");
const api = supertest(app);
const Item = require("../models/item");
const bcrypt = require("bcrypt");
const User = require("../models/user");

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

describe("addition of a item", () => {
  let token;
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash("sekret", 10);
    const user = new User({ username: "root", passwordHash });

    await user.save();

    const response = await api
      .post("/api/login")
      .send({ username: "root", password: "sekret" });

    token = response.body.token;
  });
});
