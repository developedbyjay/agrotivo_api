const mongoose = require("mongoose");
const validator = require("validator");

const withdrawSchema = new mongoose.Schema(
  {
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
      },
    account_number: {
      type: Number,
      required: true,
    },
    account_name: {
      type: String,
      required: true,
    },
    bank_name: {
      type: String,
      required: true,
    },
    amount:{
      type: Number,
      required: true,
      validate(value) {
        if (value < 1000) {
          throw new Error("You can only withdraw 1000 and above");
        }
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Withdraw", withdrawSchema);
