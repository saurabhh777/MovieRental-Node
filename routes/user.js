const express = require("express");
const {User,validateUser}=require("../models/user")

const router = express.Router();
const _=require("lodash");
const bcrypt=require("bcrypt");




router.get("/", async (req, res) => {
    const users = await User.find();
    res.send(users);
  });
  
  router.get("/:id", async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) return res.status(404).send("user with given is is not found");
    res.send(user);
    
  });
  router.post("/",async(req,res)=>{
    const {error}=validateUser(req.body);
    if(error)return res.status(400).send(error.details[0].message);
    let user = await User.findOne({email:req.body.email});
    if (user) return res.status(400).send("user already registered");
    
     user =new User({
      name:req.body.name,
      email:req.body.email, 
      password:req.body.password,
      isAdmin:req.body.isAdmin, 
});
const salt=await bcrypt.genSalt(10);
console.log(salt);
user.password= await bcrypt.hash(user.password,salt);
await user.save();

  res.send(_.pick(user,["_id","name","isAdmin","email"]));
}); 


router.put("/:id",async(req,res)=>{
  const {error}=validateUser(req.body.id);
  if(error)return res.status(400).send(error.details[0].message);
 
  const user =await User.findById(req.params.id);
  if(!user)return res.status(404).send("user with given id is not found");
 user.name=req.body.name;
 user.email=req.body.email; 
 user.password=req.body.password;
 user.isAdmin=req.body.isAdmin;
 await user.save();
  res.send(user);
});
router.delete("/:id", async (req, res) =>{
  try{
  const user = await User.findByIdAndRemove(req.params.id);
  if (!user) return res.status(404).send("user with id not found");
res.send(user);
  }catch(ex){
    console.log(ex.message);
  }
});

  module.exports = router;
  
