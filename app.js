const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const router = require("./routes/userRoutes");

const app = express();
dotenv.config();

app.use(express.json());

const port = process.env.PORT || 3000;

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

app.use(router);
