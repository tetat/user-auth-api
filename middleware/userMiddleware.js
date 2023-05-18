require("dotenv").config();
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    res.locals.user = null;
    next();
  } else {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        next();
      } else {
        // console.log(decodedToken.userName);
        const user = await User.findOne({ userName: decodedToken.userName });
        res.locals.user = user;
        next();
      }
    });
  }
};

const validToken = (token) => {
  let result = false;
  if (!token) return result;
  jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
    if (!err) {
      // console.log(err.message);
      result = true;
    }
  });
  return result;
};

const isUser = (req, res, next) => {
  const token = req.cookies.jwt;
  const result = validToken(token);
  // console.log(result);
  if (!result) res.redirect("/login");
  else next();
};

const isNotUser = (req, res, next) => {
  const token = req.cookies.jwt;
  const result = validToken(token);
  if (result) res.redirect("/");
  else next();
};

const isMe = (req, res, next) => {
  const requestedUserName = req.params.userName;
  const token = req.cookies.jwt;
  let deleteUser = false;
  jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
    if (requestedUserName === decodedToken.userName) {
      deleteUser = true;
    }
  });
  if (deleteUser) next();
  else res.redirect("/");
};

module.exports = { isUser, isNotUser, checkUser, isMe };
