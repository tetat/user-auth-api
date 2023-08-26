require("dotenv").config();
const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "Please enter your first name"],
    trim: true,
    minlength: [2, "Minimum length of first name must be 2 characters long"],
  },
  lastName: {
    type: String,
    required: [true, "Please enter your last name"],
    trim: true,
    minlength: [2, "Minimum length of last name must be 2 characters long"],
  },
  userName: {
    type: String,
    required: [true, "Please enter your user name"],
    trim: true,
    minlength: [4, "Minimum length of user name must be 4 characters long"],
  },
  email: {
    type: String,
    required: [true, "Please enter an email"],
    uniqure: true,
    lowercase: true,
    trim: true,
    validate: [isEmail, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please enter password"],
    trim: true,
    minlength: [6, "Minimum password length is 6 characters"],
  },
});

// function to encrypt password before doc save
userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// method to log in user
userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) return user;
    throw Error("incorrect password");
  }
  throw Error("incorrect email");
};

const User = mongoose.model("user", userSchema);

module.exports = User;
