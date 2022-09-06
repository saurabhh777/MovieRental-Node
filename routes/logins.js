const express= require("express");
const router=express.Router();
const{User}=require("../models/user");
const bcrypt= require("bcrypt");
const Joi=require("joi");
const jwt =require("jsonwebtoken");
const config=require("config");

router.post("/",async(req,res)=>{
 const{error}=validateInput(req.body) ;
 if(error)return res.status(400).send(error.details[0].message); 
 const user = await User.findOne({ email: req.body.email });
 

 if(!user)return res.status(404).send("User with given id is not found");
 
 const isValid =await bcrypt.compare(req.body.password,user.password);
 if(!isValid)return res.status(400).send("invalid email or password")
 const token =user.getAuthToken();
   
 res.send(token);
 });
 
 function validateInput(input){
  
   const schema=Joi.object({
email:Joi.string().email().min(5).max(255).required(),
password:Joi.string().min(5).max(1024).required(), 
         
  });
  return schema.validate(input);
 }
 module.exports = router;
