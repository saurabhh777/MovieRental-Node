
const express = require("express");


const router = express.Router();
const{Genre,validateGenre}=require("../models/genres") 
const auth =require("../middleware/auth");
const admin =require("../middleware/admin");
const mongoose =require("mongoose");
const validateObjectId=require("../middleware/validateObjectid");


router.get("/",async(req,res) =>{
try{
  const genres= await Genre.find();
  res.send(genres);
}catch(ex){
  next(ex);
}
});
router.get("/:id",validateObjectId,async(req,res)=>{
  
  const genre =await Genre.findById(req.params.id);
  if(!genre)return res.status(404).send("Genre with given id is not found");
  res.send(genre);
});
router.post("/",auth,async(req,res)=>{
  const {error}=validateGenre(req.body);
  if(error)return res.status(400).send(error.details[0].message);
  const genre =new Genre({
    name:req.body.name,
  });
  await genre.save();
  res.send(genre);
});
router.put("/:id",[auth,validateObjectId],async(req,res)=>{
  
  const {error}=validateGenre(req.body);
  if(error)return res.status(400).send(error.details[0].message);
  const genre =await Genre.findById(req.params.id);
  if(!genre)return res.status(404).send("Genre with given id is not found");
  genre.name =req.body.name 
  await genre.save();
  res.send(genre);
})

router.delete("/:id",[auth,admin,validateObjectId],async (req, res) =>{
  try{
  const genre = await Genre.findByIdAndRemove(req.params.id);
  if (!genre) return res.status(404).send("genre with id not found");
res.send(genre);
  }catch(ex){
    console.log(ex.message);
  }
});
module.exports=router;

