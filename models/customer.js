const mongoose = require("mongoose");
const Joi = require("joi");
const customerSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minlength:5,
      maxlength:50,
      
    },
    phoneNumber:{
      type: String,
      required:true,
      minlength: 7,
      maxlength: 10,
    },
    isGold:{
      type:Boolean,
      default:false,
    },
  });
  const Customer=mongoose.model("Customer",customerSchema);
  function validateCustomer(customer){
    const schema=Joi.object({
      name:Joi.string().required().min(5).max(50),
      phoneNumber:Joi.string().min(7).max(10).required(),
      isGold:Joi.boolean().default(false),
      _id:Joi.objectId()
    });
    return schema.validate(customer);
  }
  module.exports.Customer=Customer;
  module.exports.validateCustomer=validateCustomer;
  module.exports.customerSchema=customerSchema;
  