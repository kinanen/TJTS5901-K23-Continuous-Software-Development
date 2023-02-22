const mongoose = require("mongoose");
const supertest = require("supertest");
const helper = require("./test_helper");
const app = require("../app");
const api = supertest(app);
const Item = require("../models/item");
const bcrypt = require("bcrypt");
const User = require("../models/user");

const initialUser = helper.initialUser;

beforeAll(async () => {
  await User.deleteMany({});
  let userObject = new User(initialUser);
  await userObject.save();
});

describe("creating user", () => {

  test("user can be created", async () => {

    const newUser = new User({
      email: "unique.test@test.com",
      firstName: "test",
      surname: "test",
      userType: "operator",
      password: "testtest+8characters",
    });
    await newUser.save();

    const response = await api
      .post("/api/users")
      .send(newUser)
      .expect(200)
      .expect("Content-Type", /application\/json/);
    console.log(response.body);
    let token = response.body.token;
  });
});

test("a user is returned", async () => {
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

  const response = await api.get("/api/users");

  const name = response.body;
  expect("Testi").toEqual("Testi");
});
