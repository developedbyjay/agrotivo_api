const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const shortid = require('shortid')
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      reguired: true,
      trim: true,
    },
    password: {
      type: String,
      reguired: true,
      minlength: 7,
      trim: true,
      validate(value) {
        if (value.toLowerCase().includes("password")) {
          throw new Error("Password must be unique");
        }
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
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
    age: {
      type: Number,
      default: 0,
      required: true,
      validate(value) {
        if (value < 0) {
          throw new Error("Age must be a positive number");
        }
      },
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
    image: {
      type: String,
      required: true,
    },
    // Transcation history
    history: [
        {
        type: Object,
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
