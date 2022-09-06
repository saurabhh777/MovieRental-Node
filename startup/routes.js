const express = require("express");
const genres= require("../routes/genres");
const customer=require("../routes/customer");
const movies=require("../routes/movies");
const rental=require("../routes/rental");
const user=require("../routes/user");
const logins=require("../routes/logins");
const error =require("../middleware/error");


module.exports=function(app){
app.use(express.json())
app.use("/api/genres",genres);
app.use("/api/customers",customer)
app.use("/api/movies",movies)
app.use("/api/rentals",rental)
app.use("/api/users",user)
app.use("/api/logins",logins)
app.use(error);

}