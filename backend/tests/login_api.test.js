const mongoose = require("mongoose");
const supertest = require("supertest");
const helper = require("./test_helper");
const app = require("../app");
const api = supertest(app);
const Item = require("../models/item");
const bcrypt = require("bcrypt");
const User = require("../models/user");

const initialUser = helper.initialUser;

describe("loggin in", () => {
    let token;
  
    beforeEach(async () => {
      await User.deleteMany({});
  
      const passwordHash = await bcrypt.hash("sekret", 10);
      const user = new User({ email:"root@root", firstName: "root", surname: "root", passwordHash });
  
      await user.save();
    });

    test("login works", async () => {
        const response = await api
        .post("/api/login")
        .send({ email: "root@root", password: "sekret" })
        .expect(200);
  
      token = response.body.token;
    });

    test("login fails with wrong password", async () => {
        
        const response = await api
        .post("/api/login")
        .send({ email: "root@root", password: "wrong" })
        .expect(401);
    });

    test("login fails with wrong email", async () => {
        
        const response = await api
        .post("/api/login")
        .send({ email: "Toot@toot", password: "sekret" })
        .expect(401);

        expect(response.body.error).toContain("invalid email or password");
    });

    test("login fails with usertype", async () => {
        const passwordHash = await bcrypt.hash("sekret", 10);
        const user = new User({ email:"buyer@root", userType:"buyer", passwordHash });
    
        await user.save();
        
        const response = await api
        .post("/api/login")
        .send({ email: "buyer@root", userType:"seller", password: "sekret" })
        .expect(401);
        
        expect(response.body.error).toContain("Given user type doesn't match user's real type");
    });

    test("login fails with wrong email", async () => {
        
        for(let i = 0; i < 3 ; i++){
            await api
            .post("/api/login")
            .send({ email: "root@root", password: "wrong" })
        }

        const response = await api
        .post("/api/login")
        .send({ email: "root@root", password: "sekret" })
        .expect(401);

        expect(response.body.error).toContain("User has been locked out due to too many failed login attempts");
    });
});