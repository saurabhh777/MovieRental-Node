const supertest = require("supertest");
const app=require("../../../index")
const req=supertest(app);
const {Genre} =require("../../../models/genres");
const { User}= require("../../../models/user");


describe("auth middleware",()=>{
    afterEach(async()=>{
        await Genre.deleteMany({});
    })
 it("should  return 401 if no token is provided",async()=>{
     const res =await req.post ("/api/genres").send({name:"genre1"})
     expect(res.status).toBe(401)
 })   
 it("should  return 400 if invalid token is provid",async()=>{
    const res =await req
    .post ("/api/genres")
    .set("x-auth-token" ,"a")
    .send({name:"genre1"})
    
    expect(res.status).toBe(400)
   

}) 
it("should  return 200 if invalid token is provid",async()=>{
    const token = new User().getAuthToken();
    const res =await req
    .post ("/api/genres")
    .set("x-auth-token" ,token)
    .send({name:"genre1"})
    
    expect(res.status).toBe(200)
   

}) 

})