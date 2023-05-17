const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");

const router = require("./routes/userRoutes");
const { checkUser, isUser } = require("./middleware/userMiddleware");

const app = express();
dotenv.config();

const port = process.env.PORT || 3000;

// middleware
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());

// view engine
app.set("view engine", "ejs");

// database connection //
const dbURL = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.k688ukc.mongodb.net/node-auth`;
const localURL = "mongodb://localhost/Users";

mongoose
  .connect(localURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((result) =>
    app.listen(3000, () => console.log(`Listening to port ${port}`))
  )
  .catch((err) => console.log(err));

app.get("*", checkUser);
app.get("/", (req, res) => res.render("home"));
app.use(router);
