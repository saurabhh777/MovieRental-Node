const mongoose= require("mongoose");
const supertest =require("supertest");
const app =require("../../index");
const req =supertest(app);
const {Customer}=require("../../models/customer");
const { Genre } = require("../../models/genres");
const { User } = require("../../models/user");
describe("/api/customers",()=>{
    afterEach(async()=>{
      await Customer.deleteMany({});
    })
    describe("GET/",()=>{
  it("should return all customer",async()=>{
      await Customer.insertMany([{name:"customer1",phoneNumber:"123456789",isGold:true},{name:"customer2",phoneNumber:"customer2",isGold:true}])
      const res =await req.get("/api/customers");
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some((c)=>c.name =="customer1")).toBeTruthy();
      expect(res.body.some((c)=>c.name =="customer2")).toBeTruthy();
  })      
    })
    describe("GET/:id",()=>{
      it("should return 404 if invalid id is passed ",async()=>{
        const res= await req.get("/api/customers/1");
        expect(res.status).toBe(404);
})
it("should return customer if valid id is passed ",async()=>{
  const customer=new Customer({
    name:"customer1",
    phoneNumber:"1234567"
    
  });
  await customer.save();
  const res =await req.get("/api/customers/" +customer._id);
  expect(res.status).toBe(200);
  expect(res.body).toHaveProperty("_id");
  expect(res.body).toHaveProperty("name",customer.name);
  expect(res.body).toHaveProperty("phoneNumber",customer.phoneNumber);
  expect(res.body).toHaveProperty("isGold",customer.isGold);

})
describe("POST/",()=>{
it("should return 401 if the customer is not logged in",async()=>{

})
it("should return 400 if customer is maximum 50 char ",async()=>{
  const token =new User().getAuthToken();
  const res = await req
  .post("/api/customers")
  .set("x-auth-token",token)
  .send({name:"customer1"});
  expect(res.status).toBe(400);
})
it("should return 400 if customer is maximum 10 char ",async()=>{
  const token =new User().getAuthToken();
  const res = await req
  .post("/api/customers")
  .set("x-auth-token",token)
  .send({name:"customer1"});
  expect(res.status).toBe(400);
})
})
it("should save the customer if it is valid",async ()=>{
  const token =new User().getAuthToken();
  const res =await req
  .post("/api/customer")
  .set("x-auth-token",token)
  .send({name:"customer1"});
  const customer =await Customer.find({name:"customer1"});
  expect(customer).not.toBeNull();
})
it("should return the customer if it is valid",async ()=>{
  const token =new User().getAuthToken();
  const res =await req
  .post("/api/genres")
  .set("x-auth-token",token)
  .send({name:"customer1"});
 expect(res.body).toHaveProperty("_id");
 expect(res.body).toHaveProperty("name","customer1");
})
describe("PUT /",() =>{
/*it("should retur the updated customer if it is valid",async()=>{
  const token =new User().getAuthToken();
  let customer =new Customer({
      name:"customer1",
  
    _id: mongoose.Types.ObjectId().toHexString(),

  });
  await customer.save();
  const res=await req
  .put("/api/genres/"+customer._id)
  .set("x-auth-token",token)
  .send({name:"new customer"},{phoneNumber:"123456789"});
 expect(res.body).toHaveProperty("_id",customer._id.toHexString());
 expect(res.body).toHaveProperty("name","new customer")

})*/
it("should return 404 if customer with the given id was not found",async()=>{
  const id= new mongoose.Types.ObjectId();
  const res =await req.get("/api/customers/"+id);
  expect(res.status).toBe(404);
})
  
it("should return 404 if invalid id is passed ",async()=>{
  const res= await req.get("/api/customers/1");
  expect(res.status).toBe(404);

})
})
describe("DELETE/",()=>{

it("should  return 404 if id is invalid",async()=>{    
  const token =new User({isAdmin:true}).getAuthToken();
  const id=mongoose.Types.ObjectId();
  const res=await req
  .delete("/api/customers/"+id)
  .set("x-auth-token",token)
  .send({name:"customer1"})
  expect(res.status).toBe(404)  
})
it("should return 404 if no customer with the given id was found",async()=>{
  const token =new User({isAdmin:true}).getAuthToken();
  const id=mongoose.Types.ObjectId();
  const res = await req
  .delete("/api/customers/"+id) 
  .set("x-auth-token",token)
  .send({name:"new customer"}) 
  expect(res.status).toBe(404) 
})
/*it("should delete the customer if input is valid",async()=>{
  const token =new User({isAdmin:true}).getAuthToken();
  const customer =new Customer({name:"customer1"},{phoneNumber:"123456789"})
  await customer.save();
  const res = await req
  .delete("/api/customers/"+ customer._id)
  .set("x-auth-token",token) 
})*/
})
})
})





 


