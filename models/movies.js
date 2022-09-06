const mongoose = require("mongoose");
const Joi =require("joi");



const {genreSchema}=require("./genres")
Joi.objectId=require("joi-objectid")(Joi);

const movieSchema = new mongoose.Schema({
    title:{
    type: String,
    required: true,
    minlength:3,
    maxlength:50,    
    },
    dailyRentalRate:{
        type: Number,
        required: true,
        minlength:0,
        maxlength:10,    
        },
        numberInStock:{
            type: Number,
            required: true,
            minlength:0,
            maxlength:10,    
            },
genre:{
required:true,
type: genreSchema,
},
});
const Movie = mongoose.model("Movie",movieSchema);
function validateMovie(movie){
    const schema =Joi.object({
    title: Joi.string().min(3).max(50).required(), 
    dailyRentalRate: Joi.number().min(0).max(10).required(),
    numberInStock: Joi.number().min(0).max(10).required(),
    genreId: Joi.objectId().required(),
    _id:Joi.objectId()
    });

return schema.validate(movie);
}



module.exports.Movie = Movie;
module.exports.movieSchema=movieSchema;

module.exports.validateMovie=validateMovie;

  
