const winston = require("winston");
require("winston-mongodb");
module.exports=function(){
    winston.configure({
        transports:[
        new winston.transports.File({filename:"logfile.log"}),
        // new winston.transports.MongoDB(
        // {
        //     db:"mongodb://localhost/movie-rentalproject",
        //     options:{useUnifiedTopology:true},
        //  }),
    ],
    });
    process.on("uncaughtException",(ex)=>{
     console.log("we have got uncaught expction ");  
     console.log(ex.message)
     winston.error(ex.message);
        setTimeout(()=>
        {process.exit(1);
        },2000);
    });
    process.on("unhandledRejection",(ex)=>{
        console.log("we have got unhandled rejection");
        console.log(ex.message)
        winston.error(ex.message);
        setTimeout(()=>
        {process.exit(1);
        },2000);
    });
}