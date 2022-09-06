const winston=require("winston");
module.exports= function(ex,req,res,next){
    winston.error(ex.message,ex);
    res.status(500).send("something faild");
};