const mongoose=require("mongoose");
const Joi=require("joi");
const {customerSchema}=require("./customer");
Joi.objectId=require("joi-objectid")(Joi);

const rentalSchema = new mongoose.Schema({
    customer: {
      type: customerSchema,
      required: true,
    },
    movie: {
      required: true,
      type: new mongoose.Schema({
        title: {
          type: String,
          required: true,
          minlength: 3,
          maxlength: 50,
        },
        dailyRentalRate: {
          type: Number,
          required: true,
          min: 0,
          max: 10,
        },
      }),
    },
    dateOut: {
      type: Date,
      default: Date.now,
    },
    dateIn: Date,
    rentalFee: {
   type: Number,
      min: 0,
      max: 100,
      required: true,
    },
  });
  const Rental = mongoose.model("Rental", rentalSchema);

  function validateRental(rental) {
    const schema = Joi.object({
      customerId: Joi.objectId().required(),
      movieId: Joi.objectId().required(),
      _id:Joi.objectId()
    });
    return schema.validate(rental);
  }
  
  module.exports.Rental = Rental;
  
  module.exports.validateRental = validateRental;
