require('dotenv').config()
const mongoose = require("mongoose");


mongoose.connect(process.env.DB_KEY).then(()=>{
    console.log('Connected to Database')
}).catch(()=>{
    console.log("Error in Connection")
})

