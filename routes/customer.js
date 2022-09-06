const express = require("express");


const router = express.Router();
const{Customer,validateCustomer}=require("../models/customer")
const mongoose =require("mongoose");
const validateObjectId=require("../middleware/validateObjectid");

router.get("/",async(req,res)=>{
    const customer= await Customer.find();
    res.send(customer);
});
router.get("/:id",validateObjectId,async(req,res)=>{
    const customer=await Customer.findById(req.params.id);
    if(!customer)return res.status(404).send("customer with given id is not found");
    res.send(customer);
});
router.post("/",async(req,res)=>{
    const {error}=validateCustomer(req.body);
    if(error)return res.status(400).send(error.details[0].message);
    const customer =new Customer({
      name:req.body.name,
      phoneNumber:req.body.phoneNumber,  
});
await customer.save();
  res.send(customer);
}); 
router.put("/:id",validateObjectId,async(req,res)=>{
    const customer =await Customer.findById(req.params.id);
    if(!customer)return res.status(404).send("customer with given id is not found");
    const {error}=validateCustomer(req.body);
    if(error)return res.status(400).send(error.details[0].message);
    customer.name =req.body.name
    customer.phoneNumber =req.body.phoneNumber
    customer.isGold =req.body.isGold
    await customer.save();
    res.send(customer);
});
router.delete("/:id",validateObjectId,async(req,res)=>{
try{
    const customer=await Customer.findByIdAndRemove(req.params.id);
    if (!customer) return res.status(404).send("customer with id not found");
    res.send(customer);

} catch(ex){
    console.log(ex.message);

} 
});


  

module.exports=router;
