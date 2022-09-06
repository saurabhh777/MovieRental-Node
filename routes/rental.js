const express = require("express");
const { Movie } = require("../models/movies");
const { Rental, validateRental } = require("../models/rental");
const { Customer } = require("../models/customer");
const router = express.Router();
const Fawn = require("fawn");
const mongoose =require("mongoose");
const validateObjectId=require("../middleware/validateObjectid");

//Fawn.init("mongodb://localhost/movie-rental-project");

router.get("/", async (req, res) => {
  const rentals = await Rental.find();
  res.send(rentals);
});

router.get("/:id",validateObjectId,async (req, res) => {
  const rental = await Rental.findById(req.params.id);
  if (!rental) return res.status(404).send("Rental with given id is not found");
  res.send(rental);
});

router.post("/",async (req, res) => {
  const { error } = validateRental(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(404).send("Movie with given id is not found");

  const customer = await Customer.findById(req.body.customerId);
  if (!customer)
    return res.status(404).send("Customer with given id is not found");

  if (movie.numberInStock <= 0) return res.send("Movie out of stock");

  const rental = new Rental({
    customer: {
      name: customer.name,
      phoneNumber: customer.phoneNumber,
      isGold: customer.isGold,
      _id: customer._id,
    },
    movie: {
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate,
      _id: movie._id,
    },
    rentalFee: movie.dailyRentalRate * 10,
  });
  const session = await Rental.startSession();
  session.startTransaction();
  try{
    await rental.save();
    await Movie.findByIdAndUpdate(movie._id,{$inc:{numberInStock:-1}});
    await session.commitTransaction();
    session.endSession();
    res.send(rental);
  }catch(error){
    session.abortTransaction();
    session.endSession();
    throw error;
  };

  // try {
  //   Fawn.Task()
  //     .save("rentals", rental)
  //     .update("movies", { _id: movie._id }, { $inc: { numberInStock: -1 } })
  //     .run();
  //   res.send(rental);
  // } catch (ex) {
  //   res.status(500).send("Something failed");
  // }
});
router.patch("/:id",validateObjectId,async (req, res) => {
  const rental = await Rental.findById(req.params.id);
  if (!rental) return res.status(404).send("Rental with given id is not found");
  rental.dateIn = new Date();

  
  const session = await Rental.startSession();
  session.startTransaction();
  try{
    
    await Rental.findByIdAndUpdate(rental._id,{ $set: {dateIn:rental.dateIn}});
    await Movie.findByIdAndUpdate(rental.movie._id,{$inc:{numberInStock:1}});
    await session.commitTransaction();
    session.endSession();
    res.send(rental);
  }catch(error){
    session.abortTransaction();
    session.endSession();
    throw error;
  };


  // try {
  //   Fawn.Task()
  //     .update(
  //       "rentals",
  //       { _id: rental._id },
  //       { $set: { dateIn: rental.dateIn } }
  //     )
  //     .update(
  //       "movies",
  //       { _id: rental.movie._id },
  //       { $inc: { numberInStock: 1 } }
  //     )
  //     .run();
  //   res.send(rental);
  // } catch (ex) {
  //   res.status(500).send("Something failed");
  // }
});







router.delete("/:id",validateObjectId, async (req, res) => {
  const rental = await Rental.findById(req.params.id);
  if (!rental) return res.status(404).send("Rental with given id is not found");
 


  rental.dateIn = new Date();
  const session = await Rental.startSession();
  session.startTransaction();
  try{
    
    await Rental.findByIdAndDelete(rental._id);
    await Movie.findByIdAndUpdate(rental.movie._id,{$inc:{numberInStock:1}});
    await session.commitTransaction();
    session.endSession();
    res.send(rental);
  }catch(error){
    session.abortTransaction();
    session.endSession();
    throw error;
  };

  // try {
  //   Fawn.Task()
  //     .remove("rentals", { _id: rental._id })
  //     .update(
  //       "movies",
  //       { _id: rental.movie._id },
  //       { $inc: { numberInStock: 1 } }
  //     )
  //     .run();
  //   res.send(rental);
  // } catch (ex) {
  //   res.status(500).send("Something failed");
  // }
});




module.exports = router;
