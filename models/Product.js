const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    title: {
       type: String, required: true, unique: true 
      },
    desc: {
       type: String, required: true
       },
    image: { 
      type: String,
      required: true
    },
    images: [{
      type: String,
    }],
    categories: {
       type: Array 
      },
    size: { 
      type: String 
    },
    price: {
       type: Number, required: true
       },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
