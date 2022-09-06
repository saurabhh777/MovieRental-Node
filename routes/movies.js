const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const { Genre } = require("../models/genres");
const { validateMovie, Movie } = require("../models/movies");
const validateObjectId=require("../middleware/validateObjectid");
const auth=require("../middleware/auth");
const admin=require("../middleware/admin");
const res = require("express/lib/response");



router.get("/count",async(req,res) =>{
  const {genreName,title}=req.query;

  let query= {}
  if(genreName) query["genre.name"]=genreName;
  //if(title) query["title"]=new RegExp(title,"i");
  //if(title) query["title"]=title;
  const count= await Movie.find(query).count();
 
  res.send({moviesCount:count});
});


router.get("/",async(req,res)=>{
const movies=await Movie.find();
res.send(movies) 
})


router.post("/pfs",async(req,res)=>{
  const {pageSize,currentPage,genreName,title,sortColumn}=req.body;
  console.log(pageSize);
  console.log(currentPage);
  let limit=0;
  let skip=0;
  if(pageSize&&currentPage){limit=pageSize;skip=(currentPage -1)*pageSize}
 
 
let query={};
//if(title) query["title"]=title;
if(genreName) query["genre.name"]=genreName;
if(title) query["title"]=new RegExp(title,"i");

let sort={};
if(sortColumn){
 const {path,order}=sortColumn;
 sort[path]=order;
 console.log(sort); 
}
console.log(query)
const movies=await Movie.find(query).limit(limit).skip(skip).sort(sort);
res.send(movies);

  
})

router.get("/:id",validateObjectId,async(req,res)=>{
  const movies =await Movie.findById(req.params.id);
  if(!movies)return res.status(404).send("movie with given id is not found");
  res.send(movies);
});

router.post("/",auth, async (req, res) => {
  try {
    const { error } = validateMovie(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send("Invalid genre");
    const movie = new Movie({
      title: req.body.title,
      dailyRentalRate: req.body.dailyRentalRate,
      numberInStock: req.body.numberInStock,
      genre: {
        _id: genre._id,
        name: genre.name
},
    });
    await movie.save();
    res.send(movie);
  } catch (ex) {
    console.log(ex.message);
  }
});
router.put("/:id",[auth,validateObjectId],async(req,res)=>{
  const {error}=validateMovie(req.body);
  if(error)return res.status(400).send(error.details[0].message);
  
  
  const movie =await Movie.findById(req.params.id);
  if(!movie)return res.status(404).send("movie with given id is not found");
  const genre=await Genre.findById(req.body.genreId)
if(!genre)return res.status(404).send("Invalid genre")

  movie.title =req.body.title;
  movie.dailyRentalRate= req.body.dailyRentalRate;
  movie.numberInStock= req.body.numberInStock;
  movie.genre={
    _id:genre._id,
    name:genre.name,
  };

await movie.save();
  res.send(movie);
});
router.delete("/:id",[auth,admin,validateObjectId],async(req,res)=>{
  
  const movie =await Movie.findByIdAndRemove(req.params.id);
  if(!movie)return res.status(404).send("movie with given id is not found");
  res.send(movie);
});


module.exports = router;
