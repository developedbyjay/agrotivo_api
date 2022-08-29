const mongoose = require('mongoose')

const vendorSchema = new mongoose.Schema({
    whatsapp_number: {
        type: Number
    }
},{timestamps:true})


module.exports = mongoose.model("Vendor", vendorSchema);