const config= require("config");

module.exports =function(){
  
if(!config.get("jwtPrivatekey")){
console.log("fatal error,jwtprivatekey is not set");
process.exit(1);    
}
}