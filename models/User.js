const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const shortid = require('shortid')
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 7,
    },
    
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is required");
        }
      },
    },
    phone_number: {
      type: Number,
      unique: true,
      required: true,
    },
    enable: {
      type: Boolean,
      default: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isVendor: {
      type: Boolean,
      default: false,
    },
    referral_balance: {
      type: Number,
      default: 0,
    },
    // Vendors
    balance: {
      type: Number,
      default: 0,
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],

    // Invitee referral link('It is Optional')
    referral: {
      type: String,
    },
    // Your Own referral link
    referral_ID: {
      type: String,
      default: shortid.generate
    },
//     image: {
//       type: String,
//       required:true
//     },
    // Transcation history
    history: [
        {
        type: Object,
        }
    ],
      // Investment History
    investment_history :[
      {
        type: Object
      }
    ],
  },
  { timestamps: true }
);

// Hash  plainText Password Before Saving
UserSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

module.exports = mongoose.model("User", UserSchema);
