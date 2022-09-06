const mongoose = require("mongoose");
const Joi = require("joi");
const genreSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50,
    },
  });
  const Genre=mongoose.model("Genre",genreSchema);
  function validateGenre(genre){
    const schema=Joi.object({
      name:Joi.string().required().min(5).max(50),
      _id:Joi.objectId()
    });
    return schema.validate(genre);
  }
  module.exports.Genre=Genre;
  module.exports.genreSchema=genreSchema;
  module.exports.validateGenre=validateGenre;
  
