const mongoose  = require("mongoose");
require("dotenv").config();

mongoose.
connect(process.env.MONGO_URL,{
    useNewUrlParser:true
}).then(()=>{
    console.log('Connected to MONGODB')
}).catch((err)=>{
    console.error("Failed connected to MONGODB",err)
});

module.exports = mongoose;