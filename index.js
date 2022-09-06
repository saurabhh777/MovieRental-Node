require("express-async-errors");
const express =require("express");
const app =express();
require("./startup/logging")();
require("./startup/cors")(app);
require("./startup/db")();
require("./startup/routes")(app);
require("./startup/config")();
require("./startup/prod")(app);
if(process.env.NODE_ENv !="test"){
require("./startup/port")(app);
}

module.exports= app;




