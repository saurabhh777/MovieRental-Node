const jwt =require("jsonwebtoken");
const config=require("config");
module.exports=function(req,res,next){
    const token =req.header("x-auth-token");
    
    if (!token)return res.status(401).send("Acees denied,no token provied")
    try{
    const payload=jwt.verify(token,config.get("jwtPrivatekey"));
    req.user=payload;
    next();
    }catch(ex){
res.status(400).send("Invalid token");
    }
};

/*
create admin user
login
use that token in delete genre
add auth middleware to put in genre
auth post put
auth admin delete
in customer rentals and movies
*/