const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          // Validate that the username (full name) contains only letters and spaces
          return /^[a-zA-Z\s]+$/.test(value);
        },
        message: (props) => `${props.value} is not a valid full name!`,
      },
    },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (value) {
          // Validate that the phone number matches the format 01212345678
          return /^01[0-9]{9}$/.test(value);
        },
        message: (props) =>
          `${props.value} is not a valid phone number! The format should be 01212345678.`,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
