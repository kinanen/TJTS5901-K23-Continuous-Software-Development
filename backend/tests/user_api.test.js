const mongoose = require("mongoose");
const supertest = require("supertest");
const helper = require("./test_helper");
const app = require("../app");
const api = supertest(app);
const Item = require("../models/item");
const bcrypt = require("bcrypt");
const User = require("../models/user");

const initialUser = helper.initialUsers;

beforeAll(async () => {
  await User.deleteMany({});
  let userObject = new User(initialUser[0]);
  await userObject.save();
  let userObject2 = new User(initialUser[1]);
  await userObject2.save();
});

describe("creating user", () => {

  test("valid user can be created", async () => {
    const passwordHash = await bcrypt.hash("testtest+8characters", 10);

    const response = await api
      .post("/api/users")
      .send({ email: "unique.test@test.com", firstName: "test", surname: "test", userType: "operator", password: "testtest+8characters" })
      .expect(201)
      .expect("Content-Type", /application\/json/);

  });

  test("un valid user cannot be created, email found on other user", async () => {
    const passwordHash = await bcrypt.hash("testtest+8characters", 10);
    const newUser = new User({
      email: "unique.test@test.com",
      firstName: "test",
      surname: "test",
      userType: "operator",
      passwordHash
    });

    console.log("newUser", newUser)

    const response = await api
      .post("/api/users")
      .send({ email: "unique.test@test.com", firstName: "test", surname: "test", userType: "operator", password: "testtest+8characters" })
      .expect(409)
      .expect("Content-Type", /application\/json/);
    expect(response.body.error).toContain("email must be unique");

  });

  test("unvalid user cannot be created, too short password", async () => {
    const passwordHash = await bcrypt.hash("p", 10);
    
    const newUser = {
      email: "unique.test3@test.com",
      firstName: "test3",
      surname: "test3",
      userType: "operator",
      password: "p"
    };

    console.log("newUser", newUser)

    const response = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);
    expect(response.body.error).toContain("password must be at least 8 characters");
    
  });

  test("unvalid user can be created, email not including @ ", async () => {
    const passwordHash = await bcrypt.hash("testtest+8characters", 10);
    const newUser ={
      email: "uniquetest.com",
      firstName: "test",
      surname: "test",
      userType: "operator",
      passwordHash
    }

    console.log("newUser", newUser)

    const response = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);
    expect(response.body.error).toContain("email must be the right format");
  });

  
});

describe("getting users", () => {

  test("users wont be returned if not signed", async () => {

    const response = await api
      .get("/api/users")
      .expect(401);

    expect(response.body.error).toContain("token missing or invalid");   


  });
    
  test("users will be returned if signed", async () => {

    const passwordHash = await bcrypt.hash("sekret", 10);
    const user = new User({ email:"root@root", passwordHash });
    await user.save();
    const response = await api
      .post("/api/login")
      .send({ email: "root@root", password: "sekret" });
    let token = response.body.token;

    const response2 = await api
      .get("/api/users")
      .set("Authorization", `bearer ${token}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response2.body.length).toBeGreaterThanOrEqual(initialUser.length);

  });
  
  test("user will be returned if signed", async () => {

    const passwordHash = await bcrypt.hash("sekret", 10);
    const user = new User({ email:"root2@root", passwordHash });
    await user.save();
    const response = await api
      .post("/api/login")
      .send({ email: "root2@root", password: "sekret" });
    let token = response.body.token;

    const response2 = await api
      .get(`/api/users/${user.id}`)
      .set("Authorization", `bearer ${token}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response2.body.email).toBe("root2@root");
  });

  test("user will NOT be returned if not signed ", async () => {

    const passwordHash = await bcrypt.hash("sekret", 10);
    const user = new User({ email:"root3@root", passwordHash });
    await user.save();

    const response2 = await api
      .get(`/api/users/${user.id}`)
      .expect(401)
      .expect("Content-Type", /application\/json/);

    expect(response2.body.error).toBe('token missing or invalid');
  });

  test("user will not be returned with wrong id", async () => {

    const response = await api
      .post("/api/login")
      .send({ email: "root2@root", password: "sekret" });
    let token = response.body.token;
    let userid = "012345678901234567890123"

    const response2 = await api
      .get(`/api/users/${userid}`)
      .set("Authorization", `bearer ${token}`)
      .expect(404)

    expect(response2.body.error).toBe('no user found with given id');
  });

  test("user will not be returned to non operator type user ", async () => {

    const passwordHash = await bcrypt.hash("sekret", 10);
    const user = new User({ email:"root4@root",userType: "buyer", passwordHash });
    await user.save();

    const passwordHash3 = await bcrypt.hash("sekret", 10);
    const user2 = new User({ email:"root5@root",userType: "buyer", passwordHash });
    await user2.save();

    const response = await api
      .post("/api/login")
      .send({ email: "root4@root",userType:"buyer", password: "sekret" });
    let token = response.body.token;

    const response2 = await api
      .get(`/api/users/${user2.id}`)
      .set("Authorization", `bearer ${token}`)
      .expect(403);
    expect(response2.body.error).toBe('user tried to access other user\'s info without proper authorization');


  });

});
