const mongoose=require("mongoose");
const Joi=require("joi");
const jwt =require("jsonwebtoken");
const config=require("config");
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength:3,
        maxlength:50,
        
      },
      email:{
        type:String,
        unique:true,
        required: true,
        minlength:5,
        maxlength:255,
      },
      password:{
        type: String,
        required: true,
        minlength:5,
        maxlength:1024,  
      },
      isAdmin:{
        type:Boolean,
        default:false,
      },
});
userSchema.methods.getAuthToken =function(){
 return jwt.sign(
    {_id: this._id,isAdmin:this.isAdmin},
   config.get("jwtPrivatekey")
  );
  
}
const User=mongoose.model("User",userSchema);
function validateUser(user){
  const schema=Joi.object({
    name:Joi.string().required().min(3).max(50),
    email:Joi.string().email().min(5).max(255).required(),
    password:Joi.string().min(5).max(1024).required(),
    isAdmin:Joi.boolean().default(false),
  });
  return schema.validate(user);
}
module.exports.User=User;
module.exports.validateUser=validateUser;
module.exports.userSchema=userSchema;