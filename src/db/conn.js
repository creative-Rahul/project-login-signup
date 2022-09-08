const mongoose = require("mongoose")

mongoose.connect('mongodb://localhost:27017/learning',{
    
}).then(()=>{
    console.log("Successfully connected to mongoDB");
}).catch((err)=>{console.log(err);})