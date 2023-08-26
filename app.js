const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");

const router = require("./routes/userRoutes");
const { checkUser } = require("./middleware/userMiddleware");

const app = express();
dotenv.config();

const port = process.env.PORT || 3000;

// middleware
app.use(cors({}));
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());

// view engine
app.set("view engine", "ejs");

// database connection //
const localURL = "mongodb://localhost/Users";

mongoose
  .connect(process.env.DB_URL, {
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
